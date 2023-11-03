import { expect, TestFixture } from '@playwright/test';
import { DashboardPage } from '../models/DashboardPage';
import { PlaywrightCombinedArgs } from './types';
import { PluginOptions, PluginFixture } from '../pluginType';
import { GotoDashboardArgs } from '../types';

type GotoDashboardCommand = TestFixture<
  (args: GotoDashboardArgs) => Promise<DashboardPage>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const gotoDashboardCommand: GotoDashboardCommand = async ({ request, page, selectors, grafanaVersion }, use) => {
  await use(async (args) => {
    const dashboardPage = new DashboardPage(page, selectors, grafanaVersion, expect, request, args.uid);
    await dashboardPage.goto(args);
    return dashboardPage;
  });
};
