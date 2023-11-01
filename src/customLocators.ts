import { Locator, Page } from '@playwright/test';

export const getCustomLocators = (root: Page | Locator) => {
  return {
    getByTestIdOrAriaLabel(selector: string): Locator {
      if (selector.startsWith('data-testid')) {
        return root.getByTestId(selector);
      }

      return root.locator(`[aria-label="${selector}"]`);
    },
  };
};
