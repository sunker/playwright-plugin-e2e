import { PlaywrightTestArgs } from '@playwright/test';
import { DataSourceConfigPage } from './models/DataSourceConfigPage';
import { EmptyDashboardPage } from './models/EmptyDashboardPage';
import { VariableEditPage } from './models/VariableEditPage';
import { DashboardPage } from './models/DashboardPage';
import { AnnotationEditPage } from './models/AnnotationEditPage';
import { EditPanelPage } from './models/EditPanelPage';
import { ImportDashboardArgs, GotoDashboardArgs, LoginArgs, DataSource, CreateDataSourceArgs } from './types';
import { ExplorePage } from './models/ExplorePage';
import { Selectors } from './selectors/types';

export type PluginOptions = {
  defaultCredentials?: { user: string; password: string };
  selectorRegistration: void;
};

export type PluginFixture = {
  grafanaVersion: string;
  selectors: Selectors;
  // fixtures resolving page object models
  dataSourceConfigPage: DataSourceConfigPage;
  emptyDashboardPage: EmptyDashboardPage;
  variableEditPage: VariableEditPage;
  annotationEditPage: AnnotationEditPage;
  emptyEditPanelPage: EditPanelPage;
  explorePage: ExplorePage;
  // command fixtures
  login: (args?: LoginArgs) => Promise<void>;
  createDataSource: (args: CreateDataSourceArgs) => Promise<DataSource>;
  importDashboard: (args: ImportDashboardArgs) => Promise<DashboardPage>;
  gotoDashboard: (args: GotoDashboardArgs) => Promise<DashboardPage>;
  readProvision<T = any>(args: ImportDashboardArgs): Promise<T>;
};

export type PluginTestArgs = PluginFixture & PluginOptions & PlaywrightTestArgs;
