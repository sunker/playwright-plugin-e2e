import { Expect, Locator } from '@playwright/test';
import { PluginTestCtx } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { GrafanaPage } from './GrafanaPage';
import { TablePanel } from './TablePanel';
import { TimeRange } from './TimeRange';

export class ExplorePage extends GrafanaPage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  timeRange: any;
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
    this.datasource = new DataSourcePicker(ctx, expect);
    this.tablePanel = new TablePanel(ctx, this.expect);
    this.timeRange = new TimeRange(ctx, this.expect);
  }

  async goto() {
    await this.ctx.page.goto(this.ctx.selectors.pages.Explore.url, {
      waitUntil: 'networkidle',
    });
  }

  getQueryEditorEditorRow(refId: string): Locator {
    const locator = this.ctx.page.locator('[aria-label="Query editor row"]').filter({
      has: this.ctx.page.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(locator).toBeVisible();
    return locator;
  }

  async runQuery() {
    await this.ctx.page.getByTestId(this.ctx.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
