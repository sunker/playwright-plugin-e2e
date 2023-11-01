import { test } from '../src';
import { RedshiftProvision } from './types';

test('add new query, run it and assert on result', async ({
  emptyEditPanelPage,
  selectors,
  grafanaPage,
  readProvision,
}) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await emptyEditPanelPage.setVisualization('Table');
  await emptyEditPanelPage.datasource.set(ds.name);
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
