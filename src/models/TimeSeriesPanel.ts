import { Expect, Page } from '@playwright/test';

import { Selectors } from '../selectors/types';
import { GrafanaPage } from './GrafanaPage';

export class TimeSeriesPanel extends GrafanaPage {
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
  }

  async expectToContainLegendLabels(text: string[]) {
    for (const label of text) {
      await this.expect(
        this.getByTestIdOrAriaLabel(this.selectors.components.VizLegend.seriesName(label))
      ).toBeVisible();
    }
  }
}
