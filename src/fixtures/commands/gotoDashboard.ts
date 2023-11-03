import { expect, TestFixture } from '@playwright/test';
import { DashboardPage } from '../../models/DashboardPage';
import { GotoDashboardArgs, PlaywrightCombinedArgs } from './types';
import { PluginFixture, PluginOptions } from '../types';

type GotoDashboardCommand = TestFixture<
  (args: GotoDashboardArgs) => Promise<DashboardPage>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const gotoDashboardCommand: GotoDashboardCommand = async (
  { request, grafanaPage, selectors, grafanaVersion },
  use
) => {
  await use(async (args) => {
    const dashboardPage = new DashboardPage(grafanaPage, request, selectors, grafanaVersion, expect, args.uid);
    await dashboardPage.goto(args);
    return dashboardPage;
  });
};
