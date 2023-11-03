const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestArgs } from '../pluginType';

export class TablePanel extends GrafanaPage {
  constructor(testCtx: PluginTestArgs, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async expectToContainText(text: string) {
    const locator = gte(this.testCtx.grafanaVersion, '10.2.0')
      ? this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.Panels.Visualization.Table.body)
      : this.testCtx.page.locator('div[role="table"]');
    return await this.expect(locator).toContainText(text);
  }
}
