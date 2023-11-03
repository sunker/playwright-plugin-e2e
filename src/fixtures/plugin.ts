import { test as base, selectors, expect } from '@playwright/test';
import { resolveSelectorVersion } from '../selectors/versionResolver';
import { versionedComponents, versionedPages } from '../selectors/versioned';
import { grafanaSelectorEngine } from './grafanaSelectorEngine';
import { DataSourceConfigPage } from '../models/DataSourceConfigPage';
import { EmptyDashboardPage } from '../models/EmptyDashboardPage';
import { AnnotationPage } from '../models/AnnotationPage';
import { VariablePage } from '../models/VariablePage';
import { ExplorePage } from '../models/ExplorePage';
import { readProvisionCommand, gotoDashboardCommand, importDashboardCommand, loginCommand } from '../commands';
import { PluginFixture, PluginOptions } from './types';

selectors.register('selector', grafanaSelectorEngine);

export const test = base.extend<PluginFixture & PluginOptions>({
  defaultCredentials: [{ user: 'admin', password: 'admin' }, { option: true }],
  grafanaVersion: async ({ page }, use) => {
    if (process.env.GRAFANA_VERSION) {
      return await use(process.env.GRAFANA_VERSION);
    }
    await page.goto('/', { waitUntil: 'networkidle' });
    const grafanaVersion: string = await page.evaluate('window.grafanaBootData.settings.buildInfo.version');
    await use(grafanaVersion);
  },
  selectors: async ({ grafanaVersion }, use) => {
    const selectors = resolveSelectorVersion(
      {
        components: versionedComponents,
        pages: versionedPages,
      },
      grafanaVersion
    );
    await use(selectors);
  },
  annotationEditPage: async ({ page, selectors, grafanaVersion }, use) => {
    const annotationPage = new AnnotationPage(page, selectors, grafanaVersion, expect);
    await annotationPage.goto();
    const annotationEditPage = await annotationPage.clickAddNew();
    await use(annotationEditPage);
  },
  dataSourceConfigPage: async ({ request, page, grafanaVersion, selectors }, use) => {
    const configPage = new DataSourceConfigPage(page, selectors, grafanaVersion, expect, request);
    await use(configPage);
    // await configPage.deleteDataSource();
  },
  emptyDashboardPage: async ({ page, request, selectors, grafanaVersion }, use) => {
    const emptyDashboardPage = new EmptyDashboardPage(page, request, selectors, grafanaVersion, expect);
    await emptyDashboardPage.goto();
    await use(emptyDashboardPage);
  },
  emptyEditPanelPage: async ({ emptyDashboardPage }, use) => {
    const editPanelPage = await emptyDashboardPage.addPanel();
    await use(editPanelPage);
  },
  variableEditPage: async ({ page, selectors, grafanaVersion }, use) => {
    const variablePage = new VariablePage(page, selectors, grafanaVersion, expect);
    await variablePage.goto();
    const variableEditPage = await variablePage.clickAddNew();
    await use(variableEditPage);
  },
  explorePage: async ({ page, selectors, grafanaVersion }, use) => {
    const explorePage = new ExplorePage(page, selectors, grafanaVersion, expect);
    await explorePage.goto();
    await use(explorePage);
  },
  readProvision: readProvisionCommand,
  gotoDashboard: gotoDashboardCommand,
  importDashboard: importDashboardCommand,
  login: loginCommand,
});

export { expect, selectors } from '@playwright/test';
