import { Expect, Locator } from '@playwright/test';
import { PluginTestCtx } from '../types';

export abstract class GrafanaPage {
  constructor(protected readonly ctx: PluginTestCtx, protected readonly expect: Expect<any>) {}

  async goto() {
    await this.ctx.page.goto('/', {
      waitUntil: 'networkidle',
    });
  }

  getByTestIdOrAriaLabel(selector: string): Locator {
    if (selector.startsWith('data-testid')) {
      return this.ctx.page.getByTestId(selector);
    }

    return this.ctx.page.locator(`[aria-label="${selector}"]`);
  }
}
