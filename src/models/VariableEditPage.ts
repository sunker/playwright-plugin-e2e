const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class VariableEditPage {
  datasource: DataSourcePicker;
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {
    this.datasource = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
  }

  async fillGeneralFields(type: VariableType) {
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

  async runQuery() {
    // in 9.2.0, the submit button got a new purpose. it no longer submits the form, but instead runs the query
    if (gte(this.grafanaVersion, '9.2.0')) {
      await this.grafanaPage
        .getByTestIdOrAriaLabel(this.selectors.pages.Dashboard.Settings.Variables.Edit.General.submitButton)
        .click();
    } else {
      // in 9.1.3, the submit button submits the form
      await this.grafanaPage.keyboard.press('Tab');
    }
  }

  async expectVariableQueryPreviewToContainText(text: string) {
    this.expect(
      this.grafanaPage.getByTestIdOrAriaLabel(
        this.selectors.pages.Dashboard.Settings.Variables.Edit.General.previewOfValuesOption
      )
    ).toHaveText(text);
  }
}
