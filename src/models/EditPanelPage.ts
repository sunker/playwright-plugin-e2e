import { Expect, Page } from '@playwright/test';
import { GrafanaLocator, Visualization } from '../types';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';
import { attachCustomLocators } from '../utils/locator';
import { TablePanel } from './TablePanel';
import { TimeRange } from './TimeRange';
import { TimeSeriesPanel } from './TimeSeriesPanel';
import { GrafanaPage } from './GrafanaPage';

export class EditPanelPage extends GrafanaPage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  timeRange: TimeRange;
  timeSeriesPanel: TimeSeriesPanel;

  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
    this.datasource = new DataSourcePicker(this.page, this.selectors, this.grafanaVersion, expect);
    this.tablePanel = new TablePanel(this.page, this.selectors, this.grafanaVersion, this.expect);
    this.timeRange = new TimeRange(this.page, this.selectors, this.grafanaVersion, this.expect);
    this.timeSeriesPanel = new TimeSeriesPanel(this.page, this.selectors, this.grafanaVersion, this.expect);
  }

  async setVisualization(visualization: Visualization) {
    await this.getByTestIdOrAriaLabel(this.selectors.components.PanelEditor.toggleVizPicker).click();

    await this.getByTestIdOrAriaLabel(this.selectors.components.PluginVisualization.item(visualization)).click();
  }

  getVisualizationName() {
    return this.getByTestIdOrAriaLabel(this.selectors.components.PanelEditor.toggleVizPicker);
  }

  async setPanelTitle(title: string) {
    const isVisible = await this.getByTestIdOrAriaLabel(this.selectors.components.OptionsGroup.group('Panel options'))
      .locator('input')
      .first()
      .isVisible();
    if (!isVisible) {
      // expand panel options if not visible
      await this.getByTestIdOrAriaLabel(this.selectors.components.OptionsGroup.group('Panel options'))
        .locator('button')
        .click();
    }
    await this.getByTestIdOrAriaLabel(this.selectors.components.OptionsGroup.group('Panel options'))
      .locator('input')
      .first()
      .fill(title);
  }

  async apply() {
    await this.page.getByTestId(this.selectors.components.PanelEditor.applyButton).click();
  }

  async getQueryEditorEditorRow(refId: string): Promise<GrafanaLocator> {
    const locator = await this.page.locator('[aria-label="Query editor row"]').filter({
      has: this.page.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(locator).toBeVisible();
    return attachCustomLocators(locator);
  }

  async refreshDashboard(waitForQueryRequest: boolean = false) {
    // in older versions of grafana, the refresh button is rendered twice. this is a workaround to click the correct one
    await this.getByTestIdOrAriaLabel(this.selectors.components.PanelEditor.General.content)
      .locator(`selector=${this.selectors.components.RefreshPicker.runButtonV2}`)
      .click();
    if (waitForQueryRequest) {
      await this.page.waitForResponse((resp) => resp.url().includes('/query'));
    }
  }
}
