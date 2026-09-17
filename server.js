const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.env.PORT || 8081;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  let filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try directory index
      const idx = path.join(filePath, "index.html");
      if (!idx.startsWith(root)) {
        notFound(res);
        return;
      }
      fs.stat(idx, (err2, st2) => {
        if (err2 || !st2.isFile()) return notFound(res);
        serve(res, idx, st2);
      });
      return;
    }
    serve(res, filePath, stats);
  });
});

function serve(res, filePath, stats) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": mime[ext] || "application/octet-stream",
    "Content-Length": stats.size,
  });
  fs.createReadStream(filePath).pipe(res);
}

function notFound(res) {
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Page Not Found | StashrNode</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000315;font-family:'Inter',system-ui,sans-serif;color:#E0F9FF;text-align:center}h1{font-size:72px;margin:0;background:linear-gradient(135deg,#00B8FF,#20F0FF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}p{color:#B7C7E6}a{display:inline-block;margin-top:18px;padding:12px 26px;border-radius:40px;background:#00B8FF;color:#022154;font-weight:700;text-decoration:none}</style></head><body><div><h1>404</h1><p>This page has moved or doesn't exist on StashrNode.</p><a href=\"/\">Back to Home</a></div></body></html>"
  );
}

server.listen(port, () => {
  console.log("=== Website running at http://localhost:8080 ===");
});