import { Expect } from '@playwright/test';
import { DataSourcePicker } from './DataSourcePicker';

import { GrafanaPage } from './GrafanaPage';
import { PluginTestArgs } from '../types';

export type VariableType = 'Query' | 'Constant' | 'Custom';

export class AnnotationEditPage extends GrafanaPage {
  datasource: DataSourcePicker;
  constructor(testCtx: PluginTestArgs, expect: Expect<any>) {
    super(testCtx, expect);
    this.datasource = new DataSourcePicker(testCtx, expect);
  }

  async runQuery() {
    await this.testCtx.page.getByRole('button', { name: 'TEST' }).click();
  }

  async expectRunQueryResultToContainText(text: string) {
    await this.expect(this.testCtx.page.getByText(text)).toBeVisible();
  }
}
