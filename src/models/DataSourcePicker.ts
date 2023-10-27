import { Selectors } from '../selectors/types';
import { GrafanaPage } from '../types';

export class DataSourcePicker {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    grafanaVersion: string
  ) {}

  async set(name: string) {
    await this.grafanaPage
      .getByTestIdOrAriaLabel(this.selectors.components.DataSourcePicker.container)
      .locator('input')
      .fill(name);

    // nasty hack to get the selection to work in 10.ish versions of Grafana. needs to be fixed properly
    await this.grafanaPage.keyboard.press('ArrowDown');
    await this.grafanaPage.keyboard.press('ArrowUp');
    await this.grafanaPage.keyboard.press('Enter');
  }
}
