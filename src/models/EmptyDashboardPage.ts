import { Expect, type APIRequestContext, Page } from '@playwright/test';
import { Selectors } from '../selectors/types';

import { DashboardPage } from './DashboardPage';

export class EmptyDashboardPage extends DashboardPage {
  constructor(
    page: Page,
    request: APIRequestContext,
    selectors: Selectors,
    grafanaVersion: string,
    expect: Expect<any>
  ) {
    super(page, selectors, grafanaVersion, expect, request);
  }

  async goto() {
    await this.page.goto(this.selectors.pages.AddDashboard.url, {
      waitUntil: 'networkidle',
    });
  }
}
