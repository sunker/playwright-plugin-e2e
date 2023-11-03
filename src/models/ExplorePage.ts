import { Expect } from '@playwright/test';
import { GrafanaLocator } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { TablePanel } from './TablePanel';
import { TimeRange } from './TimeRange';
import { attachCustomLocators } from '../utils/locator';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestArgs } from '../types';

export class ExplorePage extends GrafanaPage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  timeRange: any;
  constructor(testCtx: PluginTestArgs, expect: Expect<any>) {
    super(testCtx, expect);
    this.datasource = new DataSourcePicker(testCtx, expect);
    this.tablePanel = new TablePanel(testCtx, this.expect);
    this.timeRange = new TimeRange(testCtx, this.expect);
  }

  async goto() {
    await this.testCtx.page.goto(this.testCtx.selectors.pages.Explore.url, {
      waitUntil: 'networkidle',
    });
  }

  async getQueryEditorEditorRow(refId: string): Promise<GrafanaLocator> {
    const locator = await this.testCtx.page.locator('[aria-label="Query editor row"]').filter({
      has: this.testCtx.page.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(locator).toBeVisible();
    return attachCustomLocators(locator);
  }

  async runQuery() {
    await this.testCtx.page.getByTestId(this.testCtx.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
