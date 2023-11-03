import { Expect, Page } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';

import { GrafanaPage } from './GrafanaPage';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class AnnotationEditPage extends GrafanaPage {
  datasource: DataSourcePicker;
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
    this.datasource = new DataSourcePicker(this.page, this.selectors, this.grafanaVersion, expect);
  }

  async setVariableType(type: VariableType) {
    await this.getByTestIdOrAriaLabel(
      this.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2
    )
      .locator('input')
      .fill(type);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.getByTestIdOrAriaLabel(
      this.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2
    ).scrollIntoViewIfNeeded();
  }

  async runQuery() {
    await this.page.getByRole('button', { name: 'TEST' }).click();
  }

  async expectRunQueryResultToContainText(text: string) {
    await this.expect(this.page.getByText(text)).toBeVisible();
  }
}
