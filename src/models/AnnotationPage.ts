import { Expect } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { AnnotationEditPage } from './AnnotationEditPage';

export class AnnotationPage {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {}

  async goto() {
    await this.grafanaPage.goto('/dashboard/new?orgId=1&editview=annotations', {
      waitUntil: 'networkidle',
    });
  }

  async clickAddNew() {
    const { Dashboard } = this.selectors.pages;
    try {
      const ctaSelector = this.grafanaPage.getByTestIdOrAriaLabel(
        Dashboard.Settings.Annotations.List.addAnnotationCTAV2
      );
      await ctaSelector.waitFor({ timeout: 2000 });
      await ctaSelector.click();
    } catch (error) {
      this.grafanaPage.getByTestIdOrAriaLabel(Dashboard.Settings.Annotations.List.addAnnotationCTA);
    }

    return new AnnotationEditPage(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }
}
