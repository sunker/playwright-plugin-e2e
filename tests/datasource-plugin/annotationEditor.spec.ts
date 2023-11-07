const lte = require('semver/functions/lte');
import { test } from '../../src';
import { ds } from './datasource';
import { QUERY_DATA_ANNOTATION_RESPONSE } from './mocks/queryDataResponse';
import { RedshiftProvision } from './types';

test('annotation editor with existing ds', async ({ annotationEditPage, page, selectors }) => {
  await annotationEditPage.mockQueryDataResponse(QUERY_DATA_ANNOTATION_RESPONSE);
  await annotationEditPage.datasource.set(ds.name!);
  await annotationEditPage.getCodeEditor().then((l) => l.click());
  await page.keyboard.insertText('SELECT starttime, eventname FROM event ORDER BY eventname ASC LIMIT 5 ');
  await annotationEditPage.runQuery();
  await annotationEditPage.expectRunQueryResultToContainText('5 events (from 2 fields)');
});

test('annotation editor with provisioned ds', async ({
  annotationEditPage,
  page,
  selectors,
  readProvision,
  grafanaVersion,
}, testInfo) => {
  testInfo.skip(lte(grafanaVersion, '9.2.5'), 'Code Editor triggers one query per key down in Grafana 9.2.5 and below');
  await annotationEditPage.mockQueryDataResponse(QUERY_DATA_ANNOTATION_RESPONSE);
  const ds = await readProvision<RedshiftProvision>({ filePath: 'datasources/aws-redshift.yaml' }).then(
    (res) => res.datasources[0]
  );
  await annotationEditPage.datasource.set(ds.name);
  await annotationEditPage.getCodeEditor().then((l) => l.click());
  await page.keyboard.insertText('SELECT starttime, eventname FROM event ORDER BY eventname ASC LIMIT 5 ');
  await annotationEditPage.runQuery();
  await annotationEditPage.expectRunQueryResultToContainText('5 events (from 2 fields)');
});
