const gte = require('semver/functions/gte');
import { Locator } from 'playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { Expect } from '@playwright/test';
import { DataSourcePicker } from './DataSourcePicker';

export class EditPanelPage {
  private dataSourcePicker: DataSourcePicker;
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {
    this.dataSourcePicker = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
  }

  async apply() {
    await this.grafanaPage.getByTestId(this.selectors.components.PanelEditor.applyButton).click();
  }

  async setDataSource(name: string) {
    await this.dataSourcePicker.set(name);
  }

  async getQueryEditorEditorRow(refId: string): Promise<Locator> {
    const elem = await this.grafanaPage.locator('[aria-label="Query editor row"]').filter({
      has: this.grafanaPage.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(elem).toBeVisible();
    return elem;
  }

  async refreshDashboard(waitForQueryRequest: boolean = false) {
    // in older versions of grafana, the refresh button is rendered twice. this is a workaround to click the correct one
    await this.grafanaPage
      .getByTestIdOrAriaLabel(this.selectors.components.PanelEditor.General.content)
      .locator(`selector=${this.selectors.components.RefreshPicker.runButtonV2}`)
      .click();
    if (waitForQueryRequest) {
      await this.grafanaPage.waitForResponse((resp) => resp.url().includes('/query'));
    }
  }

  async expectTableToContainText(text: string) {
    const locator = gte(this.grafanaVersion, '10.2.0')
      ? this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.Panels.Visualization.Table.body)
      : this.grafanaPage.locator('div[role="table"]');
    return await this.expect(locator).toContainText(text);
  }
}
