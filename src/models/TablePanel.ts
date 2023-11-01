const gte = require('semver/functions/gte');
import { Expect, Locator } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';

export class TablePanel {
  dataSourcePicker: DataSourcePicker;
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {
    this.dataSourcePicker = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
  }

  async expectToContainText(text: string) {
    const locator = gte(this.grafanaVersion, '10.2.0')
      ? this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.Panels.Visualization.Table.body)
      : this.grafanaPage.locator('div[role="table"]');
    return await this.expect(locator).toContainText(text);
  }
}
