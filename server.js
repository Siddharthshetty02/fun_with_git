import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = 3000;

const quotes = [
  "Code is like humor. When you have to explain it, it’s bad. – Cory House",
  "First, solve the problem. Then, write the code. – John Johnson",
  "Simplicity is prerequisite for reliability. – Edsger W. Dijkstra",
  "Make it work, make it right, make it fast. – Kent Beck",
  "Talk is cheap. Show me the code. – Linus Torvalds"
];

const gitFacts = [
  "Git was created in 2005 by Linus Torvalds in just 10 days to support Linux kernel development!",
  "The name 'Git' was chosen by Linus Torvalds jokingly referring to himself: 'I name all my projects after myself. First Linux, now Git.'",
  "Git stores commits as full snapshots, using directed acyclic graphs (DAGs) rather than diff deltas.",
  "Every Git commit ID is a cryptographic hash, ensuring repository history cannot be altered without detection.",
  "Over 90% of developers worldwide rely on Git as their primary version control system."
];


const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // Set CORS headers for local development friendliness
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // --- API Endpoints ---
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      version: '1.1.0',
      message: 'Backend is up and running smoothly!',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/api/quote' && req.method === 'GET') {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ quote: randomQuote }));
    return;
  }

  if (pathname === '/api/git-fact' && req.method === 'GET') {
    const randomFact = gitFacts[Math.floor(Math.random() * gitFacts.length)];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ fact: randomFact }));
    return;
  }

  if (pathname === '/api/greet' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const userName = (data.name && data.name.trim()) ? data.name.trim() : 'Developer';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          greeting: `Hello, ${userName}! 👋`,
          note: `Received by Node.js server at ${new Date().toLocaleTimeString()}.`,
          receivedPayload: data
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // --- Static Files Serving ---
  let filePath = pathname === '/' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, pathname);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
