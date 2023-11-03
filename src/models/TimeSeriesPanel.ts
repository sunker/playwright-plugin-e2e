import { Expect } from '@playwright/test';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestArgs } from '../types';

export class TimeSeriesPanel extends GrafanaPage {
  constructor(testCtx: PluginTestArgs, expect: Expect<any>) {
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
