const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORT_DIR = 'allure-report';
const RESULTS_DIR = 'allure-results';
const HISTORY_SRC = path.join(REPORT_DIR, 'history');
const HISTORY_DST = path.join(RESULTS_DIR, 'history');
const SCREENSHOTS_DST = path.join(RESULTS_DIR, 'screenshots');

// Preserve history
if (fs.existsSync(HISTORY_SRC)) {
    if (fs.existsSync(HISTORY_DST)) {
        fs.rmSync(HISTORY_DST, { recursive: true });
    }
    fs.cpSync(HISTORY_SRC, HISTORY_DST, { recursive: true });
}

// Copy JPEG screenshots into their own subfolder for easier manual review;
// originals stay in place since allure generate expects attachments flat in RESULTS_DIR
fs.mkdirSync(SCREENSHOTS_DST, { recursive: true });
for (const file of fs.readdirSync(RESULTS_DIR)) {
    if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
        fs.copyFileSync(path.join(RESULTS_DIR, file), path.join(SCREENSHOTS_DST, file));
    }
}

// Regenerate report
execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
console.log('✔ Allure report regenerated. Refresh your browser at http://localhost:9090');
