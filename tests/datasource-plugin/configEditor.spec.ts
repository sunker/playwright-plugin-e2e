import randomstring from 'randomstring';
import { test } from '../../src';
import { RedshiftProvision } from './types';
import { ds } from './datasource';

test('valid aws-sdk-auth config', async ({ dataSourceConfigPage, page, readProvision }) => {
  await dataSourceConfigPage.createDataSource('grafana-redshift-datasource', ds.name);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Default Region').fill(ds.jsonData.defaultRegion!);
  await page.keyboard.press('Enter');
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Cluster Identifier').click();
  await page.waitForResponse((resp) => resp.url().includes('resources/clusters') && resp.status() === 200, {
    timeout: 5000,
  });
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Cluster Identifier').fill(ds.jsonData.clusterIdentifier!);
  await page.keyboard.press('Enter');

  await dataSourceConfigPage.getByTestIdOrAriaLabel('data-testid database').fill(ds.jsonData.database!);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('data-testid dbuser').fill(ds.jsonData.dbUser!);
  await dataSourceConfigPage.saveAndTest();
  await dataSourceConfigPage.expectHealthCheckResultTextToContain('Data source is working');
});

test('valid keys config', async ({ dataSourceConfigPage, page, readProvision }) => {
  const ds = await readProvision<RedshiftProvision>({ filePath: 'datasources/aws-redshift.yaml' }).then(
    (res) => res.datasources[0]
  );
  await dataSourceConfigPage.createDataSource('grafana-redshift-datasource', `redshift-${randomstring.generate()}`);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Authentication Provider').fill('Access & secret key');
  await page.keyboard.press('Enter');
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Secret Access Key').fill(ds.secureJsonData.secretKey);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Access Key ID').fill(ds.secureJsonData.accessKey);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Default Region').fill(ds.jsonData.defaultRegion);
  await page.keyboard.press('Enter');
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Cluster Identifier').click();
  await dataSourceConfigPage.getByTestIdOrAriaLabel('data-testid clusterID');
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Cluster Identifier').fill(ds.jsonData.clusterIdentifier);
  await page.keyboard.press('Enter');

  await dataSourceConfigPage.getByTestIdOrAriaLabel('data-testid database').fill(ds.jsonData.database);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('data-testid dbuser').fill(ds.jsonData.dbUser);
  await dataSourceConfigPage.saveAndTest();
  await dataSourceConfigPage.expectHealthCheckResultTextToContain('Data source is working');
});
