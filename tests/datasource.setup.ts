import { DataSource, test as setup } from '../src';

const datasource: DataSource = {
  database: '',
  type: 'grafana-redshift-datasource',
  name: 'Redshift_E2E_Test',
  uid: 'P7DC3E4760CFAC4AH',
  id: 1,
  access: 'proxy',
  url: '',
  isDefault: false,
  jsonData: {
    authType: 'keys',
    defaultRegion: 'us-east-2',
    useManagedSecret: false,
    database: 'dev',
    dbUser: 'cloud-datasources',
    clusterIdentifier: 'redshift-cluster-grafana',
  },
  secureJsonData: {
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
  },
};

setup('setupDataSource', async ({ createDataSource }) => {
  try {
    await createDataSource({ datasource });
  } catch (error) {
    console.log(error);
  }
});
