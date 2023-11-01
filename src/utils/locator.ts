import { Locator } from '@playwright/test';
import { getCustomLocators } from '../customLocators';
import { GrafanaLocator } from '../types';

export const attachCustomLocators = (locator: Locator): GrafanaLocator => {
  const customLocators = getCustomLocators(locator);
  const grafanaLocator = Object.assign(locator, customLocators) as GrafanaLocator;
  return grafanaLocator;
};
