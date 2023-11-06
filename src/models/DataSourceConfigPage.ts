const gte = require('semver/functions/gte');
import { Expect } from '@playwright/test';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';
import { createDataSourceViaAPI } from 'src/commands/createDataSource';

export class DataSourceConfigPage extends GrafanaPage {
  datasourceJson: any;

  constructor(testCtx: PluginTestCtx, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async createDataSource(type: string, name?: string) {
    await createDataSourceViaAPI(this.testCtx.request, { type, name });
    await this.goto();
  }

  async deleteDataSource() {
    if (this.datasourceJson) {
      await this.testCtx.request.delete(`/api/datasources/uid/${this.datasourceJson.uid}`);
    }
  }

  async goto() {
    const url = `${gte(this.testCtx.grafanaVersion, '10.2.0') ? '/connections' : ''}/datasources/edit/${
      this.datasourceJson.uid
    }`;
    await this.testCtx.page.goto(url, {
      waitUntil: 'load',
    });
  }

  async saveAndTest() {
    await this.getByTestIdOrAriaLabel(this.testCtx.selectors.pages.DataSource.saveAndTest).click();
    await this.testCtx.page.waitForResponse((resp) => resp.url().includes('/health'));
  }

  async expectHealthCheckResultTextToContain(text: string) {
    return await this.expect(this.testCtx.page.locator('[aria-label="Data source settings page Alert"]')).toContainText(
      text
    );
  }
}
