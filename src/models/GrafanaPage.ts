import { Expect, Locator, Page } from '@playwright/test';
import { Selectors } from '../selectors/types';

export abstract class GrafanaPage {
  constructor(
    protected readonly page: Page,
    protected readonly selectors: Selectors,
    protected readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {}

  async goto() {
    await this.page.goto('/', {
      waitUntil: 'networkidle',
    });
  }

  getByTestIdOrAriaLabel(selector: string): Locator {
    if (selector.startsWith('data-testid')) {
      return this.page.getByTestId(selector);
    }

    return this.page.locator(`[aria-label="${selector}"]`);
  }
}
