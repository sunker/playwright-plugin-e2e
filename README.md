# Grafana / Plugin E2E

E2E test Grafana plugins

### Quick overview

#### `Building the package`

```bash
yarn build
```

#### `Building the package with watcher`

```bash
yarn dev
```

#### `Building for production`

```bash
yarn bundle
```

#### `Running unit tests`

```bash
yarn test
```

#### `Running E2E tests locally`

To get quick feedback when developing the plugin e2e package, this repo has a few E2E tests in the `<root>/tests` folder. To run the E2E tests locally, follow the these steps:

```bash
#symlink plugin-provisioning repo into the root of the repo
ln -s <path-to-plugion-provisioning-repo-on-disk>/plugin-provisioning/provisioning
#start Grafana on port 3001
GRAFANA_VERSION=latest yarn server
# run tests headless
yarn playwright:test
# run tests headless in open browser
yarn playwright:test:ui
# read about to debug tests here
# https://playwright.dev/docs/debug
```

The tests in `<root>/tests` are importing plugin-e2e features directly from `<root>/src`, so you don't need to rebuild the package before running the tests.

#### `Running E2E tests in CI`

This repo has a github action that will run all Playwright E2E tests in `<root>/tests` against a set of Grafana versions specified in the Github action matrix. One test report will be generated for each version in the matrix
