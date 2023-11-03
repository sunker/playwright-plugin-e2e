import fs from 'fs';
import { test as base, selectors, expect } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { resolveSelectorVersion } from '../selectors/versionResolver';
import { versionedComponents, versionedPages } from '../selectors/versioned';
import { getCustomLocators } from '../customLocators';
import { grafanaSelectorEngine } from './grafanaSelectorEngine';
import { readProvision } from '../utils/readProvisioning';
import { DataSourceConfigPage } from '../models/DataSourceConfigPage';
import { DashboardPage } from '../models/DashboardPage';
import { EmptyDashboardPage } from '../models/EmptyDashboardPage';
import { VariableEditPage } from '../models/VariableEditPage';
import { AnnotationEditPage } from '../models/AnnotationEditPage';
import { AnnotationPage } from '../models/AnnotationPage';
import { VariablePage } from '../models/VariablePage';
import { GrafanaPage, ImportDashboardArgs, GotoDashboardArgs } from '../types';
import { ExplorePage } from '../models/ExplorePage';
import { EditPanelPage } from 'src/models';

const authFile = 'playwright/.auth/user.json';
const credentials = { user: 'admin', password: 'admin' };

type PluginOptions = {
  defaultCredentials: { user: string; password: string };
  selectorRegistration: void;
};

selectors.register('selector', grafanaSelectorEngine);

type PluginFixture = {
  // Page objects
  grafanaPage: GrafanaPage;
  dataSourceConfigPage: DataSourceConfigPage;
  grafanaVersion: string;
  selectors: Selectors;
  emptyDashboardPage: EmptyDashboardPage;
  variableEditPage: VariableEditPage;
  annotationEditPage: AnnotationEditPage;
  emptyEditPanelPage: EditPanelPage;
  selectorRegistration: any;
  explorePage: ExplorePage;
  // Commands
  importDashboard: (args: ImportDashboardArgs) => Promise<DashboardPage>;
  gotoDashboard: (args: GotoDashboardArgs) => Promise<DashboardPage>;
  readProvision<T = any>(path: string): Promise<T>;
};

export const test = base.extend<PluginFixture & PluginOptions>({
  defaultCredentials: credentials,
  grafanaPage: async ({ request, page, defaultCredentials }, use) => {
    await request.post('/login', { data: defaultCredentials });
    await request.storageState({ path: authFile });
    await page.goto('/', { waitUntil: 'networkidle' });

    const customLocators = getCustomLocators(page);
    const grafanaPage = Object.assign(page, customLocators) as GrafanaPage;
    await use(grafanaPage);
  },
  grafanaVersion: async ({ grafanaPage }, use) => {
    const grafanaVersion: string = await grafanaPage.evaluate('window.grafanaBootData.settings.buildInfo.version');
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
  annotationEditPage: async ({ grafanaPage, selectors, grafanaVersion }, use) => {
    const annotationPage = new AnnotationPage(grafanaPage, selectors, grafanaVersion, expect);
    await annotationPage.goto();
    const annotationEditPage = await annotationPage.clickAddNew();
    await use(annotationEditPage);
  },
  dataSourceConfigPage: async ({ request, grafanaPage, grafanaVersion, selectors }, use) => {
    const configPage = new DataSourceConfigPage(grafanaPage, request, selectors, grafanaVersion, expect);
    await use(configPage);
    // await configPage.deleteDataSource();
  },
  emptyDashboardPage: async ({ grafanaPage, request, selectors, grafanaVersion }, use) => {
    const emptyDashboardPage = new EmptyDashboardPage(grafanaPage, request, selectors, grafanaVersion, expect);
    await emptyDashboardPage.goto();
    await use(emptyDashboardPage);
  },
  emptyEditPanelPage: async ({ emptyDashboardPage }, use) => {
    const editPanelPage = await emptyDashboardPage.addPanel();
    await use(editPanelPage);
  },
  variableEditPage: async ({ grafanaPage, selectors, grafanaVersion }, use) => {
    const variablePage = new VariablePage(grafanaPage, selectors, grafanaVersion, expect);
    await variablePage.goto();
    const variableEditPage = await variablePage.clickAddNew();
    await use(variableEditPage);
  },
  explorePage: async ({ grafanaPage, selectors, grafanaVersion }, use) => {
    const explorePage = new ExplorePage(grafanaPage, selectors, grafanaVersion, expect);
    await explorePage.goto();
    await use(explorePage);
  },
  readProvision: async ({}, use) => {
    await use((path) => readProvision(process.cwd(), path));
  },
  gotoDashboard: async ({ request, grafanaPage, selectors, grafanaVersion }, use) => {
    await use(async (args) => {
      const dashboardPage = new DashboardPage(grafanaPage, request, selectors, grafanaVersion, expect, args.uid);
      await dashboardPage.goto(args);
      return dashboardPage;
    });
  },
  importDashboard: async ({ request, grafanaPage, selectors, grafanaVersion }, use) => {
    await use(async (args) => {
      // todo: shold be async
      let buffer = fs.readFileSync(process.cwd() + args.filePath);
      const dashboard = JSON.parse(buffer.toString());
      const importDashboardReq = await request.post('/api/dashboards/import', {
        data: {
          dashboard,
          overwrite: true,
          inputs: [],
          folderId: 0,
        },
      });
      expect(importDashboardReq.ok()).toBeTruthy();
      const dashboardJson = await importDashboardReq.json();
      const dashboardPage = new DashboardPage(
        grafanaPage,
        request,
        selectors,
        grafanaVersion,
        expect,
        dashboardJson.uid
      );
      await dashboardPage.goto();
      return dashboardPage;
    });
  },
});

export { expect, selectors } from '@playwright/test';
