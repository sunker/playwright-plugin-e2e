import { Expect } from '@playwright/test';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';

export class TimeSeriesPanel extends GrafanaPage {
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async expectToContainLegendLabels(text: string[]) {
    for (const label of text) {
      await this.expect(
        this.getByTestIdOrAriaLabel(this.ctx.selectors.components.VizLegend.seriesName(label))
      ).toBeVisible();
    }
  }
}
