var randomstring = require('randomstring');
import { expect, TestFixture } from '@playwright/test';
import { CreateDataSourceArgs, DataSource } from '../types';
import { PlaywrightCombinedArgs } from './types';
import { PluginOptions, PluginFixture } from '../pluginType';

type CreateDataSourceViaAPICommand = TestFixture<
  (args: CreateDataSourceArgs) => Promise<DataSource>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const createDataSourceViaAPICommand: CreateDataSourceViaAPICommand = async ({ request }, use) => {
  await use(async (args) => {
    const { type, name } = args.datasource;
    const dsName = name ?? `${type}-${randomstring.generate()}`;
    const createDsReq = await request.post('/api/datasources', {
      data: {
        ...args.datasource,
        name: dsName,
        access: 'proxy',
        isDefault: false,
      },
    });
    const status = await createDsReq.status();
    if (status === 409) {
      console.log('Data source with the same name already exists');
    } else {
      const error = await await createDsReq.text();
      expect(createDsReq.ok(), `Failed to create data source: ${error}`).toBeTruthy();
    }

    // load ds by name
    const getDsReq = await request.get(`/api/datasources/name/${name}`);
    expect(getDsReq.ok()).toBeTruthy();

    // here we don't make any distinction between ds and the ds instance edit model (DataSourceSettings)
    const ds: DataSource = await getDsReq.json();
    return ds;
  });
};
