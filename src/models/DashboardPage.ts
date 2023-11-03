const gte = require('semver/functions/gte');

import { Expect, type APIRequestContext, Page } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { GotoDashboardArgs } from '../types';
import { DataSourcePicker } from './DataSourcePicker';
import { EditPanelPage } from './EditPanelPage';
import { VariablePage } from './VariablePage';
import { TimeRange } from './TimeRange';
import { GrafanaPage } from './GrafanaPage';

export class DashboardPage extends GrafanaPage {
  dataSourcePicker: any;
  timeRange: TimeRange;

  constructor(
    page: Page,
    selectors: Selectors,
    grafanaVersion: string,
    expect: Expect<any>,
    private readonly request: APIRequestContext,
    protected readonly dashboardUid?: string
  ) {
    super(page, selectors, grafanaVersion, expect);
    this.dataSourcePicker = new DataSourcePicker(this.page, this.selectors, this.grafanaVersion, expect);
    this.timeRange = new TimeRange(this.page, this.selectors, this.grafanaVersion, this.expect);
  }

  async goto(opts?: GotoDashboardArgs) {
    let url = this.selectors.pages.Dashboard.url(opts?.uid ?? this.dashboardUid ?? '');
    if (opts?.queryParams) {
      url += `?${opts.queryParams.toString()}`;
    }
    await this.page.goto(url, {
      waitUntil: 'networkidle',
    });
    if (opts?.timeRange) {
      await this.timeRange.set(opts.timeRange);
    }
  }

  async gotoEditPanelPage(panelId: string) {
    const url = this.selectors.pages.Dashboard.url(this.dashboardUid ?? '');
    await this.page.goto(`${url}?editPanel=${panelId}`, {
      waitUntil: 'networkidle',
    });
    return new EditPanelPage(this.page, this.selectors, this.grafanaVersion, this.expect);
  }

  async gotoAddVariablePage() {
    const { components } = this.selectors;
    await this.getByTestIdOrAriaLabel('Dashboard settings').click();
    await this.getByTestIdOrAriaLabel(components.Tab.title('Variables')).click();

    return new VariablePage(this.page, this.selectors, this.grafanaVersion, this.expect);
  }

  async addPanel(): Promise<EditPanelPage> {
    if (gte(this.grafanaVersion, '10.0.0')) {
      const title = gte(this.grafanaVersion, '10.1.0') ? 'Add button' : 'Add panel button';
      await this.getByTestIdOrAriaLabel(this.selectors.components.PageToolbar.itemButton(title)).click();
      await this.getByTestIdOrAriaLabel(
        this.selectors.pages.AddDashboard.itemButton('Add new visualization menu item')
      ).click();
    } else {
      await this.getByTestIdOrAriaLabel(this.selectors.pages.AddDashboard.addNewPanel).click();
    }

    return new EditPanelPage(this.page, this.selectors, this.grafanaVersion, this.expect);
  }

  async deleteDashboard() {
    await this.request.delete(`/api/datasources/uid/${this.dashboardUid}`);
  }

  async refreshDashboard() {
    await this.page.getByTestId(this.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
