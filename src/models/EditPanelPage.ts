const gte = require('semver/functions/gte');
import { Locator } from 'playwright/test';
import { GrafanaPage } from '../types';
import { Selectors } from '../selectors/types';
import { Expect } from '@playwright/test';

export class EditPanelPage {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    private readonly grafanaVersion: string,
    protected readonly expect: Expect<any>
  ) {}

  async apply() {
    await this.grafanaPage.getByTestId(this.selectors.components.PanelEditor.applyButton).click();
  }

  async getQueryEditorEditorRow(refId: string): Promise<Locator> {
    const elem = await this.grafanaPage.locator('[aria-label="Query editor row"]').filter({
      has: this.grafanaPage.locator(`[aria-label="Query editor row title ${refId}"]`),
    });
    this.expect(elem).toBeVisible();
    const t = await elem.innerHTML();
    console.log(t);
    return elem;
  }

  async refreshDashboard(waitForQueryRequest: boolean = false) {
    await this.grafanaPage.getByTestId(this.selectors.components.RefreshPicker.runButtonV2).click();
    if (waitForQueryRequest) {
      await this.grafanaPage.waitForResponse((resp) => resp.url().includes('/query'));
    }
  }

  async expectTableToContainText(text: string) {
    const locator = gte(this.grafanaVersion, '10.2.0')
      ? this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.Panels.Visualization.Table.body)
      : this.grafanaPage.locator('div[role="table"]');
    return await this.expect(locator).toContainText(text);
  }
}