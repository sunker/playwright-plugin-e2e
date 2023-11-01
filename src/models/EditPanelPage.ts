import { Expect } from '@playwright/test';
import { GrafanaLocator, GrafanaPage, Visualization } from '../types';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';
import { attachCustomLocators } from '../utils/locator';
import { TablePanel } from './TablePanel';
import { TimeRange } from './TimeRange';
import { TimeSeriesPanel } from './TimeSeriesPanel';

export class EditPanelPage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  timeRange: TimeRange;
  timeSeriesPanel: TimeSeriesPanel;

  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {
    this.datasource = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
    this.tablePanel = new TablePanel(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
    this.timeRange = new TimeRange(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
    this.timeSeriesPanel = new TimeSeriesPanel(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async setVisualization(visualization: Visualization) {
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
}
