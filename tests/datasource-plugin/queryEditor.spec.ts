import { test } from '../../src';
import { RedshiftProvision } from './types';

test('fill in new query, run it and assert on result in table panel', async ({
  emptyPanelEditPage,
  selectors,
  page,
  readProvision,
}) => {
  const ds = await readProvision<RedshiftProvision>({ filePath: 'datasources/aws-redshift.yaml' }).then(
    (res) => res.datasources[0]
  );
  await emptyPanelEditPage.setVisualization('Table');
  await emptyPanelEditPage.datasource.set(ds.name);
  await emptyPanelEditPage.timeRange.set({ from: '2021-01-01', to: '2021-01-02' });
  const queryEditorRow = await emptyPanelEditPage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRow.getByTestIdOrAriaLabel('data-testid table').locator('input').click();
  await page.getByText('average_temperature').last().click();
  const codeEditor = await queryEditorRow.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container);
  await codeEditor.click();
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await emptyPanelEditPage.refreshDashboard();
  await emptyPanelEditPage.tablePanel.expectToContainText('.38 Special');
});

test('fill in new query, run it and assert on result in timeseries panel', async ({
  emptyPanelEditPage,
  selectors,
  page,
  readProvision,
}) => {
  const ds = await readProvision<RedshiftProvision>({ filePath: 'datasources/aws-redshift.yaml' }).then(
    (res) => res.datasources[0]
  );
  await emptyPanelEditPage.setVisualization('Time series');
  await emptyPanelEditPage.datasource.set(ds.name);
  await emptyPanelEditPage.timeRange.set({ from: '2008-01-01', to: '2008-01-03' });
  const queryEditorRow = await emptyPanelEditPage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRow.getByTestIdOrAriaLabel('data-testid table').locator('input').click();
  await page.getByText('average_temperature').last().click();
  const codeEditor = await queryEditorRow.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container);
  await codeEditor.click();
  await page.keyboard.insertText('SELECT starttime,eventid,dateid FROM event ORDER BY starttime ASC LIMIT 100');

  await emptyPanelEditPage.refreshDashboard();
  await emptyPanelEditPage.timeSeriesPanel.expectToContainLegendLabels(['eventid', 'dateid']);
});
