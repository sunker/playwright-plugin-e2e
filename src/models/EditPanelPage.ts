const gte = require('semver/functions/gte');
import { GrafanaLocator, GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { Expect } from '@playwright/test';
import { DataSourcePicker } from './DataSourcePicker';
import { attachCustomLocators } from 'src/utils/locator';
import { TablePanel } from './TablePanel';

export class EditPanelPage {
  datasource: DataSourcePicker;
  tablePanel: any;
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {
    this.datasource = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
    this.tablePanel = new TablePanel(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async setVisualization(visualization: string) {
    await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.PanelEditor.toggleVizPicker).click();

    await this.grafanaPage
      .getByTestIdOrAriaLabel(this.selectors.components.PluginVisualization.item(visualization))
      .click();
  }

  async apply() {
    await this.grafanaPage.getByTestId(this.selectors.components.PanelEditor.applyButton).click();
  }

  async getQueryEditorEditorRow(refId: string): Promise<GrafanaLocator> {
    const locator = await this.grafanaPage.locator('[aria-label="Query editor row"]').filter({
      has: this.grafanaPage.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(locator).toBeVisible();
    return attachCustomLocators(locator);
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

  // async expectTableToContainText(text: string) {
  //   const locator = gte(this.grafanaVersion, '10.2.0')
  //     ? this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.Panels.Visualization.Table.body)
  //     : this.grafanaPage.locator('div[role="table"]');
  //   return await this.expect(locator).toContainText(text);
  // }
}
