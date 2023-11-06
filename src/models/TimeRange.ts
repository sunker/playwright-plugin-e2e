import { Expect } from '@playwright/test';
import { TimeRangeArgs } from '../types';
import { GrafanaPage } from './GrafanaPage';
import { PluginTestCtx } from '../types';

export class TimeRange extends GrafanaPage {
  constructor(testCtx: PluginTestCtx, expect: Expect<any>) {
    super(testCtx, expect);
  }

  async set({ from, to, zone }: TimeRangeArgs) {
    // await this.getByTestIdOrAriaLabel(this.test.selectors.components.TimePicker.openButton).click();
    //TODO: investigate why above doesn't work
    await this.testCtx.page.locator('[aria-controls="TimePickerContent"]').click();

    if (zone) {
      await this.testCtx.page.getByRole('button', { name: 'Change time settings' }).click();
      await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.TimeZonePicker.containerV2).fill(zone);
    }
    await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.TimePicker.absoluteTimeRangeTitle).click();
    const fromField = await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.TimePicker.fromField);
    await fromField.clear();
    await fromField.fill(from);
    const toField = await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.TimePicker.toField);
    await toField.clear();
    await toField.fill(to);
    await this.getByTestIdOrAriaLabel(this.testCtx.selectors.components.TimePicker.applyTimeRange).click();

    await this.expect
      .soft(this.testCtx.page.getByText(from), 'Could not set "from" in dashboard time range picker')
      .toBeVisible();
    await this.expect
      .soft(this.testCtx.page.getByText(to), 'Could not set "to" in dashboard time range picker')
      .toBeVisible();
  }
}
