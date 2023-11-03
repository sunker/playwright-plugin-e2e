import { Expect } from '@playwright/test';
import { Selectors } from 'src/selectors/types';
import { GrafanaPage } from 'src/types';

export interface TimeRangeConfig {
  from: string;
  to: string;
  zone?: string;
}

export class TimeRange {
  constructor(
    private readonly grafanaPage: GrafanaPage,
    private readonly selectors: Selectors,
    // @ts-ignore
    private readonly grafanaVersion: string,
    private readonly expect: Expect<any>
  ) {}

  async set({ from, to, zone }: TimeRangeConfig) {
    // await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.openButton).click();
    //TODO: investigate why above doesn't work
    await this.grafanaPage.locator('[aria-controls="TimePickerContent"]').click();

    if (zone) {
      await this.grafanaPage.getByRole('button', { name: 'Change time settings' }).click();
      await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.TimeZonePicker.containerV2).fill(zone);
    }
    await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.absoluteTimeRangeTitle).click();
    const fromField = await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.fromField);
    await fromField.clear();
    await fromField.fill(from);
    const toField = await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.toField);
    await toField.clear();
    await toField.fill(to);
    await this.grafanaPage.getByTestIdOrAriaLabel(this.selectors.components.TimePicker.applyTimeRange).click();

    await this.expect
      .soft(this.grafanaPage.getByText(from), 'Could not set "from" in dashboard time range picker')
      .toBeVisible();
    await this.expect
      .soft(this.grafanaPage.getByText(to), 'Could not set "to" in dashboard time range picker')
      .toBeVisible();
  }
}
