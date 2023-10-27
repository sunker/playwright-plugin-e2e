import { APIRequestContext, expect } from '@playwright/test';
import { DataSource } from '../types';

export const createDataSource = async (request: APIRequestContext, datasource: DataSource): Promise<DataSource> => {
  const createDsReq = await request.post('/api/datasources', {
    data: {
      name: datasource.name,
      type: datasource.type,
      access: 'proxy',
      isDefault: false,
    },
  });
  expect(createDsReq.ok()).toBeTruthy();
  const json = await createDsReq.json();
  const updateDsReq = await request.put(`/api/datasources/uid/${json.datasource.uid}`, {
    data: {
      ...json.datasource,
      ...datasource,
      uid: json.datasource.uid,
      id: json.datasource.id,
    },
  });
  expect(updateDsReq.ok()).toBeTruthy();
  const updatedDataSource = await updateDsReq.json();
  return updatedDataSource;
};
