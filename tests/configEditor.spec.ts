import { test } from '../src/fixtures/pluginFixture';

test('configuration is valid', async ({ dataSourceConfigPage, page }) => {
  await dataSourceConfigPage.createDataSource('prometheus');
  await dataSourceConfigPage.goto();
  await page
    .locator('[aria-label="Data source connection URL"]')
    .fill('http://localhost:9090');
  await page
    .locator('input[id^=react-select-]')
    .first()
    .fill('Basic authentication');
  await page.keyboard.press('Enter');
  await page.locator('id=basic-auth-user-input').fill('admin');
  await page.locator('id=basic-auth-password-input').fill('admin');
  await dataSourceConfigPage.saveAndTest();
  await dataSourceConfigPage.expectHealthCheckResultTextToContain(
    'Successfully queried the Prometheus API.'
  );
});
