const gte = require('semver/functions/gte');

import { Expect } from '@playwright/test';
import { GotoDashboardArgs } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { EditPanelPage } from './EditPanelPage';
import { VariablePage } from './VariablePage';
import { TimeRange } from './TimeRange';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';

export class DashboardPage extends GrafanaPage {
  dataSourcePicker: any;
  timeRange: TimeRange;

  constructor(testCtx: PluginTestCtx, expect: Expect<any>, protected readonly dashboardUid?: string) {
    super(testCtx, expect);
    this.dataSourcePicker = new DataSourcePicker(testCtx, expect);
    this.timeRange = new TimeRange(testCtx, this.expect);
  }

  async goto(opts?: GotoDashboardArgs) {
    let url = this.testCtx.selectors.pages.Dashboard.url(opts?.uid ?? this.dashboardUid ?? '');
    if (opts?.queryParams) {
      url += `?${opts.queryParams.toString()}`;
    }
    await this.testCtx.page.goto(url, {
      waitUntil: 'networkidle',
    });
    if (opts?.timeRange) {
      await this.timeRange.set(opts.timeRange);
    }
  }

  async gotoEditPanelPage(panelId: string) {
    const url = this.testCtx.selectors.pages.Dashboard.url(this.dashboardUid ?? '');
    await this.testCtx.page.goto(`${url}?editPanel=${panelId}`, {
      waitUntil: 'networkidle',
    });
    return new EditPanelPage(this.testCtx, this.expect);
  }

  async gotoAddVariablePage() {
    const { components } = this.testCtx.selectors;
    await this.getByTestIdOrAriaLabel('Dashboard settings').click();
    await this.getByTestIdOrAriaLabel(components.Tab.title('Variables')).click();

    return new VariablePage(this.testCtx, this.expect);
  }

  async addPanel(): Promise<EditPanelPage> {
    if (gte(this.testCtx.grafanaVersion, '10.0.0')) {
      const title = gte(this.testCtx.grafanaVersion, '10.1.0') ? 'Add button' : 'Add panel button';
      await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.PageToolbar.itemButton(title)).click();
      await this.getByTestIdOrAriaLabel(
        this.testCtx.selectors.pages.AddDashboard.itemButton('Add new visualization menu item')
      ).click();
    } else {
      await this.getByTestIdOrAriaLabel(this.testCtx.selectors.pages.AddDashboard.addNewPanel).click();
    }

    return new EditPanelPage(this.testCtx, this.expect);
  }

  async deleteDashboard() {
    await this.testCtx.request.delete(`/api/datasources/uid/${this.dashboardUid}`);
  }

  async refreshDashboard() {
    await this.testCtx.page.getByTestId(this.testCtx.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
