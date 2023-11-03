const gte = require('semver/functions/gte');

import { Expect, type APIRequestContext } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { GrafanaPage } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { EditPanelPage } from './EditPanelPage';
import { VariablePage } from './VariablePage';
import { TimeRange } from './TimeRange';
import { GotoDashboardArgs } from '../fixtures/commands/types';

export class DashboardPage {
  dataSourcePicker: any;
  timeRange: TimeRange;

  constructor(
    protected readonly grafanaPage: GrafanaPage,
    protected readonly request: APIRequestContext,
    protected readonly selectors: Selectors,
    protected readonly grafanaVersion: string,
    protected readonly expect: Expect<any>,
    protected readonly dashboardUid?: string
  ) {
    this.dataSourcePicker = new DataSourcePicker(this.grafanaPage, this.selectors, this.grafanaVersion);
    this.timeRange = new TimeRange(this.grafanaPage, this.selectors, this.grafanaVersion, this.expect);
  }

  async goto(opts?: GotoDashboardArgs) {
    let url = this.selectors.pages.Dashboard.url(opts?.uid ?? this.dashboardUid ?? '');
    if (opts?.queryParams) {
      url += `?${opts.queryParams.toString()}`;
    }
    await this.grafanaPage.goto(url, {
      waitUntil: 'networkidle',
    });
    if (opts?.timeRange) {
      await this.timeRange.set(opts.timeRange);
    }
  }

  // async import(path: string) {
  //   // todo: shold be async
  //   let rawdata = fs.readFileSync(path);
  //   const dashboard = JSON.parse(rawdata.toString());
  //   const importDashboardReq = await this.request.post('/api/dashboards/import', {
  //     data: {
  //       dashboard,
  //       overwrite: true,
  //       inputs: [],
  //       folderId: 0,
  //     },
  //   });
  //   this.expect(importDashboardReq.ok()).toBeTruthy();
  //   this.dashboardJson = await importDashboardReq.json();
  // }

  async gotoEditPanelPage(panelId: string) {
    const url = this.selectors.pages.Dashboard.url(this.dashboardUid ?? '');
    await this.grafanaPage.goto(`${url}?editPanel=${panelId}`, {
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
    await this.request.delete(`/api/datasources/uid/${this.dashboardUid}`);
  }

  async refreshDashboard() {
    await this.grafanaPage.getByTestId(this.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
