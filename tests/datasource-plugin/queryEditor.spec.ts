import { test } from '../../src';
import { ds } from './datasource';
import { QUERY_DATA_QUERY_A_RESPONSE, QUERY_DATA_TIMESERIES_RESPONSE } from './mocks/queryDataResponse';
import { TABLE_RESPONSE } from './mocks/resourceResponse';

test('fill in new query, run it and assert on result in table panel', async ({ emptyPanelEditPage, page }) => {
  await emptyPanelEditPage.mockQueryDataResponse(QUERY_DATA_QUERY_A_RESPONSE);
  await emptyPanelEditPage.mockResourceResponse('tables', TABLE_RESPONSE);
  await emptyPanelEditPage.setVisualization('Table');
  await emptyPanelEditPage.datasource.set(ds.name!);
  await emptyPanelEditPage.timeRange.set({ from: '2021-01-01', to: '2021-01-02' });
  const queryEditorRow = await emptyPanelEditPage.getQueryEditorEditorRow('A');

  // ds specific tests
  await emptyPanelEditPage.getByTestIdOrAriaLabel('data-testid table', queryEditorRow).locator('input').click();
  await page.getByText('average_temperature').last().click();
  await emptyPanelEditPage.getCodeEditor(queryEditorRow).then((l) => l.click());
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await emptyPanelEditPage.refreshDashboard();
  await emptyPanelEditPage.tablePanel.expectToContainText('RESULT 1');
});

test('fill in new query, run it and assert on result in timeseries panel', async ({ emptyPanelEditPage, page }) => {
  await emptyPanelEditPage.mockQueryDataResponse(QUERY_DATA_TIMESERIES_RESPONSE);
  await emptyPanelEditPage.mockResourceResponse('tables', TABLE_RESPONSE);
  await emptyPanelEditPage.setVisualization('Time series');
  await emptyPanelEditPage.datasource.set(ds.name!);
  await emptyPanelEditPage.timeRange.set({ from: '2008-01-01', to: '2008-01-03' });
  const queryEditorRow = await emptyPanelEditPage.getQueryEditorEditorRow('A');

  // ds specific tests
  await emptyPanelEditPage.getByTestIdOrAriaLabel('data-testid table', queryEditorRow).locator('input').click();
  await page.getByText('average_temperature').last().click();
  await emptyPanelEditPage.getCodeEditor(queryEditorRow).then((l) => l.click());
  await page.keyboard.insertText('SELECT starttime,eventid,dateid FROM event ORDER BY starttime ASC LIMIT 100');

  await emptyPanelEditPage.refreshDashboard();
  await emptyPanelEditPage.timeSeriesPanel.expectToContainLegendLabels(['eventid', 'dateid']);
});
