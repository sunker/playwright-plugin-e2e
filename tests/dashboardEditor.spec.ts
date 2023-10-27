import { test } from '../src';
import { RedshiftProvision } from './types';

const csvContent = `col1
                    val1`;

test('empty dashboard', async ({ emptyDashboardPage, page, selectors, grafanaPage, readProvision }) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  const editPanelPage = await emptyDashboardPage.addPanel('Table', ds.name);
  const queryEditorRowLocator = await editPanelPage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRowLocator.getByTestId('data-testid table').locator('input').click();
  await page.getByText('average_temperature').last().click();
  const codeEditor = await queryEditorRowLocator.locator(`selector=${selectors.components.CodeEditor.container}`);
  await codeEditor.click();
  await grafanaPage.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await editPanelPage.refreshDashboard();
  await editPanelPage.expectTableToContainText('.38 Special');
});
