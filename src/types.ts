import { Locator } from '@playwright/test';

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

// export interface Page extends Page {
//   getByTestIdOrAriaLabel(selector: string): Locator;
// }

export interface GrafanaLocator extends Locator {
  getByTestIdOrAriaLabel(selector: string): GrafanaLocator;
}

export type Visualization =
  | 'Alert list'
  | 'Bar gauge'
  | 'Clock'
  | 'Dashboard list'
  | 'Gauge'
  | 'Graph'
  | 'Heatmap'
  | 'Logs'
  | 'News'
  | 'Pie Chart'
  | 'Plugin list'
  | 'Polystat'
  | 'Stat'
  | 'Table'
  | 'Text'
  | 'Time series'
  | 'Worldmap Panel';

export type GotoDashboardArgs = {
  /**
   * The uid of the dashboard to go to
   */
  uid?: string;
  /**
   * The time range to set
   */
  timeRange?: TimeRangeArgs;
  /**
   * Query parameters to add to the url
   */
  queryParams?: URLSearchParams;
};

export type ImportDashboardArgs = {
  /**
   * The path, relative to project root, to the dashboard json file
   */
  filePath: string;
};

export type ReadProvisionArgs = {
  /**
   * The path, relative to the provisioning folder, to the dashboard json file
   */
  filePath: string;
};

export type LoginArgs = {
  /**
   * The username to login with
   */
  username: string;
  /**
   * The password to login with
   */
  password: string;
};

export interface TimeRangeArgs {
  /**
   * The from time
   * @example 'now-6h'
   * @example '2020-01-01 00:00:00'
   */
  from: string;
  /**
   * The to time
   * @example 'now'
   * @example '2020-01-01 00:00:00'
   */
  to: string;
  /**
   * The time zone
   * @example 'utc'
   * @example 'browser'
   */
  zone?: string;
}
