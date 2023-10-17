import { test as base } from '@playwright/test';
import { DataSourceConfigPage } from '../models/DataSourceConfigPage';
import { Selectors } from 'src/selectors/types';
import { resolveSelectorVersion } from 'src/selectors/versionResolver';
import { versionedComponents, versionedPages } from 'src/selectors/versioned';

const authFile = 'playwright/.auth/user.json';
const credentials = { user: 'admin', password: 'admin' };

type PluginOptions = {
  defaultCredentials: { user: string; password: string };
};
type PluginFixture = {
  dataSourceConfigPage: DataSourceConfigPage;
  grafanaVersion: string;
  selectors: Selectors;
};

export const test = base.extend<PluginFixture & PluginOptions>({
  defaultCredentials: credentials,
  page: async ({ page, request, defaultCredentials }, use) => {
    //override default page and make sure we are logged in
    await request.post('/login', { data: defaultCredentials });
    await request.storageState({ path: authFile });
    await page.goto('/', { waitUntil: 'networkidle' });
    await use(page);
  },
  grafanaVersion: async ({ page }, use) => {
    const grafanaVersion: string = await page.evaluate(
      'window.grafanaBootData.settings.buildInfo.version'
    );
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
  dataSourceConfigPage: async ({ page, request }, use) => {
    const configPage = new DataSourceConfigPage(page, request);
    await use(configPage);
    await configPage.deleteDataSource();
  },
});

export { expect } from '@playwright/test';
