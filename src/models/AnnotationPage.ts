import { Expect } from '@playwright/test';
import { AnnotationEditPage } from './AnnotationEditPage';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';

export class AnnotationPage extends GrafanaPage {
  constructor(testCtx: PluginTestCtx, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async goto() {
    await this.testCtx.page.goto('/dashboard/new?orgId=1&editview=annotations', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.testCtx.selectors.pages;
    try {
      const ctaSelector = this.getByTestIdOrAriaLabel(Dashboard.Settings.Annotations.List.addAnnotationCTAV2);
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      this.getByTestIdOrAriaLabel(Dashboard.Settings.Annotations.List.addAnnotationCTA);
    }

    return new AnnotationEditPage(this.testCtx, this.expect);
  }
}
