import { expect, TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../fixtures/plugin';
import { PlaywrightCombinedArgs } from './types';

const authFile = 'playwright/.auth/user.json';

type LoginCommand = TestFixture<() => Promise<void>, PluginFixture & PluginOptions & PlaywrightCombinedArgs>;

export const loginCommand: LoginCommand = async ({ request, httpCredentials }, use) => {
  await use(async () => {
    console.log(httpCredentials);
    const data = httpCredentials ? { ...httpCredentials, user: 'admin' } : { user: 'admin', password: 'admin' };
    const loginReq = await request.post('/login', { data });
    const text = await loginReq.text();
    expect.soft(loginReq.ok(), `Could not log in to Grafana: ${text}`).toBeTruthy();
    await request.storageState({ path: authFile });
  });
};
