const lte = require('semver/functions/lte');
import fs from 'fs';
import { test } from '../../src';
import { ds } from './datasource';
import { RedshiftProvision } from './types';

test('fill in new query, run it and assert on result', async ({ explorePage, page, selectors, readProvision }) => {
  await explorePage.datasource.set(ds.name!);
  const queryEditorRowLocator = await explorePage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRowLocator.getByTestId('data-testid table').locator('input').click();
  await page.getByText('average_temperature').last().click();
  await queryEditorRowLocator.locator('selector=Format as').fill('Table');
  await page.keyboard.press('Enter');

  await explorePage.getCodeEditor(queryEditorRowLocator).then((l) => l.click());
  const codeEditor = await queryEditorRowLocator.locator(`selector=${selectors.components.CodeEditor.container}`);
  await codeEditor.click();
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await explorePage.runQuery();
  await explorePage.tablePanel.expectToContainText('.38 Special');
});

test('fill in new query, run it and assert on result with provisioned ds', async ({
  explorePage,
  page,
  selectors,
  readProvision,
}, testInfo) => {
  testInfo.skip(!fs.existsSync(process.cwd() + '/provisioning/dashboards/clockpanel/clock-panel.json'));
  const ds = await readProvision<RedshiftProvision>({ filePath: 'datasources/aws-redshift.yaml' }).then(
    (res) => res.datasources[0]
  );
  await explorePage.datasource.set(ds.name);
  const queryEditorRowLocator = await explorePage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRowLocator.getByTestId('data-testid table').locator('input').click();
  await page.getByText('average_temperature').last().click();
  await queryEditorRowLocator.locator('selector=Format as').fill('Table');
  await page.keyboard.press('Enter');

  await explorePage.getCodeEditor(queryEditorRowLocator).then((l) => l.click());
  const codeEditor = await queryEditorRowLocator.locator(`selector=${selectors.components.CodeEditor.container}`);
  await codeEditor.click();
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await explorePage.runQuery();
  await explorePage.tablePanel.expectToContainText('.38 Special');
});
