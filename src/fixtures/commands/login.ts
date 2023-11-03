import { expect, TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../types';
import { PlaywrightCombinedArgs } from './types';
import { LoginArgs } from '../../types';

const authFile = 'playwright/.auth/user.json';

type LoginCommand = TestFixture<
  (args?: LoginArgs) => Promise<void>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const loginCommand: LoginCommand = async ({ request, defaultCredentials }, use) => {
  await use(async (args) => {
    const loginReq = await request.post('/login', { data: args ?? defaultCredentials });
    const text = await await loginReq.text();
    expect.soft(loginReq.ok(), `Could not log in to Grafana: ${text}`).toBeTruthy();
    await request.storageState({ path: authFile });
  });
};
