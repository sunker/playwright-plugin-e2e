import { test, expect, readProvision } from '../src';
import { RedshiftProvision } from './types';

test('variable editor', async ({ variableEditPage, grafanaPage, selectors, readProvision }) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await variableEditPage.setVariableType('Query');
  await variableEditPage.datasource.set(ds.name);
  await grafanaPage.waitForFunction(() => (window as any).monaco);
  await grafanaPage.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container).click();
  await grafanaPage.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');
  await variableEditPage.runQuery();
  await expect(
    grafanaPage.getByTestIdOrAriaLabel(selectors.pages.Dashboard.Settings.Variables.Edit.General.previewOfValuesOption)
  ).toHaveText('.38 Special');
});
