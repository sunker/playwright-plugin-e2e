import { Expect } from '@playwright/test';
import { PluginTestCtx } from '../types';
import { GrafanaPage } from './GrafanaPage';

export class DataSourcePicker extends GrafanaPage {
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async set(name: string) {
    await this.getByTestIdOrAriaLabel(this.ctx.selectors.components.DataSourcePicker.container)
      .locator('input')
      .fill(name);

    // hack to get the selection to work in 10.ish versions of Grafana. needs to be fixed properly
    await this.ctx.page.keyboard.press('ArrowDown');
    await this.ctx.page.keyboard.press('ArrowUp');
    await this.ctx.page.keyboard.press('Enter');
  }
}
