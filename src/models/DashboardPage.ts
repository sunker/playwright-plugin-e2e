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

  constructor(ctx: PluginTestCtx, expect: Expect<any>, protected readonly dashboardUid?: string) {
    super(ctx, expect);
    this.dataSourcePicker = new DataSourcePicker(ctx, expect);
    this.timeRange = new TimeRange(ctx, this.expect);
  }

  async goto(opts?: GotoDashboardArgs) {
    let url = this.ctx.selectors.pages.Dashboard.url(opts?.uid ?? this.dashboardUid ?? '');
    if (opts?.queryParams) {
      url += `?${opts.queryParams.toString()}`;
    }
    await this.ctx.page.goto(url, {
      waitUntil: 'networkidle',
    });
    if (opts?.timeRange) {
      await this.timeRange.set(opts.timeRange);
    }
  }

  async gotoEditPanelPage(panelId: string) {
    const url = this.ctx.selectors.pages.Dashboard.url(this.dashboardUid ?? '');
    await this.ctx.page.goto(`${url}?editPanel=${panelId}`, {
      waitUntil: 'networkidle',
    });
    return new EditPanelPage(this.ctx, this.expect);
  }

  async gotoAddVariablePage() {
    const { components } = this.ctx.selectors;
    await this.getByTestIdOrAriaLabel('Dashboard settings').click();
    await this.getByTestIdOrAriaLabel(components.Tab.title('Variables')).click();

    return new VariablePage(this.ctx, this.expect);
  }

  async addPanel(): Promise<EditPanelPage> {
    if (gte(this.ctx.grafanaVersion, '10.0.0')) {
      const title = gte(this.ctx.grafanaVersion, '10.1.0') ? 'Add button' : 'Add panel button';
      await this.getByTestIdOrAriaLabel(this.ctx.selectors.components.PageToolbar.itemButton(title)).click();
      await this.getByTestIdOrAriaLabel(
        this.ctx.selectors.pages.AddDashboard.itemButton('Add new visualization menu item')
      ).click();
    } else {
      await this.getByTestIdOrAriaLabel(this.ctx.selectors.pages.AddDashboard.addNewPanel).click();
    }

    return new EditPanelPage(this.ctx, this.expect);
  }

  async deleteDashboard() {
    await this.ctx.request.delete(`/api/datasources/uid/${this.dashboardUid}`);
  }

  async refreshDashboard() {
    await this.ctx.page.getByTestId(this.ctx.selectors.components.RefreshPicker.runButtonV2).click();
  }
}
