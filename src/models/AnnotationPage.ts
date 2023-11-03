import { Expect, Page } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { AnnotationEditPage } from './AnnotationEditPage';
import { GrafanaPage } from './GrafanaPage';

export class AnnotationPage extends GrafanaPage {
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
  }

  async goto() {
    await this.page.goto('/dashboard/new?orgId=1&editview=annotations', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.selectors.pages;
    try {
      const ctaSelector = this.getByTestIdOrAriaLabel(Dashboard.Settings.Annotations.List.addAnnotationCTAV2);
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      this.getByTestIdOrAriaLabel(Dashboard.Settings.Annotations.List.addAnnotationCTA);
    }

    return new AnnotationEditPage(this.page, this.selectors, this.grafanaVersion, this.expect);
  }
}
