import { Expect, Locator } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';
import { TablePanel } from './TablePanel';

export class ExplorePage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {
    this.datasource = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
    this.tablePanel = new TablePanel(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async goto() {
    await this.grafanaPage.goto(this.selectors.pages.Explore.url, {
      waitUntil: 'networkidle',
    });
  }

  async getQueryEditorEditorRow(refId: string): Promise<Locator> {
    const elem = await this.grafanaPage.locator('[aria-label="Query editor row"]').filter({
      has: this.grafanaPage.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(elem).toBeVisible();
    return elem;
  }

  async runQuery() {
    await this.grafanaPage.getByTestId(this.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
