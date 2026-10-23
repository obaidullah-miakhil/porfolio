import http from 'node:http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${urlPath}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    }).on('error', reject);
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

async function runTests() {
  console.log(`Starting comprehensive UI & Requirements validation against ${BASE_URL}...\n`);

  // 1. Home Page (LTR, English)
  const home = await fetchPage('/');
  assert(home.statusCode === 200, 'Home page returns HTTP 200');
  assert(home.headers['content-security-policy'], 'Home page includes Content-Security-Policy header');
  assert(home.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff header present');
  assert(home.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer-Policy header present');
  assert(home.headers['permissions-policy'], 'Permissions-Policy header present');
  assert(home.body.includes('lang="en"'), 'Home page has lang="en"');
  assert(home.body.includes('dir="ltr"'), 'Home page has dir="ltr"');
  assert(home.body.includes('<h1') && home.body.includes('Obaidullah Miakhil</h1>'), 'Home page has single H1 with Obaidullah Miakhil');
  assert(home.body.includes('AI Engineer &amp; Machine Learning Researcher') || home.body.includes('AI Engineer & Machine Learning Researcher'), 'Role line rendered correctly');
  assert(home.body.includes('Viewing as:'), 'Audience switch present');
  assert(home.body.includes('Research') && home.body.includes('Industry'), 'Audience options (Research, Industry) present');
  assert(home.body.includes('github.com/obaidullah-miakhil'), 'GitHub handle prominently featured');
  assert(home.body.includes('scholar.google.com/citations?user=JVFkpVgAAAAJ'), 'Google Scholar profile URL present');
  assert(home.body.includes('researchgate.net/profile/Obaidullah-Miakhil'), 'ResearchGate profile URL present');
  assert(home.body.includes('A machine learning framework for predicting healthcare insurance claim denials'), 'Featured publication title present');
  assert(home.body.includes('Scopus Q1'), 'Scopus Q1 badge present on featured publication');
  assert(home.body.includes('Peer-reviewed'), 'Peer-reviewed badge present');
  assert(home.body.includes('Open access'), 'Open access badge present');
  assert(home.body.includes('PR-AUC 0.777'), 'PR-AUC metric from paper present');
  assert(home.body.includes('10.3389/frhs.2026.1927175'), 'DOI link present on publication');
  assert(home.body.includes('obaidullah-miakhil.jpg'), 'Profile photo present in About section');
  assert(home.body.includes('capital-import-export-desktop.webp'), 'Capital Import Export screenshot present');
  assert(home.body.includes('swift-bulk-traders-desktop.webp'), 'Swift Bulk Traders screenshot present');
  assert(home.body.includes('aria-label="Chat on WhatsApp"'), 'Floating WhatsApp button present');
  assert(home.body.includes('@type":"ProfilePage"') && home.body.includes('@type":"Person"'), 'JSON-LD ProfilePage & Person graph rendered');

  // 2. Research Page
  const research = await fetchPage('/research');
  assert(research.statusCode === 200, 'Research page returns HTTP 200');
  assert(research.body.includes('Research projects'), 'Research projects section present');
  assert(research.body.includes('Weakly-supervised ICH detection'), 'ICH thesis project present');
  assert(research.body.includes('STC-RNN'), 'STC-RNN financial forecasting project present');
  assert(research.body.includes('Federated learning'), 'Federated learning project present');
  assert(research.body.includes('@type":"ScholarlyArticle"'), 'ScholarlyArticle JSON-LD present on /research');

  // 3. Projects Page
  const projects = await fetchPage('/projects');
  assert(projects.statusCode === 200, 'Projects page returns HTTP 200');
  assert(projects.body.includes('Code on GitHub'), 'GitHub profile banner present on /projects');
  assert(projects.body.includes('emotion_detector_v1') || projects.body.includes('Emotion Detector'), 'Emotion detector repo present');
  assert(projects.body.includes('Network-scanner') || projects.body.includes('Network Scanner'), 'Network scanner repo present');
  assert(projects.body.includes('Capital Import Export'), 'Capital Import Export website present');
  assert(projects.body.includes('Swift Bulk Traders'), 'Swift Bulk Traders website present');

  // 4. CV Page
  const cv = await fetchPage('/cv');
  assert(cv.statusCode === 200, 'CV page returns HTTP 200');
  assert(cv.body.includes('Curriculum vitae'), 'CV heading present');
  assert(cv.body.includes('M.S. Artificial Intelligence'), 'MS AI education present');
  assert(cv.body.includes('B.S. Computer Science'), 'BS CS education present');
  assert(cv.body.includes('Research Engineer'), 'Experience section present');
  assert(cv.body.includes('Allama Iqbal Scholarship'), 'Awards present');
  assert(cv.body.includes('Google Advanced Data Analytics'), 'Certifications present');
  assert(cv.body.includes('no-print'), 'Print button with no-print class present');

  // 5. RTL Locales: Pashto (/ps), Dari (/fa), Urdu (/ur)
  const ps = await fetchPage('/ps');
  assert(ps.statusCode === 200, 'Pashto page returns HTTP 200');
  assert(ps.body.includes('lang="ps"'), 'Pashto page has lang="ps"');
  assert(ps.body.includes('dir="rtl"'), 'Pashto page has dir="rtl"');
  assert(ps.body.includes('عبیدالله میاخیل'), 'Pashto page contains Pashto name string');

  const fa = await fetchPage('/fa');
  assert(fa.statusCode === 200, 'Dari page returns HTTP 200');
  assert(fa.body.includes('lang="fa"'), 'Dari page has lang="fa"');
  assert(fa.body.includes('dir="rtl"'), 'Dari page has dir="rtl"');

  const ur = await fetchPage('/ur');
  assert(ur.statusCode === 200, 'Urdu page returns HTTP 200');
  assert(ur.body.includes('lang="ur"'), 'Urdu page has lang="ur"');
  assert(ur.body.includes('dir="rtl"'), 'Urdu page has dir="rtl"');

  // 6. Technical SEO
  const sitemap = await fetchPage('/sitemap.xml');
  assert(sitemap.statusCode === 200, 'sitemap.xml returns HTTP 200');
  assert(sitemap.body.includes('hreflang="ps"') && sitemap.body.includes('hreflang="fa"') && sitemap.body.includes('hreflang="ur"'), 'sitemap.xml has all hreflang alternates');

  const robots = await fetchPage('/robots.txt');
  assert(robots.statusCode === 200, 'robots.txt returns HTTP 200');
  assert(robots.body.includes('Sitemap:'), 'robots.txt references sitemap');

  const manifest = await fetchPage('/manifest.webmanifest');
  assert(manifest.statusCode === 200, 'manifest.webmanifest returns HTTP 200');

  const icon = await fetchPage('/icon');
  assert(icon.statusCode === 200, 'Dynamic /icon returns HTTP 200');

  console.log('\n========================================');
  console.log('ALL UI & REQUIREMENTS VALIDATIONS PASSED!');
  console.log('========================================\n');
}

runTests().catch((err) => {
  console.error('Fatal error during UI test:', err);
  process.exit(1);
});
