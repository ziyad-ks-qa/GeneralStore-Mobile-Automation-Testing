# Running the General Store Mobile Automation Tests

This guide explains how to start Appium, run all test scripts, run a single test script, and generate or view the Allure report.

All commands are run from the project root (`mobile-app-test/`).

---

## 1. Prerequisites

- **Node.js** (LTS) and **npm**
- **Java JDK** (required by Allure and the Android tooling)
- **Android SDK** with `adb` on your `PATH`, and `ANDROID_HOME` set
- An **Android emulator** or a real device running and visible to `adb`
- The **General Store APK**: [General-Store.apk](./General-Store.apk) in the project root. In [wdio.conf.ts](./wdio.conf.ts), `appium:app` uses `path.resolve('./General-Store.apk')`, so run tests from the project root.

Install dependencies (first time only):

```bash
npm install
```

Install the Appium UiAutomator2 driver (first time only):

```bash
npx appium driver install uiautomator2
```

Check that the device or emulator is connected. It must match `appium:deviceName` in `wdio.conf.ts`, which defaults to `emulator-5554`:

```bash
adb devices
```

---

## 2. Start Appium

> **Note:** `wdio.conf.ts` uses `services: ['appium']`, so **WebdriverIO starts and stops Appium automatically** when you run tests. You don't need to start it yourself for normal runs.

To start Appium manually (for example, for Appium Inspector or debugging):

```bash
npm run appium
# or
npx appium
```

Appium listens on `http://127.0.0.1:4723` by default. Press `Ctrl + C` to stop it.

> Stop any manually started Appium server before running `npm run test:wdio`. Otherwise, the auto-started Appium service may conflict with it on port 4723.

Check the UiAutomator2 driver setup (Android SDK, Java, and so on):

```bash
npm run appium:doctor
```

---

## 3. Run all test scripts

Runs every spec under `tests/wdio/**/*.spec.ts`:

```bash
npm run test:wdio
```

When the run finishes, the `posttest:wdio` hook runs `scripts/allure-regen.js` automatically. That script regenerates the Allure report in `allure-report/`.

To run all tests **and** open the Allure report in the browser afterward:

```bash
npm run test:wdio:report
```

---

## 4. Run a single test script

Pass `--spec` with the path to one spec file:

```bash
npm run test:wdio -- --spec ./tests/wdio/landingScreen.spec.ts
```

Available spec files:

| Spec file | Area |
| --- | --- |
| `tests/wdio/landingScreen.spec.ts` | App launch / landing screen |
| `tests/wdio/generalstoreScreen.spec.ts` | General Store form screen |
| `tests/wdio/productScreen.spec.ts` | Product list screen |
| `tests/wdio/cartScreen.spec.ts` | Cart screen |

Run several specific specs:

```bash
npm run test:wdio -- --spec ./tests/wdio/landingScreen.spec.ts --spec ./tests/wdio/cartScreen.spec.ts
```

Run a single test case (`it`) by matching its title with Mocha `grep`:

```bash
npm run test:wdio -- --spec ./tests/wdio/landingScreen.spec.ts --mochaOpts.grep "TC001-1"
```

You can also call WebdriverIO directly. This skips the automatic Allure regeneration hook:

```bash
npx wdio run ./wdio.conf.ts --spec ./tests/wdio/landingScreen.spec.ts
```

---

## 5. Allure report

Test results are written to `allure-results/`. The HTML report is generated in `allure-report/`.

| Command | What it does |
| --- | --- |
| `npm run allure:report` | Keeps history, generates the report, and serves it at **http://localhost:9090** (opens in your browser). Keep this terminal open, re-run tests in another terminal, then refresh the browser. |
| `npm run allure:generate` | Generates `allure-report/` from `allure-results/` (cleans the old report). |
| `npm run allure:open` | Opens an already generated `allure-report/` in the browser. |
| `npm run allure:serve` | Generates a temporary report from `allure-results/` and opens it. |
| `npm run allure:clean` | Deletes `allure-results/` and `allure-report/` to start fresh. |

### Typical workflow

```bash
# Terminal 1 – start the report server once
npm run allure:report

# Terminal 2 – run tests (the report regenerates automatically after each run)
npm run test:wdio
# then refresh http://localhost:9090
```

> Open the report through a server (`allure:report`, `allure:open`, or `allure:serve`). Opening `allure-report/index.html` directly from disk doesn't load the data.

---

## 6. Quick reference

```bash
npm install                                                    # install dependencies
npm run appium                                                 # start Appium manually (optional)
npm run appium:doctor                                          # check UiAutomator2 setup
npm run test:wdio                                              # run all tests
npm run test:wdio -- --spec ./tests/wdio/cartScreen.spec.ts    # run one spec
npm run test:wdio -- --mochaOpts.grep "TC001-1"                # run one test case
npm run allure:report                                          # generate and serve report on :9090
npm run allure:clean                                           # clear old results
```
