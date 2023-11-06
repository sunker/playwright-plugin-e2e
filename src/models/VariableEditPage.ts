const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { DataSourcePicker } from './DataSourcePicker';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class VariableEditPage extends GrafanaPage {
  datasource: DataSourcePicker;
  constructor(testCtx: PluginTestCtx, expect: Expect<any>) {
    super(testCtx, expect);
    this.datasource = new DataSourcePicker(testCtx, expect);
  }

  async setVariableType(type: VariableType) {
    await this.getByTestIdOrAriaLabel(
      this.testCtx.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2
    )
      .locator('input')
      .fill(type);
    await this.testCtx.page.keyboard.press('ArrowDown');
    await this.testCtx.page.keyboard.press('Enter');
    await this.getByTestIdOrAriaLabel(
      this.testCtx.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2
    ).scrollIntoViewIfNeeded();
  }

  async runQuery() {
    // in 9.2.0, the submit button got a new purpose. it no longer submits the form, but instead runs the query
    if (gte(this.testCtx.grafanaVersion, '9.2.0')) {
      await this.getByTestIdOrAriaLabel(
        this.testCtx.selectors.pages.Dashboard.Settings.Variables.Edit.General.submitButton
      ).click();
    } else {
      // in 9.1.3, the submit button submits the form
      await this.testCtx.page.keyboard.press('Tab');
    }
  }

  async expectVariableQueryPreviewToContainText(text: string) {
    this.expect(
      this.getByTestIdOrAriaLabel(
        this.testCtx.selectors.pages.Dashboard.Settings.Variables.Edit.General.previewOfValuesOption
      )
    ).toHaveText(text);
  }
}
