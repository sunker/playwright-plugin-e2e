import { Expect, Page } from '@playwright/test';
import { GrafanaLocator } from '../types';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';
import { TablePanel } from './TablePanel';
import { TimeRange } from './TimeRange';
import { attachCustomLocators } from '../utils/locator';
import { GrafanaPage } from './GrafanaPage';

export class ExplorePage extends GrafanaPage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  timeRange: any;
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
    this.datasource = new DataSourcePicker(this.page, this.selectors, this.grafanaVersion, expect);
    this.tablePanel = new TablePanel(this.page, this.selectors, this.grafanaVersion, this.expect);
    this.timeRange = new TimeRange(this.page, this.selectors, this.grafanaVersion, this.expect);
  }

  async goto() {
    await this.page.goto(this.selectors.pages.Explore.url, {
      waitUntil: 'networkidle',
    });
  }

  async getQueryEditorEditorRow(refId: string): Promise<GrafanaLocator> {
    const locator = await this.page.locator('[aria-label="Query editor row"]').filter({
      has: this.page.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(locator).toBeVisible();
    return attachCustomLocators(locator);
  }

  async runQuery() {
    await this.page.getByTestId(this.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
