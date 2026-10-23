import { profile, type GitHubProjectItem } from '@/content/profile';

export interface EnrichedGitHubRepo extends GitHubProjectItem {
  stars: number;
  updatedAt?: string;
}

export async function getGitHubRepos(): Promise<{
  repos: EnrichedGitHubRepo[];
  publicRepoCount: number;
}> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  let publicRepoCount = profile.githubProjects.length;

  try {
    const userRes = await fetch(
      `https://api.github.com/users/${profile.githubOwner}`,
      {
        headers,
        next: { revalidate: 86400 },
      }
    );
    if (userRes.ok) {
      const userData = await userRes.json();
      if (typeof userData.public_repos === 'number') {
        publicRepoCount = userData.public_repos;
      }
    }
  } catch {
    // Fallback to static count in profile.ts
  }

  const repos: EnrichedGitHubRepo[] = await Promise.all(
    profile.githubProjects.map(async (item) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${profile.githubOwner}/${item.repoName}`,
          {
            headers,
            next: { revalidate: 86400 },
          }
        );
        if (!res.ok) {
          return { ...item, stars: item.starsFallback };
        }
        const data = await res.json();
        return {
          ...item,
          language:
            typeof data.language === 'string' && data.language.length > 0
              ? data.language
              : item.language,
          stars:
            typeof data.stargazers_count === 'number'
              ? data.stargazers_count
              : item.starsFallback,
          updatedAt:
            typeof data.pushed_at === 'string' ? data.pushed_at : undefined,
        };
      } catch {
        return { ...item, stars: item.starsFallback };
      }
    })
  );

  return { repos, publicRepoCount };
}
