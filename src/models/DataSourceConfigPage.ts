const gte = require('semver/functions/gte');
import { Expect, type APIRequestContext } from '@playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
var randomstring = require('randomstring');

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
    const dsName = name ?? `${type}-${randomstring.generate()}`;
    const createDsReq = await this.request.post('/api/datasources', {
      data: {
        name: dsName,
        type: type,
        access: 'proxy',
        isDefault: false,
      },
    });
    this.expect(createDsReq.ok()).toBeTruthy();

    // load ds by name
    const getDsReq = await this.request.get(`/api/datasources/name/${name}`);
    this.expect(getDsReq.ok()).toBeTruthy();
    this.datasourceJson = await getDsReq.json();
    await this.goto();
  }

  async deleteDataSource() {
    if (this.datasourceJson) {
      await this.request.delete(`/api/datasources/uid/${this.datasourceJson.uid}`);
    }
  }

  async goto() {
    const url = `${gte(this.grafanaVersion, '10.2.0') ? '/connections' : ''} /datasources/edit/${
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
