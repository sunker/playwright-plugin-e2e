import { expect, TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../fixtures/plugin';
import { DashboardPage } from '../models/DashboardPage';
import { GotoDashboardArgs } from '../types';
import { PlaywrightCombinedArgs } from './types';

type GotoDashboardCommand = TestFixture<
  (args: GotoDashboardArgs) => Promise<DashboardPage>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const gotoDashboardCommand: GotoDashboardCommand = async ({ request, page, selectors, grafanaVersion }, use) => {
  await use(async (args) => {
    const dashboardPage = new DashboardPage({ request, page, selectors, grafanaVersion }, expect, args.uid);
    await dashboardPage.goto(args);
    return dashboardPage;
  });
};
