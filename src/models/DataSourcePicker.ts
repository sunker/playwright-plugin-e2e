import { Expect } from '@playwright/test';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestArgs } from '../types';

export class DataSourcePicker extends GrafanaPage {
  constructor(testCtx: PluginTestArgs, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async set(name: string) {
    await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.DataSourcePicker.container)
      .locator('input')
      .fill(name);

    // hack to get the selection to work in 10.ish versions of Grafana. needs to be fixed properly
    await this.testCtx.page.keyboard.press('ArrowDown');
    await this.testCtx.page.keyboard.press('ArrowUp');
    await this.testCtx.page.keyboard.press('Enter');
  }
}
