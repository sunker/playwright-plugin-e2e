import { expect, type Page, type APIRequestContext } from '@playwright/test';
var randomstring = require('randomstring');

export class DataSourceConfigPage {
  datasourceJson: any;

  constructor(
    private readonly page: Page,
    private readonly request: APIRequestContext
  ) {
    this.page = page;
  }

  async createDataSource(type: string) {
    try {
      const name = `${type}-${randomstring.generate()}`;
      const createDsReq = await this.request.post('/api/datasources', {
        data: {
          name,
          type: type,
          access: 'proxy',
          isDefault: false,
        },
      });
      expect(createDsReq.ok()).toBeTruthy();

      // load ds by name
      const getDsReq = await this.request.get(`/api/datasources/name/${name}`);
      expect(getDsReq.ok()).toBeTruthy();
      this.datasourceJson = await getDsReq.json();
    } catch (error) {
      console.log;
    }
  }

  async deleteDataSource() {
    this.datasourceJson = await this.request.delete(
      `/api/datasources/uid/${this.datasourceJson.uid}`
    );
  }

  async goto() {
    await this.page.goto(
      `/connections/datasources/edit/${this.datasourceJson.uid}`,
      {
        waitUntil: 'networkidle',
      }
    );
  }

  async get() {
    await this.page.locator('[aria-label="Secret Access Key"]').fill('hejsan');
  }

  async saveAndTest() {
    await this.page
      .getByTestId('data-testid Data source settings page Save and Test button')
      .click();
    await this.page.waitForResponse((resp) => resp.url().includes('/health'));
  }

  async expectHealthCheckResultTextToContain(text: string) {
    return await expect(
      this.page.locator('[aria-label="Data source settings page Alert"]')
    ).toContainText(text);
  }
}
