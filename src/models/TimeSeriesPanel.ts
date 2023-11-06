import { Expect } from '@playwright/test';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';

export class TimeSeriesPanel extends GrafanaPage {
  constructor(testCtx: PluginTestCtx, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async expectToContainLegendLabels(text: string[]) {
    for (const label of text) {
      await this.expect(
        this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.VizLegend.seriesName(label))
      ).toBeVisible();
    }
  }
}
