import { expect, TestFixture } from '@playwright/test';
import { PluginOptions, PluginFixture } from '../fixtures/plugin';
import { LoginArgs } from '../types';
import { PlaywrightCombinedArgs } from './types';

const authFile = 'playwright/.auth/user.json';

type LoginCommand = TestFixture<
  (args?: LoginArgs) => Promise<void>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const loginCommand: LoginCommand = async (
  { request, httpCredentials = { user: 'admin', password: 'admin' } },
  use
) => {
  await use(async (args) => {
    const loginReq = await request.post('/login', { data: defaultCredentials });
    const text = await await loginReq.text();
    expect.soft(loginReq.ok(), `Could not log in to Grafana: ${text}`).toBeTruthy();
    await request.storageState({ path: authFile });
  });
};
