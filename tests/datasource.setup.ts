import { test as setup } from '../src';
import { ds } from './datasource-plugin/datasource';

setup('setupDataSource', async ({ createDataSource }) => {
  try {
    await createDataSource({ datasource: ds });
  } catch (error) {
    console.error(error);
  }
});
