import { Expect, Locator } from '@playwright/test';
import { PluginTestCtx } from '../types';

/**
 * Base class for all Grafana pages.
 *
 * Exposes methods for locating Grafana specific elements on the page
 */
export abstract class GrafanaPage {
  constructor(protected readonly ctx: PluginTestCtx, protected readonly expect: Expect<any>) {}

  /**
   * Get a locator for a Grafana element by data-testid or aria-label
   * @param selector the data-testid or aria-label of the element
   * @param root optional root locator to search within. If no locator is provided, the page will be used
   */
  getByTestIdOrAriaLabel(selector: string, root?: Locator): Locator {
    if (selector.startsWith('data-testid')) {
      return (root || this.ctx.page).getByTestId(selector);
    }

    return (root || this.ctx.page).locator(`[aria-label="${selector}"]`);
  }

  /**
   * Get the locator for a Grafana CodeEditor component. Will ensure that Monaco is loaded on the page before returning
   * @param selector the data-testid or aria-label of the element
   * @param root optional root locator to search within. If no locator is provided, the page will be used
   */
  async getCodeEditor(root?: Locator): Promise<Locator> {
    await this.ctx.page.waitForFunction(() => (window as any).monaco);
    return this.getByTestIdOrAriaLabel(this.ctx.selectors.components.CodeEditor.container, root);
  }

  async mockQueryDataResponse<T = any>(json: T) {
    await this.ctx.page.route('*/**/api/ds/query*', async (route) => {
      await route.fulfill({ json });
    });
  }

  async mockResourceResponse<T = any>(path: string, json: T) {
    await this.ctx.page.route(`/api/datasources/uid/**/resources/${path}`, async (route) => {
      await route.fulfill({ json });
    });
  }
}
