const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { PluginTestCtx } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { GrafanaPage } from './GrafanaPage';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class VariableEditPage extends GrafanaPage {
  datasource: DataSourcePicker;
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
    this.datasource = new DataSourcePicker(ctx, expect);
  }

  async setVariableType(type: VariableType) {
    await this.getByTestIdOrAriaLabel(
      this.ctx.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2
    )
      .locator('input')
      .fill(type);
    await this.ctx.page.keyboard.press('ArrowDown');
    await this.ctx.page.keyboard.press('Enter');
    await this.getByTestIdOrAriaLabel(
      this.ctx.selectors.pages.Dashboard.Settings.Variables.Edit.General.generalTypeSelectV2
    ).scrollIntoViewIfNeeded();
  }

  async runQuery() {
    // in 9.2.0, the submit button got a new purpose. it no longer submits the form, but instead runs the query
    if (gte(this.ctx.grafanaVersion, '9.2.0')) {
      await this.getByTestIdOrAriaLabel(
        this.ctx.selectors.pages.Dashboard.Settings.Variables.Edit.General.submitButton
      ).click();
    } else {
      // in 9.1.3, the submit button submits the form
      await this.ctx.page.keyboard.press('Tab');
    }
  }

  async expectVariableQueryPreviewToContainText(text: string) {
    await this.expect(
      this.getByTestIdOrAriaLabel(
        this.ctx.selectors.pages.Dashboard.Settings.Variables.Edit.General.previewOfValuesOption
      )
    ).toHaveText(text);
  }
}
