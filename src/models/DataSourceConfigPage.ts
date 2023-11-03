const gte = require('semver/functions/gte');
var randomstring = require('randomstring');
import { Expect, type APIRequestContext, Page } from '@playwright/test';
import { DataSource } from '../types';
import { Selectors } from '../selectors/types';
import { createDataSource } from '../utils';
import { GrafanaPage } from './GrafanaPage';

export class DataSourceConfigPage extends GrafanaPage {
  datasourceJson: any;

  constructor(
    page: Page,
    selectors: Selectors,
    grafanaVersion: string,
    expect: Expect<any>,
    private readonly request: APIRequestContext
  ) {
    super(page, selectors, grafanaVersion, expect);
  }

  async createDataSource(type: string, name?: string) {
    this.datasourceJson = await createDataSource(this.request, {
      type,
      name: name ?? `${type}-${randomstring.generate()}`,
    } as DataSource);
    await this.goto();
  }

  async deleteDataSource() {
    if (this.datasourceJson) {
      await this.request.delete(`/api/datasources/uid/${this.datasourceJson.uid}`);
    }
  }

  async goto() {
    const url = `${gte(this.grafanaVersion, '10.2.0') ? '/connections' : ''}/datasources/edit/${
      this.datasourceJson.uid
    }`;
    await this.page.goto(url, {
      waitUntil: 'load',
    });
  }

  async saveAndTest() {
    await this.getByTestIdOrAriaLabel(this.selectors.pages.DataSource.saveAndTest).click();
    await this.page.waitForResponse((resp) => resp.url().includes('/health'));
  }

  async expectHealthCheckResultTextToContain(text: string) {
    return await this.expect(this.page.locator('[aria-label="Data source settings page Alert"]')).toContainText(text);
  }
}
