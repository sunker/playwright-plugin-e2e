import { Locator } from '@playwright/test';
import { GrafanaLocator } from '../types';

const getCustomLocators = (locator: Locator) => {
  return {
    getByTestIdOrAriaLabel(selector: string): Locator {
      if (selector.startsWith('data-testid')) {
        return locator.getByTestId(selector);
      }

      return locator.locator(`[aria-label="${selector}"]`);
    },
  };
};

export const attachCustomLocators = (locator: Locator): GrafanaLocator => {
  const customLocators = getCustomLocators(locator);
  const grafanaLocator = Object.assign(locator, customLocators) as GrafanaLocator;
  return grafanaLocator;
};
