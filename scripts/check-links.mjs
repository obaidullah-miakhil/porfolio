import http from 'node:http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/',
  '/research',
  '/projects',
  '/cv',
  '/ps',
  '/ps/research',
  '/ps/projects',
  '/ps/cv',
  '/fa',
  '/fa/research',
  '/fa/projects',
  '/fa/cv',
  '/ur',
  '/ur/research',
  '/ur/projects',
  '/ur/cv',
  '/sitemap.xml',
  '/robots.txt',
  '/manifest.webmanifest',
  '/icon',
  '/apple-icon',
];

function checkRoute(path) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          headers: res.headers,
          bodyLength: data.length,
          ok: res.statusCode >= 200 && res.statusCode < 400,
        });
      });
    });

    req.on('error', (err) => {
      reject({ path, error: err.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject({ path, error: 'Request timeout' });
    });
  });
}

async function main() {
  console.log(`Checking internal links against ${BASE_URL}...`);
  let hasFailure = false;

  for (const route of ROUTES_TO_TEST) {
    try {
      const res = await checkRoute(route);
      if (res.ok) {
        console.log(`✓ [${res.statusCode}] ${route} (${res.bodyLength} bytes)`);
      } else {
        console.error(`✗ [${res.statusCode}] ${route} FAILED`);
        hasFailure = true;
      }
    } catch (err) {
      console.error(`✗ ${route} ERROR: ${err.error}`);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    console.error('\nBroken links detected!');
    process.exit(1);
  } else {
    console.log(`\nAll ${ROUTES_TO_TEST.length} routes responded with HTTP 200/OK. Zero broken links!`);
  }
}

main();
