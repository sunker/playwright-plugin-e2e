import { test, expect } from '../src';
import { RedshiftProvision } from './types';

test('annotation editor', async ({ annotationEditPage, grafanaPage, selectors, readProvision }) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await annotationEditPage.setDataSource(ds.name);
  await grafanaPage.waitForFunction(() => (window as any).monaco);
  await grafanaPage.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container).click();
  await grafanaPage.keyboard.insertText('SELECT starttime, eventname FROM event ORDER BY eventname ASC LIMIT 5 ');
  await annotationEditPage.runQuery();
  await annotationEditPage.expectRunQueryResultToContainText('5 events (from 2 fields)');
});
