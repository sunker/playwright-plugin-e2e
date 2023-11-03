import fs from 'fs';
const lte = require('semver/functions/lte');
import { test, expect, DashboardPage } from '../../src';
import { request } from '@playwright/test';
test.describe(() => {
  test.describe.configure({ mode: 'parallel' });
  test('add a clock panel in new dashboard and set time format to "12 hour"', async ({
    emptyEditPanelPage,
    selectors,
    grafanaPage,
  }) => {
    await emptyEditPanelPage.setVisualization('Clock');
    await emptyEditPanelPage.setPanelTitle('Clock panel test');
    await grafanaPage.getByTestIdOrAriaLabel(selectors.components.OptionsGroup.group('Clock')).click();
    await grafanaPage.getByText('12 Hour').click();
    await expect(grafanaPage.getByRole('heading', { name: /.*[APap][mM]$/ })).toBeVisible();
  });

  const dashboardPath = '/provisioning/dashboards/clockpanel/clock-panel.json';
  test('open a clock panel in an imported dashboard and set time format to "12 hour"', async ({
    selectors,
    grafanaPage,
    importDashboard,
  }, testInfo) => {
    testInfo.skip(!fs.existsSync(process.cwd() + dashboardPath));
    const dashboardPage = await importDashboard({ filePath: dashboardPath });
    const editPanelPage = await dashboardPage.gotoEditPanelPage('5');
    await expect(editPanelPage.getVisualizationName()).toHaveText('Clock');
    await grafanaPage.getByTestIdOrAriaLabel(selectors.components.OptionsGroup.group('Clock')).click();
    await grafanaPage.getByText('12 Hour').click();
    await expect(grafanaPage.getByRole('heading', { name: /.*[APap][mM]$/ })).toBeVisible();
  });

  test('open a clock panel in a provisioned dashboard and set time format to "12 hour"', async ({
    selectors,
    grafanaPage,
    request,
    grafanaVersion,
    readProvision,
  }, testInfo) => {
    testInfo.skip(!fs.existsSync(process.cwd() + dashboardPath));
    const dashboardJson = await readProvision('dashboards/clockpanel/clock-panel.json');
    const dashboardPage = await new DashboardPage(
      grafanaPage,
      request,
      selectors,
      grafanaVersion,
      expect,
      dashboardJson.uid
    );
    const editPanelPage = await dashboardPage.gotoEditPanelPage('5');
    await expect(editPanelPage.getVisualizationName()).toHaveText('Clock');
    await grafanaPage.getByTestIdOrAriaLabel(selectors.components.OptionsGroup.group('Clock')).click();
    await grafanaPage.getByText('12 Hour').click();
    await expect(grafanaPage.getByRole('heading', { name: /.*[APap][mM]$/ })).toBeVisible();
  });
});
