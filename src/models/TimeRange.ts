import { Expect } from '@playwright/test';
import { PluginTestCtx, TimeRangeArgs } from '../types';
import { GrafanaPage } from './GrafanaPage';

export class TimeRange extends GrafanaPage {
  constructor(ctx: PluginTestCtx, expect: Expect<any>) {
    super(ctx, expect);
  }

  async set({ from, to, zone }: TimeRangeArgs) {
    // await this.getByTestIdOrAriaLabel(this.test.selectors.components.TimePicker.openButton).click();
    //TODO: investigate why above doesn't work
    await this.ctx.page.locator('[aria-controls="TimePickerContent"]').click();

    if (zone) {
      await this.ctx.page.getByRole('button', { name: 'Change time settings' }).click();
      await this.getByTestIdOrAriaLabel(this.ctx.selectors.components.TimeZonePicker.containerV2).fill(zone);
    }
    await this.getByTestIdOrAriaLabel(this.ctx.selectors.components.TimePicker.absoluteTimeRangeTitle).click();
    const fromField = await this.getByTestIdOrAriaLabel(this.ctx.selectors.components.TimePicker.fromField);
    await fromField.clear();
    await fromField.fill(from);
    const toField = await this.getByTestIdOrAriaLabel(this.ctx.selectors.components.TimePicker.toField);
    await toField.clear();
    await toField.fill(to);
    await this.getByTestIdOrAriaLabel(this.ctx.selectors.components.TimePicker.applyTimeRange).click();

    await this.expect
      .soft(this.ctx.page.getByText(from), 'Could not set "from" in dashboard time range picker')
      .toBeVisible();
    await this.expect
      .soft(this.ctx.page.getByText(to), 'Could not set "to" in dashboard time range picker')
      .toBeVisible();
  }
}
