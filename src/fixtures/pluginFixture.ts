import { test as base } from '@playwright/test';
import { DataSourceConfigPage } from '../models/DataSourceConfigPage';

const authFile = '../../.auth/user.json';
const credentials = { user: 'admin', password: 'admin' };

export const test = base.extend<{ dataSourceConfigPage: DataSourceConfigPage }>(
  {
    page: async ({ page, request }, use) => {
      //override default page and make sure we are logged in
      await request.post('/login', { data: credentials });
      await request.storageState({ path: authFile });
      await use(page);
    },
    dataSourceConfigPage: async ({ page, request }, use) => {
      const configPage = new DataSourceConfigPage(page, request);
      await use(configPage);
      await configPage.deleteDataSource();
    },
  }
);

export { expect } from '@playwright/test';
