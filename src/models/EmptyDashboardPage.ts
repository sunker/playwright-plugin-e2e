import { Expect } from '@playwright/test';
import { DashboardPage } from './DashboardPage';
import { PluginTestCtx } from '../types';

export class EmptyDashboardPage extends DashboardPage {
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async goto() {
    await this.ctx.page.goto(this.ctx.selectors.pages.AddDashboard.url, {
      waitUntil: 'networkidle',
    });
  }
}
