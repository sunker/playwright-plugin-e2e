import { expect, TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../../api';
import { PlaywrightCombinedArgs } from '../types';

const authFile = 'playwright/.auth/user.json';

type LoginCommand = TestFixture<() => Promise<void>, PluginFixture & PluginOptions & PlaywrightCombinedArgs>;

const login: LoginCommand = async ({ request, httpCredentials }, use) => {
  await use(async () => {
    const data = httpCredentials ? { ...httpCredentials, user: 'admin' } : { user: 'admin', password: 'admin' };
    const loginReq = await request.post('/login', { data });
    const text = await loginReq.text();
    expect.soft(loginReq.ok(), `Could not log in to Grafana: ${text}`).toBeTruthy();
    await request.storageState({ path: authFile });
  });
};

export default login;
