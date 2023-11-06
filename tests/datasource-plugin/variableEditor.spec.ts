import { test } from '../../src';
import { ds } from './datasource';

test('variable editor', async ({ variableEditPage, page, selectors, readProvision }) => {
  await variableEditPage.setVariableType('Query');
  await variableEditPage.datasource.set(ds.name!);
  await variableEditPage.getCodeEditor().then((l) => l.click());
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');
  await variableEditPage.runQuery();
  await variableEditPage.expectVariableQueryPreviewToContainText('.38 Special');
});
