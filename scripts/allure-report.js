const { execSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');
const net = require('net');

const PORT = 9090;
const REPORT_DIR = 'allure-report';
const RESULTS_DIR = 'allure-results';
const HISTORY_SRC = path.join(REPORT_DIR, 'history');
const HISTORY_DST = path.join(RESULTS_DIR, 'history');

// Step 1: Preserve history from previous report into results
if (fs.existsSync(HISTORY_SRC)) {
    if (fs.existsSync(HISTORY_DST)) {
        fs.rmSync(HISTORY_DST, { recursive: true });
    }
    fs.cpSync(HISTORY_SRC, HISTORY_DST, { recursive: true });
    console.log('✔ Allure history preserved from previous run');
} else {
    console.log('ℹ No previous Allure history found (first run)');
}

// Step 2: Generate fresh report (includes history from allure-results/history)
execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
console.log('✔ Allure report generated');

// Step 3: Check if our server is already running
function isPortInUse(port) {
    return new Promise((resolve) => {
        const s = net.createServer();
        s.once('error', () => resolve(true));
        s.once('listening', () => { s.close(); resolve(false); });
        s.listen(port);
    });
}

// Serve static files from allure-report
function startServer() {
    const mimeTypes = {
        '.html': 'text/html', '.js': 'application/javascript',
        '.css': 'text/css', '.json': 'application/json',
        '.png': 'image/png', '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon', '.mp4': 'video/mp4',
        '.woff': 'font/woff', '.woff2': 'font/woff2',
    };

    const server = http.createServer((req, res) => {
        let filePath = path.join(REPORT_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                });
                res.end(content);
            }
        });
    });

    server.listen(PORT, () => {
        console.log(`✔ Allure server running at http://localhost:${PORT}`);
        console.log('  Keep this terminal open. Re-run tests in another terminal.');
        console.log('  Refresh your browser to see updated results.');
    });
}

(async () => {
    const inUse = await isPortInUse(PORT);
    if (inUse) {
        console.log(`✔ Allure server already running at http://localhost:${PORT}`);
        console.log('  Just refresh your browser to see the updated report.');
    } else {
        startServer();
        execSync(`open http://localhost:${PORT}`);
    }
})();
