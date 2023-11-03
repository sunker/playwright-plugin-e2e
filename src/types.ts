import { Locator, Page } from '@playwright/test';
import { TimeRangeConfig } from './models/TimeRange';

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
