const gte = require('semver/functions/gte');
import { Expect, Page } from '@playwright/test';

import { Selectors } from '../selectors/types';
import { GrafanaPage } from './GrafanaPage';

export class TablePanel extends GrafanaPage {
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
  }

  async expectToContainText(text: string) {
    const locator = gte(this.grafanaVersion, '10.2.0')
      ? this.getByTestIdOrAriaLabel(this.selectors.components.Panels.Visualization.Table.body)
      : this.page.locator('div[role="table"]');
    return await this.expect(locator).toContainText(text);
  }
}
