import { Expect } from '@playwright/test';
import { DashboardPage } from './DashboardPage';
import { PluginTestCtx } from '../types';

export class EmptyDashboardPage extends DashboardPage {
  constructor(testCtx: PluginTestCtx, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async goto() {
    await this.testCtx.page.goto(this.testCtx.selectors.pages.AddDashboard.url, {
      waitUntil: 'networkidle',
    });
  }
}
