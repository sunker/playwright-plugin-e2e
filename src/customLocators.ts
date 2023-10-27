import { Locator, Page } from '@playwright/test';

export const getCustomLocators = (page: Page) => {
  return {
    getByTestIdOrAriaLabel(selector: string): Locator {
      if (selector.startsWith('data-testid')) {
        return page.getByTestId(selector);
      }

      return page.locator(`[aria-label="${selector}"]`);
    },
  };
};
