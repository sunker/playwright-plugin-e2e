import { Expect, type APIRequestContext } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { GrafanaPage } from '../types';
import { DashboardPage } from './DashboardPage';

export class EmptyDashboardPage extends DashboardPage {
  constructor(
    grafanaPage: GrafanaPage,
    request: APIRequestContext,
    selectors: Selectors,
    grafanaVersion: string,
    expect: Expect<any>
  ) {
    super(grafanaPage, request, selectors, grafanaVersion, expect);
  }

  async goto() {
    await this.grafanaPage.goto(this.selectors.pages.AddDashboard.url, {
      waitUntil: 'networkidle',
    });
  }
}
