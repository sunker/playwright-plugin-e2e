import { TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../api';
import { PlaywrightCombinedArgs } from './types';

type GrafanaVersion = TestFixture<string, PluginFixture & PluginOptions & PlaywrightCombinedArgs>;

const grafanaVersion: GrafanaVersion = async ({ page }, use) => {
  if (process.env.GRAFANA_VERSION) {
    return await use(process.env.GRAFANA_VERSION);
  }
  await page.goto('/', { waitUntil: 'networkidle' });
  const grafanaVersion: string = await page.evaluate('window.grafanaBootData.settings.buildInfo.version');
  await use(grafanaVersion);
};

export default grafanaVersion;
