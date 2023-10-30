const lte = require('semver/functions/lte');
import { test } from '../src';
import { RedshiftProvision } from './types';

test.skip;

test('annotation editor', async ({ annotationEditPage, grafanaPage, selectors, readProvision, grafanaVersion }, {
  skip,
}) => {
  skip(lte(grafanaVersion, '9.2.5'), 'Code Editor triggers one query per key down in Grafana 9.2.5 and below');
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await annotationEditPage.setDataSource(ds.name);
  await grafanaPage.waitForFunction(() => (window as any).monaco);
  await grafanaPage.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container).click();
  await grafanaPage.keyboard.insertText('SELECT starttime, eventname FROM event ORDER BY eventname ASC LIMIT 5 ');
  await annotationEditPage.runQuery();
  await annotationEditPage.expectRunQueryResultToContainText('5 events (from 2 fields)');
});
