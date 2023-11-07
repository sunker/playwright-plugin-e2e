let randomstring = require('randomstring');
import { APIRequestContext, expect, TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../../api';
import { CreateDataSourceArgs, DataSource } from '../../types';
import { PlaywrightCombinedArgs } from '../types';

type CreateDataSourceViaAPIFixture = TestFixture<
  (args: CreateDataSourceArgs) => Promise<DataSource>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const createDataSourceViaAPI = async (
  request: APIRequestContext,
  datasource: DataSource
): Promise<DataSource> => {
  const { type, name } = datasource;
  const dsName = name ?? `${type}-${randomstring.generate()}`;

  if (datasource.uid) {
    const deleteDatasourceReq = await request.delete(`/api/datasources/uid/${datasource.uid}`);
    const status = await deleteDatasourceReq.status();
    if (status === 200) {
      console.log('Data source deleted');
    }
  }
  const createDsReq = await request.post('/api/datasources', {
    data: {
      ...datasource,
      name: dsName,
      access: 'proxy',
      isDefault: false,
    },
  });
  const status = await createDsReq.status();
  const text = await createDsReq.text();
  if (status === 200) {
    console.log('Data source created: ', text);
  } else if (status === 409) {
    console.log('Data source already exists: ', text);
  } else {
    expect.soft(createDsReq.ok(), `Failed to create data source: ${text}`).toBeTruthy();
  }

  // load ds by name
  const getDsReq = await request.get(`/api/datasources/name/${name}`);
  expect.soft(getDsReq.ok()).toBeTruthy();

  // here we don't make any distinction between ds and the ds instance edit model (DataSourceSettings)
  const ds: DataSource = await getDsReq.json();
  return ds;
};

const createDataSource: CreateDataSourceViaAPIFixture = async ({ request }, use) => {
  await use(async (args) => {
    return createDataSourceViaAPI(request, args.datasource);
  });
};

export default createDataSource;
