const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { createDataSourceViaAPI } from '../fixtures/commands/createDataSource';
import { DataSource, PluginTestCtx } from '../types';
import { GrafanaPage } from './GrafanaPage';

export class DataSourceConfigPage extends GrafanaPage {
  datasourceJson: DataSource | undefined;

  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async createDataSource(type: string, name?: string) {
    this.datasourceJson = await createDataSourceViaAPI(this.ctx.request, { type, name });
    await this.goto();
  }

  async deleteDataSource() {
    if (this.datasourceJson) {
      await this.ctx.request.delete(`/api/datasources/uid/${this.datasourceJson.uid}`);
    }
  }

  async goto() {
    if (!this.datasourceJson) {
      throw new Error('Datasource not created');
    }
    const url = `${gte(this.ctx.grafanaVersion, '10.2.0') ? '/connections' : ''}/datasources/edit/${
      this.datasourceJson.uid
    }`;
    await this.ctx.page.goto(url, {
      waitUntil: 'load',
    });
  }

  async saveAndTest() {
    await this.getByTestIdOrAriaLabel(this.ctx.selectors.pages.DataSource.saveAndTest).click();
    await this.ctx.page.waitForResponse((resp) => resp.url().includes('/health'));
  }

  async expectHealthCheckResultTextToContain(text: string) {
    return await this.expect(this.ctx.page.locator('[aria-label="Data source settings page Alert"]')).toContainText(
      text
    );
  }
}
