import randomstring from 'randomstring';
import { test } from '../../src';
import { ds } from './datasource';
import { CLUSTERS_RESPONSE } from './mocks/resourceResponse';

test('valid aws-sdk-auth config', async ({ dataSourceConfigPage, page }) => {
  dataSourceConfigPage.mockResourceResponse('clusters', CLUSTERS_RESPONSE);
  await dataSourceConfigPage.createDataSource('grafana-redshift-datasource', ds.name);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Default Region').fill(ds.jsonData.defaultRegion!);
  await page.keyboard.press('Enter');
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Cluster Identifier').click();
  await dataSourceConfigPage.getByTestIdOrAriaLabel('Cluster Identifier').fill(ds.jsonData.clusterIdentifier!);
  await page.keyboard.press('Enter');

  await dataSourceConfigPage.getByTestIdOrAriaLabel('data-testid database').fill(ds.jsonData.database!);
  await dataSourceConfigPage.getByTestIdOrAriaLabel('data-testid dbuser').fill(ds.jsonData.dbUser!);
  await dataSourceConfigPage.saveAndTest();
  await dataSourceConfigPage.expectHealthCheckResultTextToContain('Data source is working');
});

test('valid keys config', async ({ dataSourceConfigPage, page }) => {
  dataSourceConfigPage.mockResourceResponse('clusters', CLUSTERS_RESPONSE);
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
