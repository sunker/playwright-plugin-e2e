const lte = require('semver/functions/lte');
import { test } from '../../src';
import { RedshiftProvision } from './types';

test('fill in new query, run it and assert on result', async ({
  explorePage,
  grafanaPage,
  selectors,
  readProvision,
}) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await explorePage.datasource.set(ds.name);
  const queryEditorRowLocator = await explorePage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRowLocator.getByTestId('data-testid table').locator('input').click();
  await grafanaPage.getByText('average_temperature').last().click();
  await queryEditorRowLocator.locator('selector=Format as').fill('Table');
  await grafanaPage.keyboard.press('Enter');
  const codeEditor = await queryEditorRowLocator.locator(`selector=${selectors.components.CodeEditor.container}`);
  await codeEditor.click();
  await grafanaPage.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await explorePage.runQuery();
  await explorePage.tablePanel.expectToContainText('.38 Special');
});