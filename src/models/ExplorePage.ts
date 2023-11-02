import { Expect } from '@playwright/test';
import { GrafanaLocator, GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';
import { TablePanel } from './TablePanel';
import { TimeRange } from './TimeRange';
import { attachCustomLocators } from '../utils/locator';

export class ExplorePage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  timeRange: any;
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {
    this.datasource = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
    this.tablePanel = new TablePanel(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
    this.timeRange = new TimeRange(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async goto() {
    await this.grafanaPage.goto(this.selectors.pages.Explore.url, {
      waitUntil: 'networkidle',
    });
  }

  async getQueryEditorEditorRow(refId: string): Promise<GrafanaLocator> {
    const locator = await this.grafanaPage.locator('[aria-label="Query editor row"]').filter({
      has: this.grafanaPage.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(locator).toBeVisible();
    return attachCustomLocators(locator);
  }

  async runQuery() {
    await this.grafanaPage.getByTestId(this.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
