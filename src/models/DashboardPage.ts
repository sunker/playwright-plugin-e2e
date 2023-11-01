const gte = require('semver/functions/gte');
import fs from 'fs';

import { Expect, type APIRequestContext } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { GrafanaPage } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { EditPanelPage } from './EditPanelPage';
import { VariablePage } from './VariablePage';
import { TimeRange } from './TimeRange';

export class DashboardPage {
  dashboardJson: any;
  dataSourcePicker: any;
  timeRange: TimeRange;

  constructor(
    protected readonly grafanaPage: GrafanaPage,
    protected readonly request: APIRequestContext,
    protected readonly selectors: Selectors,
    protected readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {
    this.dataSourcePicker = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
    this.timeRange = new TimeRange(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async goto() {
    await this.grafanaPage.goto(this.dashboardJson?.importedUrl, {
      waitUntil: 'networkidle',
    });
  }

  async import(path: string) {
    // todo: shold be async
    let rawdata = fs.readFileSync(path);
    const dashboard = JSON.parse(rawdata.toString());
    const importDashboardReq = await this.request.post('/api/dashboards/import', {
      data: {
        dashboard,
        overwrite: true,
        inputs: [],
        folderId: 0,
      },
    });
    this.expect(importDashboardReq.ok()).toBeTruthy();
    this.dashboardJson = await importDashboardReq.json();
  }

  async gotoEditPanelPage(panelId: string) {
    await this.grafanaPage.goto(`${this.dashboardJson.importedUrl}?editPanel=${panelId}`, {
      waitUntil: 'networkidle',
    });
    return new EditPanelPage(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async gotoAddVariablePage() {
    const { components } = this.selectors;
    await this.grafanaPage.getByTestIdOrAriaLabel('Dashboard settings').click();
    await this.grafanaPage.getByTestIdOrAriaLabel(components.Tab.title('Variables')).click();

    return new VariablePage(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async addPanel(): Promise<EditPanelPage> {
    if (gte(this.grafanaVersion, '10.0.0')) {
      const title = gte(this.grafanaVersion, '10.1.0') ? 'Add button' : 'Add panel button';
      await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.PageToolbar.itemButton(title)).click();
      await this.grafanaPage
        .getByTestIdOrAriaLabel(this.selectors.pages.AddDashboard.itemButton('Add new visualization menu item'))
        .click();
    } else {
      await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.pages.AddDashboard.addNewPanel).click();
    }

    return new EditPanelPage(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async deleteDashboard() {
    await this.request.delete(`/api/datasources/uid/${this.dashboardJson.uid}`);
  }

  async refreshDashboard() {
    await this.grafanaPage.getByTestId(this.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
