import { test } from '../src';
import { RedshiftProvision } from './types';

test('fill in new query, run it and assert on result in table panel', async ({
  emptyEditPanelPage,
  selectors,
  grafanaPage,
  readProvision,
}) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await emptyEditPanelPage.setVisualization('Table');
  await emptyEditPanelPage.datasource.set(ds.name);
  await emptyEditPanelPage.timeRange.set({ from: '2021-01-01', to: '2021-01-02' });
  const queryEditorRow = await emptyEditPanelPage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRow.getByTestIdOrAriaLabel('data-testid table').locator('input').click();
  await grafanaPage.getByText('average_temperature').last().click();
  const codeEditor = await queryEditorRow.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container);
  await codeEditor.click();
  await grafanaPage.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await emptyEditPanelPage.refreshDashboard();
  await emptyEditPanelPage.tablePanel.expectToContainText('.38 Special');
});

test('fill in new query, run it and assert on result in timeseries panel', async ({
  emptyEditPanelPage,
  selectors,
  grafanaPage,
  readProvision,
}) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await emptyEditPanelPage.setVisualization('Time series');
  await emptyEditPanelPage.datasource.set(ds.name);
  await emptyEditPanelPage.timeRange.set({ from: '2008-01-01', to: '2008-01-03' });
  const queryEditorRow = await emptyEditPanelPage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRow.getByTestIdOrAriaLabel('data-testid table').locator('input').click();
  await grafanaPage.getByText('average_temperature').last().click();
  const codeEditor = await queryEditorRow.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container);
  await codeEditor.click();
  await grafanaPage.keyboard.insertText('SELECT starttime,eventid,dateid FROM event ORDER BY starttime ASC LIMIT 100');

  await emptyEditPanelPage.refreshDashboard();
  await emptyEditPanelPage.timeSeriesPanel.expectToContainLegendLabels(['eventid', 'dateid']);
});
