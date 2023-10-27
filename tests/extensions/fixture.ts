import randomstring from 'randomstring';
import { DataSource, test as base, createDataSource } from '../../src';

type PluginFixture = {
  datasource: DataSource;
};

export const test = base.extend<PluginFixture>({
  datasource: async ({ grafanaPage, request }, use) => {
    const datasource = await createDataSource(request, {
      type: 'grafana-redshift-datasource',
      name: `redshift-${randomstring.generate()}`,
      jsonData: {
        password: 'test',
      },
    });
    await use(datasource);
  },
});

export { expect } from '@playwright/test';
