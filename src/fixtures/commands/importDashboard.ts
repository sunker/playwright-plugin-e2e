import { promises } from 'fs';
import { expect, TestFixture } from '@playwright/test';
import { DashboardPage } from '../../models/DashboardPage';
import { PluginFixture, PluginOptions } from '../types';
import { PlaywrightCombinedArgs } from './types';
import { ImportDashboardArgs } from '../../types';

type ImportDashboardCommand = TestFixture<
  (args: ImportDashboardArgs) => Promise<DashboardPage>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const importDashboardCommand: ImportDashboardCommand = async (
  { request, grafanaPage, selectors, grafanaVersion },
  use
) => {
  await use(async (args) => {
    let buffer = await promises.readFile(process.cwd() + args.filePath, 'utf8');
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
    const dashboardPage = new DashboardPage(grafanaPage, request, selectors, grafanaVersion, expect, dashboardJson.uid);
    await dashboardPage.goto();
    return dashboardPage;
  });
};
