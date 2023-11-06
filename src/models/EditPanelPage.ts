import { Expect } from '@playwright/test';
import { GrafanaLocator, Visualization } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { attachCustomLocators } from '../locator';
import { TablePanel } from './TablePanel';
import { TimeRange } from './TimeRange';
import { TimeSeriesPanel } from './TimeSeriesPanel';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';

export class EditPanelPage extends GrafanaPage {
  datasource: DataSourcePicker;
  tablePanel: TablePanel;
  timeRange: TimeRange;
  timeSeriesPanel: TimeSeriesPanel;

  constructor(testCtx: PluginTestCtx, expect: Expect<any>) {
    super(testCtx, expect);
    this.datasource = new DataSourcePicker(testCtx, expect);
    this.tablePanel = new TablePanel(testCtx, this.expect);
    this.timeRange = new TimeRange(testCtx, this.expect);
    this.timeSeriesPanel = new TimeSeriesPanel(testCtx, this.expect);
  }

  async setVisualization(visualization: Visualization) {
    await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.PanelEditor.toggleVizPicker).click();

    await this.getByTestIdOrAriaLabel(
      this.testCtx.selectors.components.PluginVisualization.item(visualization)
    ).click();
  }

  getVisualizationName() {
    return this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.PanelEditor.toggleVizPicker);
  }

  async setPanelTitle(title: string) {
    const isVisible = await this.getByTestIdOrAriaLabel(
      this.testCtx.selectors.components.OptionsGroup.group('Panel options')
    )
      .locator('input')
      .first()
      .isVisible();
    if (!isVisible) {
      // expand panel options if not visible
      await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.OptionsGroup.group('Panel options'))
        .locator('button')
        .click();
    }
    await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.OptionsGroup.group('Panel options'))
      .locator('input')
      .first()
      .fill(title);
  }

  async apply() {
    await this.testCtx.page.getByTestId(this.testCtx.selectors.components.PanelEditor.applyButton).click();
  }

  async getQueryEditorEditorRow(refId: string): Promise<GrafanaLocator> {
    const locator = await this.testCtx.page.locator('[aria-label="Query editor row"]').filter({
      has: this.testCtx.page.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(locator).toBeVisible();
    return attachCustomLocators(locator);
  }

  async refreshDashboard(waitForQueryRequest: boolean = false) {
    // in older versions of grafana, the refresh button is rendered twice. this is a workaround to click the correct one
    await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.PanelEditor.General.content)
      .locator(`selector=${this.testCtx.selectors.components.RefreshPicker.runButtonV2}`)
      .click();
    if (waitForQueryRequest) {
      await this.testCtx.page.waitForResponse((resp) => resp.url().includes('/query'));
    }
  }
}
