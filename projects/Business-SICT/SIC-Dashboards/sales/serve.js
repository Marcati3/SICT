const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join('C:', 'Users', 'intln', 'Claude', 'Projects', 'Business-SICT', 'SIC-Dashboards', 'sales');
const port = 8766;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(dir, urlPath);
  console.log(`Request: ${req.url} -> ${filePath}`);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try listing directory for debugging
      console.log(`404: ${filePath} (${err.code})`);
      if (urlPath === '/index.html') {
        // List files as index
        fs.readdir(dir, (e, files) => {
          if (e) { res.writeHead(500); res.end('Error'); return; }
          const html = files.filter(f => f.endsWith('.html')).map(f => `<a href="/${f}">${f}</a><br>`).join('\n');
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(`<h1>Files in ${dir}</h1>${html}`);
        });
      } else {
        res.writeHead(404);
        res.end('Not found: ' + filePath);
      }
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'application/octet-stream'});
    res.end(data);
  });
});

server.listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}`));
