var randomstring = require('randomstring');
import { APIRequestContext, expect } from '@playwright/test';
import { DataSource } from '../types';

export const createDataSource = async (request: APIRequestContext, datasource: DataSource): Promise<DataSource> => {
  const { type, name } = datasource;
  const dsName = name ?? `${type}-${randomstring.generate()}`;
  const createDsReq = await request.post('/api/datasources', {
    data: {
      name: dsName,
      type: type,
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

  return getDsReq.json();
};
