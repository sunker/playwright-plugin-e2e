const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { PluginTestCtx } from '../types';
import { GrafanaPage } from './GrafanaPage';

export class TablePanel extends GrafanaPage {
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async expectToContainText(text: string) {
    const locator = gte(this.ctx.grafanaVersion, '10.2.0')
      ? this.getByTestIdOrAriaLabel(this.ctx.selectors.components.Panels.Visualization.Table.body)
      : this.ctx.page.locator('div[role="table"]');
    return await this.expect(locator).toContainText(text);
  }
}
