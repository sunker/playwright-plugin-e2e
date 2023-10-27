import { Expect } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { VariableEditPage } from './VariableEditPage';

export class VariablePage {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {}

  async goto() {
    await this.grafanaPage.goto('dashboard/new?orgId=1&editview=templating', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.selectors.pages;
    try {
      const ctaSelector = this.grafanaPage.getByTestIdOrAriaLabel(
        Dashboard.Settings.Variables.List.addVariableCTAV2('Add variable')
      );
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      await this.grafanaPage.getByTestIdOrAriaLabel(Dashboard.Settings.Variables.List.newButton).click();
    }

    return new VariableEditPage(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  // not implemented
  async clickEditVariable(variableName: string) {
    return new VariableEditPage(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }
}
