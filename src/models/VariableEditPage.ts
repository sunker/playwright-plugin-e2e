const gte = require('semver/functions/gte');
import { Expect, Page } from '@playwright/test';

import { Selectors } from '../selectors/types';
import { DataSourcePicker } from './DataSourcePicker';
import { GrafanaPage } from './GrafanaPage';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class VariableEditPage extends GrafanaPage {
  datasource: DataSourcePicker;
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
    this.datasource = new DataSourcePicker(this.page, this.selectors, this.grafanaVersion, expect);
  }

  async fillGeneralFields(type: VariableType) {
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
    // in 9.2.0, the submit button got a new purpose. it no longer submits the form, but instead runs the query
    if (gte(this.grafanaVersion, '9.2.0')) {
      await this.getByTestIdOrAriaLabel(
        this.selectors.pages.Dashboard.Settings.Variables.Edit.General.submitButton
      ).click();
    } else {
      // in 9.1.3, the submit button submits the form
      await this.page.keyboard.press('Tab');
    }
  }

  async expectVariableQueryPreviewToContainText(text: string) {
    this.expect(
      this.getByTestIdOrAriaLabel(this.selectors.pages.Dashboard.Settings.Variables.Edit.General.previewOfValuesOption)
    ).toHaveText(text);
  }
}
