import { Expect } from '@playwright/test';
import { PluginTestCtx } from '../types';
import { GrafanaPage } from './GrafanaPage';
import { VariableEditPage } from './VariableEditPage';

export class VariablePage extends GrafanaPage {
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async goto() {
    await this.ctx.page.goto('dashboard/new?orgId=1&editview=templating', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.ctx.selectors.pages;
    try {
      const ctaSelector = this.getByTestIdOrAriaLabel(
        Dashboard.Settings.Variables.List.addVariableCTAV2('Add variable')
      );
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      await this.getByTestIdOrAriaLabel(Dashboard.Settings.Variables.List.newButton).click();
    }

    return new VariableEditPage(this.ctx, this.expect);
  }

  // not implemented
  async clickEditVariable(variableName: string) {
    return new VariableEditPage(this.ctx, this.expect);
  }
}
