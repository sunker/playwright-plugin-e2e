import { Expect } from '@playwright/test';
import { VariableEditPage } from './VariableEditPage';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestArgs } from '../pluginType';

export class VariablePage extends GrafanaPage {
  constructor(testCtx: PluginTestArgs, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async goto() {
    await this.testCtx.page.goto('dashboard/new?orgId=1&editview=templating', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.testCtx.selectors.pages;
    try {
      const ctaSelector = this.getByTestIdOrAriaLabel(
        Dashboard.Settings.Variables.List.addVariableCTAV2('Add variable')
      );
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      await this.getByTestIdOrAriaLabel(Dashboard.Settings.Variables.List.newButton).click();
    }

    return new VariableEditPage(this.testCtx, this.expect);
  }

  // not implemented
  async clickEditVariable(variableName: string) {
    return new VariableEditPage(this.testCtx, this.expect);
  }
}
