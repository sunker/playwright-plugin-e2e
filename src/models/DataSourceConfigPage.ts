const gte = require('semver/functions/gte');
var randomstring = require('randomstring');
import { Expect, type APIRequestContext } from '@playwright/test';
import { DataSource, GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { createDataSource } from '../utils';

export class DataSourceConfigPage {
  datasourceJson: any;

  constructor(
    readonly grafanaPage: GrafanaPage,
    private readonly request: APIRequestContext,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {
    this.grafanaPage = grafanaPage;
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
    await this.grafanaPage.goto(url, {
      waitUntil: 'load',
    });
  }

  async saveAndTest() {
    await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.pages.DataSource.saveAndTest).click();
    await this.grafanaPage.waitForResponse((resp) => resp.url().includes('/health'));
  }

  async expectHealthCheckResultTextToContain(text: string) {
    return await this.expect(this.grafanaPage.locator('[aria-label="Data source settings page Alert"]')).toContainText(
      text
    );
  }
}
