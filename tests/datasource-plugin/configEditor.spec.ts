import randomstring from 'randomstring';
import { test, readProvision } from '../../src';
import { RedshiftProvision } from './types';
import { ds } from './datasource';

test('valid aws-sdk-auth config', async ({ dataSourceConfigPage, grafanaPage, readProvision }) => {
  await dataSourceConfigPage.createDataSource('grafana-redshift-datasource', ds.name);
  await grafanaPage.getByTestIdOrAriaLabel('Default Region').fill(ds.jsonData.defaultRegion!);
  await grafanaPage.keyboard.press('Enter');
  await grafanaPage.getByTestIdOrAriaLabel('Cluster Identifier').click();
  await grafanaPage.waitForResponse((resp) => resp.url().includes('resources/clusters') && resp.status() === 200, {
    timeout: 5000,
  });
  await grafanaPage.getByTestIdOrAriaLabel('Cluster Identifier').fill(ds.jsonData.clusterIdentifier!);
  await grafanaPage.keyboard.press('Enter');

  await grafanaPage.getByTestIdOrAriaLabel('data-testid database').fill(ds.jsonData.database!);
  await grafanaPage.getByTestIdOrAriaLabel('data-testid dbuser').fill(ds.jsonData.dbUser!);
  await dataSourceConfigPage.saveAndTest();
  await dataSourceConfigPage.expectHealthCheckResultTextToContain('Data source is working');
});

test('valid keys config', async ({ dataSourceConfigPage, grafanaPage, readProvision }) => {
  const ds = await readProvision<RedshiftProvision>('datasources/aws-redshift.yaml').then((res) => res.datasources[0]);
  await dataSourceConfigPage.createDataSource('grafana-redshift-datasource', `redshift-${randomstring.generate()}`);
  await grafanaPage.getByTestIdOrAriaLabel('Authentication Provider').fill('Access & secret key');
  await grafanaPage.keyboard.press('Enter');
  await grafanaPage.getByTestIdOrAriaLabel('Secret Access Key').fill(ds.secureJsonData.secretKey);
  await grafanaPage.getByTestIdOrAriaLabel('Access Key ID').fill(ds.secureJsonData.accessKey);
  await grafanaPage.getByTestIdOrAriaLabel('Default Region').fill(ds.jsonData.defaultRegion);
  await grafanaPage.keyboard.press('Enter');
  await grafanaPage.getByTestIdOrAriaLabel('Cluster Identifier').click();
  await grafanaPage.getByTestIdOrAriaLabel('data-testid clusterID');
  await grafanaPage.getByTestIdOrAriaLabel('Cluster Identifier').fill(ds.jsonData.clusterIdentifier);
  await grafanaPage.keyboard.press('Enter');

  await grafanaPage.getByTestIdOrAriaLabel('data-testid database').fill(ds.jsonData.database);
  await grafanaPage.getByTestIdOrAriaLabel('data-testid dbuser').fill(ds.jsonData.dbUser);
  await dataSourceConfigPage.saveAndTest();
  await dataSourceConfigPage.expectHealthCheckResultTextToContain('Data source is working');
});
