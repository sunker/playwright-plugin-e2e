import { Expect, Locator } from '@playwright/test';
import { PluginTestCtx } from '../types';

export abstract class GrafanaPage {
  constructor(protected readonly testCtx: PluginTestCtx, protected readonly expect: Expect<any>) {}

  async goto() {
    await this.testCtx.page.goto('/', {
      waitUntil: 'networkidle',
    });
  }

  getByTestIdOrAriaLabel(selector: string): Locator {
    if (selector.startsWith('data-testid')) {
      return this.testCtx.page.getByTestId(selector);
    }

    return this.testCtx.page.locator(`[aria-label="${selector}"]`);
  }
}
