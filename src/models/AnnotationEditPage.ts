import { Expect } from '@playwright/test';
import { DataSourcePicker } from './DataSourcePicker';

import { PluginTestCtx } from '../types';
import { GrafanaPage } from './GrafanaPage';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class AnnotationEditPage extends GrafanaPage {
  datasource: DataSourcePicker;
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
    this.datasource = new DataSourcePicker(ctx, expect);
  }

  async runQuery() {
    await this.ctx.page.getByRole('button', { name: 'TEST' }).click();
  }

  async expectRunQueryResultToContainText(text: string) {
    await this.expect(this.ctx.page.getByText(text)).toBeVisible();
  }
}
