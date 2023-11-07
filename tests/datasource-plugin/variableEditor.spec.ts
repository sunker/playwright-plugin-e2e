import { test } from '../../src';
import { ds } from './datasource';
import { QUERY_DATA_QUERY_A_RESPONSE } from './mocks/queryDataResponse';

test('variable editor', async ({ variableEditPage, page }) => {
  await variableEditPage.mockQueryDataResponse(QUERY_DATA_QUERY_A_RESPONSE);
  await variableEditPage.setVariableType('Query');
  await variableEditPage.datasource.set(ds.name!);
  await variableEditPage.getCodeEditor().then((l) => l.click());
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');
  await variableEditPage.runQuery();
  await variableEditPage.expectVariableQueryPreviewToContainText('RESULT 1');
});
