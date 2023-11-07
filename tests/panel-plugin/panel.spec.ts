import fs from 'fs';
import { DashboardPage, expect, test } from '../../src';

test.describe(() => {
  test.describe.configure({ mode: 'parallel' });
  test('add a clock panel in new dashboard and set time format to "12 hour"', async ({
    emptyPanelEditPage,
    selectors,
    page,
  }) => {
    await emptyPanelEditPage.setVisualization('Clock');
    await emptyPanelEditPage.setPanelTitle('Clock panel test');
    await emptyPanelEditPage.getByTestIdOrAriaLabel(selectors.components.OptionsGroup.group('Clock')).click();
    await page.getByText('12 Hour').click();
    await expect(page.getByRole('heading', { name: /.*[APap][mM]$/ })).toBeVisible();
  });

  const dashboardPath = '/provisioning/dashboards/clockpanel/clock-panel.json';
  test('open a clock panel in an imported dashboard and set time format to "12 hour"', async ({
    selectors,
    page,
    importDashboard,
  }, testInfo) => {
    testInfo.skip(!fs.existsSync(process.cwd() + dashboardPath), 'Ignoring test because provision file does not exist');
    const dashboardPage = await importDashboard({ filePath: dashboardPath });
    const panelEditPage = await dashboardPage.gotoPanelEditPage('5');
    await expect(panelEditPage.getVisualizationName()).toHaveText('Clock');
    await panelEditPage.getByTestIdOrAriaLabel(selectors.components.OptionsGroup.group('Clock')).click();
    await page.getByText('12 Hour').click();
    await expect(page.getByRole('heading', { name: /.*[APap][mM]$/ })).toBeVisible();
  });

  test('open a clock panel in a provisioned dashboard and set time format to "12 hour"', async ({
    selectors,
    page,
    request,
    grafanaVersion,
    readProvision,
  }, testInfo) => {
    testInfo.skip(!fs.existsSync(process.cwd() + dashboardPath), 'Ignoring test because provision file does not exist');
    const dashboardJson = await readProvision({ filePath: 'dashboards/clockpanel/clock-panel.json' });
    const dashboardPage = await new DashboardPage(
      { page, selectors, grafanaVersion, request },
      expect,
      dashboardJson.uid
    );
    const panelEditPage = await dashboardPage.gotoPanelEditPage('5');
    await expect(panelEditPage.getVisualizationName()).toHaveText('Clock');
    await panelEditPage.getByTestIdOrAriaLabel(selectors.components.OptionsGroup.group('Clock')).click();
    await page.getByText('12 Hour').click();
    await expect(page.getByRole('heading', { name: /.*[APap][mM]$/ })).toBeVisible();
  });
});
