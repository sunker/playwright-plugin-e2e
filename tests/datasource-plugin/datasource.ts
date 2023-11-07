import { DataSource } from '../../src/types';

export const ds: DataSource = {
  database: '',
  type: 'grafana-redshift-datasource',
  name: 'Redshift_E2E_Test',
  uid: 'P7DC3E4760CFAC4AHHGGA',
  id: 1,
  access: 'proxy',
  editable: true,
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
