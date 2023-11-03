import { test as setup } from '../fixtures/plugin';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, request, defaultCredentials }) => {
  await request.post('/login', { data: defaultCredentials });
  await request.storageState({ path: authFile });
});
