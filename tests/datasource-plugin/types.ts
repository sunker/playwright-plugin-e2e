export type RedshiftDatasourceConfig = {
  name: string;
  secureJsonData: {
    accessKey: string;
    secretKey: string;
  };
  jsonData: {
    clusterIdentifier: string;
    database: string;
    dbUser: string;
    defaultRegion: string;
    managedSecret: {
      arn: string;
      name: string;
    };
  };
};

export type RedshiftProvision = {
  datasources: RedshiftDatasourceConfig[];
};
