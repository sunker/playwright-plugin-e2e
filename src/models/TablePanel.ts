const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';

export class TablePanel {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {}

  async expectToContainText(text: string) {
    const locator = gte(this.grafanaVersion, '10.2.0')
      ? this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.Panels.Visualization.Table.body)
      : this.grafanaPage.locator('div[role="table"]');
    return await this.expect(locator).toContainText(text);
  }
}