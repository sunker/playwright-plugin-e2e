import { Expect, Page } from '@playwright/test';

import { Selectors } from '../selectors/types';
import { VariableEditPage } from './VariableEditPage';
import { GrafanaPage } from './GrafanaPage';

export class VariablePage extends GrafanaPage {
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
  }

  async goto() {
    await this.page.goto('dashboard/new?orgId=1&editview=templating', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.selectors.pages;
    try {
      const ctaSelector = this.getByTestIdOrAriaLabel(
        Dashboard.Settings.Variables.List.addVariableCTAV2('Add variable')
      );
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      await this.getByTestIdOrAriaLabel(Dashboard.Settings.Variables.List.newButton).click();
    }

    return new VariableEditPage(this.page, this.selectors, this.grafanaVersion, this.expect);
  }

  // not implemented
  async clickEditVariable(variableName: string) {
    return new VariableEditPage(this.page, this.selectors, this.grafanaVersion, this.expect);
  }
}
