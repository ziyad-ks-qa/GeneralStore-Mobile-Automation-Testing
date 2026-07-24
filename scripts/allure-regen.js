const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORT_DIR = 'allure-report';
const RESULTS_DIR = 'allure-results';
const HISTORY_SRC = path.join(REPORT_DIR, 'history');
const HISTORY_DST = path.join(RESULTS_DIR, 'history');

// Preserve history
if (fs.existsSync(HISTORY_SRC)) {
    if (fs.existsSync(HISTORY_DST)) {
        fs.rmSync(HISTORY_DST, { recursive: true });
    }
    fs.cpSync(HISTORY_SRC, HISTORY_DST, { recursive: true });
}

// Regenerate report
execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
console.log('✔ Allure report regenerated. Refresh your browser at http://localhost:9090');
