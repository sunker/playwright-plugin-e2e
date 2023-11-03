import {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from '@playwright/test';
import { TimeRangeConfig } from '../../models/TimeRange';

export type PlaywrightCombinedArgs = PlaywrightTestArgs &
  PlaywrightTestOptions &
  PlaywrightWorkerArgs &
  PlaywrightWorkerOptions;

export type GotoDashboardArgs = {
  /**
   * The uid of the dashboard to go to
   */
  uid?: string;
  /**
   * The time range to set
   */
  timeRange?: TimeRangeConfig;
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
