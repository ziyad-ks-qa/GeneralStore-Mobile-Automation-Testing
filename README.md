# General Store Mobile Automation Testing

Automated UI tests for **General Store**, a sample Android shopping app. The tests run on an Android emulator through Appium and WebdriverIO. They cover the user journey from the sign-in form through product selection to the cart. Results are published as an Allure report.

The manual test design behind these scripts is in `Test Suite_GeneralStore_MobileAutomationTesting.xlsx`.

## Tech stack

| Tool | Purpose |
| --- | --- |
| WebdriverIO 9 | Test runner (Mocha, BDD style) |
| Appium 3 + UiAutomator2 | Android automation driver |
| TypeScript | Test language |
| Allure | Test reporting |
| Playwright | Separate web test setup (not used for the Android app) |

## Repository structure

```text
.
├── tests/
│   ├── wdio/                 # Android app tests (*.spec.ts)
│   └── playwright/           # Playwright tests
├── scripts/                  # Allure report helper scripts
├── General-Store.apk         # App under test
├── Test Suite_GeneralStore_MobileAutomationTesting.xlsx
├── wdio.conf.ts              # WebdriverIO + Appium configuration
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Prerequisites

- Node.js (current LTS)
- Java JDK 11 or later. Both UiAutomator2 and the Allure command line need it.
- Android Studio with:
  - the Android SDK,
  - at least one emulator (AVD),
  - `ANDROID_HOME` set, and
  - `platform-tools` on your `PATH`.

## Setup

1. Clone the repository and install dependencies:

```bash
   git clone https://github.com/ziyadgitt/GeneralStore-Mobile-Automation-Testing.git
   cd GeneralStore-Mobile-Automation-Testing
   npm install
```

2. Install the UiAutomator2 driver and check the environment:

```bash
   npx appium driver install uiautomator2
   npm run appium:doctor
```

   Fix any required items that `appium:doctor` reports before continuing.

3. Start an emulator and confirm it is visible:

```bash
   adb devices
```

   The configuration expects `emulator-5554`. If your device has a different ID, update `appium:deviceName` in `wdio.conf.ts`.

## Running the tests

```bash
npm run test:wdio
```

WebdriverIO starts the Appium server itself, so you do not need to run Appium separately. The APK is installed on the emulator if it is not already there.

To run the tests and open the report in one step:

```bash
npm run test:wdio:report
```

## Reports

Each run writes raw results to `allure-results/`. Use these commands to work with the report:

| Command | What it does |
| --- | --- |
| `npm run allure:generate` | Builds the HTML report in `allure-report/` |
| `npm run allure:open` | Opens the generated report |
| `npm run allure:serve` | Builds and opens a temporary report in one step |
| `npm run allure:clean` | Deletes previous results and reports |

Allure attaches WebdriverIO steps and screenshots to each test, so you can see which step failed and what was on screen at the time.

## Test coverage

| Area | What is tested |
| --- | --- |
| [e.g. Sign-in form] | [e.g. country selection, name validation, gender selection] |
| [e.g. Product list] | [e.g. adding products to cart] |
| [e.g. Cart] | [e.g. item totals, purchase amount] |

The full list of test cases, with expected results, is in the test suite spreadsheet.

## Configuration notes

| Setting | Value | Why |
| --- | --- | --- |
| `appium:noReset` | `true` | Keeps app data between sessions for faster runs |
| `maxInstances` | `1` | Runs one test file at a time on a single emulator |
| `waitforTimeout` | 10 s | Default wait for elements |
| Mocha `timeout` | 300 s | Cart journeys scroll through the full product list several times |

Because `noReset` is enabled, a test that fails midway can leave the app in an unexpected state. If the next run behaves strangely, clear the app data on the emulator or set `noReset` to `false`.

## Author

Ziyad Al Khalis, QA Engineer
