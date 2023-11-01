import { Locator, Page } from '@playwright/test';

export interface DataSource {
  id: number;
  uid: string;
  orgId?: number;
  name: string;
  type: string;
  access: string;
  url: string;
  database: string;
  isDefault: boolean;
  jsonData: any;
  secureJsonData: any;
}

export interface GrafanaPage extends Page {
  getByTestIdOrAriaLabel(selector: string): Locator;
}

export interface GrafanaLocator extends Locator {
  getByTestIdOrAriaLabel(selector: string): GrafanaLocator;
}
