import { Selectors } from '../selectors/types';
import { GrafanaPage } from '../types';

export class DataSourcePicker {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    grafanaVersion: string
  ) {}

  async set(name: string) {
    // await this.grafanaPage
    //   .getByTestIdOrAriaLabel(this.selectors.components.DataSourcePicker.container)
    //   .locator('input')
    //   .fill(name);
    // // await this.grafanaPage.keyboard.press('ArrowDown');
    // await this.grafanaPage.keyboard.press('Enter');

    await this.grafanaPage
      .getByTestIdOrAriaLabel(this.selectors.components.DataSourcePicker.container)
      .locator('input')
      .click();

    await this.grafanaPage.getByText(name).last().click();
  }
}
