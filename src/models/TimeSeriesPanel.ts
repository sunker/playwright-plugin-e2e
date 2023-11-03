import { Expect } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';

export class TimeSeriesPanel {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    // @ts-ignore
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {}

  async expectToContainLegendLabels(text: string[]) {
    for (const label of text) {
      await this.expect(
        this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.VizLegend.seriesName(label))
      ).toBeVisible();
    }
  }
}
