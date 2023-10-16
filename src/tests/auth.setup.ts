import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

const credentials = {
  user: 'admin',
  password: 'admin',
};

setup('authenticate', async ({ request }) => {
  await request.post('/login', {
    data: credentials,
  });
  await request.storageState({ path: authFile });
});

// setup('authenticate', async ({ page, request, baseURL }) => {
//   await page.goto(`http://localhost:3000${selectors.pages.Login.url}`, {
//     waitUntil: 'networkidle',
//   });

//   const fields = {
//     password: page.locator(
//       `input[aria-label="${selectors.pages.Login.password}"]`
//     ),
//     username: page.locator(
//       `input[aria-label="${selectors.pages.Login.username}"]`
//     ),
//   };

//   const buttons = {
//     skip: page.locator(`button[aria-label="${selectors.pages.Login.skip}"]`),
//     submit: page.locator(
//       `button[aria-label="${selectors.pages.Login.submit}"]`
//     ),
//   };

//   await fields.username.fill('admin');
//   await fields.password.fill('admin');
//   await buttons.submit.click();

//   // checks page for skip change password screen
//   await expect(buttons.skip.isVisible()).toBeTruthy();

//   await buttons.skip.click();

//   await page.waitForURL('/', {
//     waitUntil: 'networkidle',
//   });
//   await expect(page).toHaveTitle('Grafana');
//   await page.context().storageState({ path: authFile });
// });
