import { Expect, Page } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { GrafanaPage } from './GrafanaPage';

export class DataSourcePicker extends GrafanaPage {
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
  }

  async set(name: string) {
    await this.getByTestIdOrAriaLabel(this.selectors.components.DataSourcePicker.container).locator('input').fill(name);

    // nasty hack to get the selection to work in 10.ish versions of Grafana. needs to be fixed properly
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('ArrowUp');
    await this.page.keyboard.press('Enter');
  }
}
