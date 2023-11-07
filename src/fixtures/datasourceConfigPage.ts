import { TestFixture, expect } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../api';
import { DataSourceConfigPage } from '../models';
import { PlaywrightCombinedArgs } from './types';

type DataSourceConfigPageFixture = TestFixture<
  DataSourceConfigPage,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

const dataSourceConfigPage: DataSourceConfigPageFixture = async ({ request, page, grafanaVersion, selectors }, use) => {
  const configPage = new DataSourceConfigPage({ page, selectors, grafanaVersion, request }, expect);
  await use(configPage);
  // await configPage.deleteDataSource();
};

export default dataSourceConfigPage;
