import { Expect, Page } from '@playwright/test';
import { Selectors } from '../selectors/types';
import { TimeRangeArgs } from '../types';
import { GrafanaPage } from './GrafanaPage';

export class TimeRange extends GrafanaPage {
  constructor(page: Page, selectors: Selectors, grafanaVersion: string, expect: Expect<any>) {
    super(page, selectors, grafanaVersion, expect);
  }

  async set({ from, to, zone }: TimeRangeArgs) {
    // await this.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.openButton).click();
    //TODO: investigate why above doesn't work
    await this.page.locator('[aria-controls="TimePickerContent"]').click();

    if (zone) {
      await this.page.getByRole('button', { name: 'Change time settings' }).click();
      await this.getByTestIdOrAriaLabel(this.selectors.components.TimeZonePicker.containerV2).fill(zone);
    }
    await this.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.absoluteTimeRangeTitle).click();
    const fromField = await this.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.fromField);
    await fromField.clear();
    await fromField.fill(from);
    const toField = await this.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.toField);
    await toField.clear();
    await toField.fill(to);
    await this.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.applyTimeRange).click();

    await this.expect
      .soft(this.page.getByText(from), 'Could not set "from" in dashboard time range picker')
      .toBeVisible();
    await this.expect.soft(this.page.getByText(to), 'Could not set "to" in dashboard time range picker').toBeVisible();
  }
}
