import { test as base, selectors, expect } from '@playwright/test';
import { resolveSelectors } from '../e2e-selectors/resolver';
import { versionedComponents, versionedPages } from '../e2e-selectors/versioned';
import { grafanaSelectorEngine } from '../selectorEngine';
import { AnnotationPage } from '../models/AnnotationPage';
import { VariablePage } from '../models/VariablePage';
import { DataSourceConfigPage } from '../models/DataSourceConfigPage';
import { EmptyDashboardPage } from '../models/EmptyDashboardPage';
import { VariableEditPage } from '../models/VariableEditPage';
import { DashboardPage } from '../models/DashboardPage';
import { AnnotationEditPage } from '../models/AnnotationEditPage';
import { EditPanelPage } from '../models/EditPanelPage';
import { ExplorePage } from '../models/ExplorePage';
import { E2ESelectors } from '../e2e-selectors/types';
import { ImportDashboardArgs, GotoDashboardArgs, DataSource, CreateDataSourceArgs } from '../types';

import {
  readProvisionCommand,
  gotoDashboardCommand,
  importDashboardCommand,
  loginCommand,
  createDataSourceViaAPICommand,
} from '../commands';

selectors.register('selector', grafanaSelectorEngine);

export type PluginOptions = {
  selectorRegistration: void;
};

export type PluginFixture = {
  /**
   * The selectors to use for the current version of Grafana
   */
  grafanaVersion: string;

  /**
   * The selectors to use for the current version of Grafana
   */
  selectors: E2ESelectors;

  /**
   * Isolated {@link DataSourceConfigPage} instance for each test.
   *
   * Does not nativate to the config page by default. To visit the
   * config page, use {@link DataSourceConfigPage.createDataSource}
   * to create a data source edit for a given data source type
   * or {@link DataSourceConfigPage.goto} to edit an existing data source.
   */
  dataSourceConfigPage: DataSourceConfigPage;

  /**
   * Isolated {@link EmptyDashboardPage} instance for each test.
   *
   * Navigates to a new dashboard page.
   */
  emptyDashboardPage: EmptyDashboardPage;

  /**
   * Isolated {@link EditPanelPage} instance for each test.
   *
   * Navigates to a new dashboard page and adds a new panel.
   *
   * Use {@link EditPanelPage.setVisualization} to change the visualization
   * Use {@link EditPanelPage.datasource.set} to change the
   * Use {@link ExplorePage.getQueryEditorEditorRow} to retrieve the query
   * editor row locator for a given query refId
   */
  emptyEditPanelPage: EditPanelPage;

  /**
   * Isolated {@link VariableEditPage} instance for each test.
   *
   * Navigates to a new dashboard page and adds a new variable.
   *
   * Use {@link VariableEditPage.setVariableType} to change the variable type
   */
  variableEditPage: VariableEditPage;

  /**
   * Isolated {@link AnnotationEditPage} instance for each test.
   *
   * Navigates to a new dashboard page and adds a new annotation.
   *
   * Use {@link AnnotationEditPage.datasource.set} to change the datasource
   */
  annotationEditPage: AnnotationEditPage;

  /**
   * Isolated {@link ExplorePage} instance for each test.
   *
   * Navigates to a the explore page.
   *
   * Use {@link ExplorePage.EditPanelPage.datasource.set} to change the datasource
   * Use {@link ExplorePage.getQueryEditorEditorRow} to retrieve the query editor
   * row locator for a given query refId
   */
  explorePage: ExplorePage;

  /**
   * Fixture command that will logs in to Grafana using the Grafana API. 
   * If the same credentials should be used in every test, 
   * invoke this fixture in a setup project.
   * See https://playwright.dev/docs/auth#basic-shared-account-in-all-tests
   * 
   * If no credentials are provided, the default admin/admin credentials will be used.
   * 
   * The default credentials can be overridden in the playwright.config.ts file:
   * eg.
   * export default defineConfig({
      use: {
        httpCredentials: {
          username: 'user',
          password: 'pass',
        },
      },
    });
    * 
    * To override credentials in a single test:
    * test.use({ httpCredentials: { username: 'admin', password: 'admin' } });
    * To avoid authentication in a single test:
    * test.use({ storageState: { cookies: [], origins: [] } });
   */
  login: () => Promise<void>;

  /**
   * Fixture command that create a data source via the Grafana API.
   *
   * If you have tests that depend on the the existance of a data source,
   * you may use this command in a setup project. Read more about setup projects
   * here: https://playwright.dev/docs/auth#basic-shared-account-in-all-tests
   */
  createDataSource: (args: CreateDataSourceArgs) => Promise<DataSource>;

  /**
   * Fixture command that imports a dashboard via the Grafana API.
   *
   * Resolves to a {@link DashboardPage} instance.
   */
  importDashboard: (args: ImportDashboardArgs) => Promise<DashboardPage>;

  /**
   * Fixture command that navigates to a dashboard via the Grafana UI.
   *
   * Resolves to a {@link DashboardPage} instance.
   */
  gotoDashboard: (args: GotoDashboardArgs) => Promise<DashboardPage>;

  /**
   * Fixture command that reads a the yaml file for a provisioned dashboard
   * or data source and returns it as json.
   */
  readProvision<T = any>(args: ImportDashboardArgs): Promise<T>;
};

export const test = base.extend<PluginFixture & PluginOptions>({
  grafanaVersion: async ({ page }, use) => {
    if (process.env.GRAFANA_VERSION) {
      return await use(process.env.GRAFANA_VERSION);
    }
    await page.goto('/', { waitUntil: 'networkidle' });
    const grafanaVersion: string = await page.evaluate('window.grafanaBootData.settings.buildInfo.version');
    await use(grafanaVersion);
  },
  selectors: async ({ grafanaVersion }, use) => {
    const selectors = resolveSelectors(
      {
        components: versionedComponents,
        pages: versionedPages,
      },
      grafanaVersion
    );
    await use(selectors);
  },
  dataSourceConfigPage: async ({ request, page, grafanaVersion, selectors }, use) => {
    const configPage = new DataSourceConfigPage({ page, selectors, grafanaVersion, request }, expect);
    await use(configPage);
    // await configPage.deleteDataSource();
  },
  emptyDashboardPage: async ({ page, request, selectors, grafanaVersion }, use) => {
    const emptyDashboardPage = new EmptyDashboardPage({ page, selectors, grafanaVersion, request }, expect);
    await emptyDashboardPage.goto();
    await use(emptyDashboardPage);
  },
  emptyEditPanelPage: async ({ emptyDashboardPage }, use) => {
    const editPanelPage = await emptyDashboardPage.addPanel();
    await use(editPanelPage);
  },
  variableEditPage: async ({ page, selectors, grafanaVersion, request }, use) => {
    const variablePage = new VariablePage({ page, selectors, grafanaVersion, request }, expect);
    await variablePage.goto();
    const variableEditPage = await variablePage.clickAddNew();
    await use(variableEditPage);
  },
  annotationEditPage: async ({ page, selectors, grafanaVersion, request }, use) => {
    const annotationPage = new AnnotationPage({ page, selectors, grafanaVersion, request }, expect);
    await annotationPage.goto();
    const annotationEditPage = await annotationPage.clickAddNew();
    await use(annotationEditPage);
  },
  explorePage: async ({ page, selectors, grafanaVersion, request }, use) => {
    const explorePage = new ExplorePage({ page, selectors, grafanaVersion, request }, expect);
    await explorePage.goto();
    await use(explorePage);
  },
  readProvision: readProvisionCommand,
  gotoDashboard: gotoDashboardCommand,
  importDashboard: importDashboardCommand,
  login: loginCommand,
  createDataSource: createDataSourceViaAPICommand,
});

export { expect, selectors } from '@playwright/test';
