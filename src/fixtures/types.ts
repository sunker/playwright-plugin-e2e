import { DataSourceConfigPage } from '../models/DataSourceConfigPage';
import { EmptyDashboardPage } from '../models/EmptyDashboardPage';
import { VariableEditPage } from '../models/VariableEditPage';
import { DashboardPage } from '../models/DashboardPage';
import { AnnotationEditPage } from '../models/AnnotationEditPage';
import { EditPanelPage } from '../models/EditPanelPage';
import { ImportDashboardArgs, GotoDashboardArgs, LoginArgs } from '../types';
import { ExplorePage } from '../models/ExplorePage';
import { Selectors } from '../selectors/types';

export type PluginOptions = {
  defaultCredentials?: { user: string; password: string };
  selectorRegistration: void;
};

export type PluginFixture = {
  // Page objects
  dataSourceConfigPage: DataSourceConfigPage;
  grafanaVersion: string;
  selectors: Selectors;
  emptyDashboardPage: EmptyDashboardPage;
  variableEditPage: VariableEditPage;
  annotationEditPage: AnnotationEditPage;
  emptyEditPanelPage: EditPanelPage;
  selectorRegistration: any;
  explorePage: ExplorePage;
  // Commands
  login: (args?: LoginArgs) => Promise<void>;
  importDashboard: (args: ImportDashboardArgs) => Promise<DashboardPage>;
  gotoDashboard: (args: GotoDashboardArgs) => Promise<DashboardPage>;
  readProvision<T = any>(args: ImportDashboardArgs): Promise<T>;
};
