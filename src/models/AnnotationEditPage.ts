import { Expect } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';
import { GrafanaPage } from '../types';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class AnnotationEditPage {
  dataSourcePicker: DataSourcePicker;
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {
    this.dataSourcePicker = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
  }

  async fillGeneralFields(type: VariableType) {
    throw new Error('Not implemented');
  }

  async setVariableType(type: VariableType) {
    await this.grafanaPage
      .getByTestIdOrAriaLabel(this.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2)
      .locator('input')
      .fill(type);
    await this.grafanaPage.keyboard.press('ArrowDown');
    await this.grafanaPage.keyboard.press('Enter');
    await this.grafanaPage
      .getByTestIdOrAriaLabel(this.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2)
      .scrollIntoViewIfNeeded();
  }

  async setDataSource(name: string) {
    this.dataSourcePicker.set(name);
  }

  async runQuery() {
    await this.grafanaPage.getByRole('button', { name: 'TEST' }).click();
  }

  async expectRunQueryResultToContainText(text: string) {
    await this.expect(this.grafanaPage.getByText(text)).toBeVisible();
  }
}
