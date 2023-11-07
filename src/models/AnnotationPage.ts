import { Expect } from '@playwright/test';
import { PluginTestCtx } from '../types';
import { AnnotationEditPage } from './AnnotationEditPage';
import { GrafanaPage } from './GrafanaPage';

export class AnnotationPage extends GrafanaPage {
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async goto() {
    await this.ctx.page.goto('/dashboard/new?orgId=1&editview=annotations', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.ctx.selectors.pages;
    try {
      const ctaSelector = this.getByTestIdOrAriaLabel(Dashboard.Settings.Annotations.List.addAnnotationCTAV2);
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      this.getByTestIdOrAriaLabel(Dashboard.Settings.Annotations.List.addAnnotationCTA);
    }

    return new AnnotationEditPage(this.ctx, this.expect);
  }
}
