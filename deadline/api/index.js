const http = require('http');
const url = require('url');
const cors = require('cors');

const DEADLINE_DATE = new Date('2025-04-04T00:00:00.000Z');

// Create CORS middleware options
const corsOptions = {
  origin: 'http://localhost:4200', // Your Angular app's URL
  methods: 'GET', // Only allow GET requests
  optionsSuccessStatus: 200 // For legacy browser support
};

const server = http.createServer((req, res) => {
  // Apply CORS headers
  cors(corsOptions)(req, res, () => {
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === '/api/deadline' && req.method === 'GET') {
      const now = new Date();
      const secondsLeft = Math.max(0, Math.floor((DEADLINE_DATE - now) / 1000));

      const response = { secondsLeft };

      res.writeHead(200, {
        'Content-Type': 'application/json',
        // Explicit CORS headers (redundant with cors middleware but good practice)
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'GET'
      });
      res.end(JSON.stringify(response));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Deadline API running at http://localhost:${PORT}/api/deadline`);
});
