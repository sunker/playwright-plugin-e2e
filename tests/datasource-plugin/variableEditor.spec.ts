import { expect, test } from '../../src';
import { RedshiftProvision } from './types';

test('variable editor', async ({ variableEditPage, page, selectors, readProvision }) => {
  const ds = await readProvision<RedshiftProvision>({ filePath: 'datasources/aws-redshift.yaml' }).then(
    (res) => res.datasources[0]
  );
  await variableEditPage.setVariableType('Query');
  await variableEditPage.datasource.set(ds.name);
  await variableEditPage.getCodeEditor().then((l) => l.click());
  await page.keyboard.insertText('SELECT eventname FROM event ORDER BY eventname ASC LIMIT 1');
  await variableEditPage.runQuery();
  await expect(
    variableEditPage.getByTestIdOrAriaLabel(
      selectors.pages.Dashboard.Settings.Variables.Edit.General.previewOfValuesOption
    )
  ).toHaveText('.38 Special');
});
