import { test as setup } from '../src';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ login }) => {
  await login();
});
