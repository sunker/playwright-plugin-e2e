const lte = require('semver/functions/lte');
import { test } from '../../src';
import { ds } from './datasource';
import { QUERY_DATA_QUERY_A_RESPONSE } from './mocks/queryDataResponse';

test('fill in new query, run it and assert on result', async ({ explorePage, page, selectors }) => {
  await explorePage.mockQueryDataResponse(QUERY_DATA_QUERY_A_RESPONSE);

  await explorePage.datasource.set(ds.name!);
  const queryEditorRowLocator = await explorePage.getQueryEditorEditorRow('A');

  // ds specific tests
  await queryEditorRowLocator.locator('selector=Format as').fill('Table');
  await page.keyboard.press('Enter');
  await explorePage.getCodeEditor(queryEditorRowLocator).then((l) => l.click());
  const codeEditor = await queryEditorRowLocator.locator(`selector=${selectors.components.CodeEditor.container}`);
  await codeEditor.click();
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');

  await explorePage.runQuery();
  await explorePage.tablePanel.expectToContainText('RESULT 1');
});
