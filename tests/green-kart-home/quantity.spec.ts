import { expect, test } from '@playwright/test';
import { homePageUrl, productCard } from './helpers';

test.describe('GreenKart home-page product quantities', () => {
  test('3.1 increments and decrements a valid quantity', async ({ page }) => {
    await page.goto(homePageUrl);
    const broccoli = productCard(page, 'Brocolli - 1 Kg');
    const quantity = broccoli.getByRole('spinbutton');

    await expect(quantity).toHaveValue('1');
    await broccoli.getByRole('link', { name: '+', exact: true }).click();
    await expect(quantity).toHaveValue('2');
    await broccoli.getByRole('link', { name: '–', exact: true }).click();
    await expect(quantity).toHaveValue('1');
  });

  test('3.2 does not decrement below one', async ({ page }) => {
    await page.goto(homePageUrl);
    const broccoli = productCard(page, 'Brocolli - 1 Kg');
    const quantity = broccoli.getByRole('spinbutton');

    await broccoli.getByRole('link', { name: '–', exact: true }).click();
    await broccoli.getByRole('link', { name: '–', exact: true }).click();
    await expect(quantity).toHaveValue('1');
  });

  test('3.3 applies a valid direct quantity only to the selected product', async ({ page }) => {
    await page.goto(homePageUrl);
    const broccoli = productCard(page, 'Brocolli - 1 Kg');
    const apple = productCard(page, 'Apple - 1 Kg');

    await broccoli.getByRole('spinbutton').fill('3');
    await broccoli.getByRole('spinbutton').press('Tab');
    await expect(broccoli.getByRole('spinbutton')).toHaveValue('3');
    await expect(apple.getByRole('spinbutton')).toHaveValue('1');
  });

  for (const value of ['0', '-1']) {
    test(`3.4 rejects direct quantity ${value}`, async ({ page }) => {
      await page.goto(homePageUrl);
      const broccoli = productCard(page, 'Brocolli - 1 Kg');
      const apple = productCard(page, 'Apple - 1 Kg');
      const quantity = broccoli.getByRole('spinbutton');

      await quantity.fill(value);
      await quantity.press('Tab');

      await expect.soft(quantity).toHaveValue('1');
      await expect.soft(apple.getByRole('spinbutton')).toHaveValue('1');
    });
  }

  test('3.5 ignores nonnumeric keyboard input', async ({ page }) => {
    await page.goto(homePageUrl);
    const quantity = productCard(page, 'Brocolli - 1 Kg').getByRole('spinbutton');

    await quantity.fill('1');
    await quantity.pressSequentially('abc');
    await quantity.press('Tab');

    await expect(quantity).toHaveValue('1');
  });

  test('3.5 rejects fractional quantities', async ({ page }) => {
    await page.goto(homePageUrl);
    const quantity = productCard(page, 'Brocolli - 1 Kg').getByRole('spinbutton');

    await quantity.fill('1.5');
    await quantity.press('Tab');

    await expect(quantity).toHaveValue('1');
  });

  test('3.6 recovers to a valid quantity after invalid input', async ({ page }) => {
    await page.goto(homePageUrl);
    const broccoli = productCard(page, 'Brocolli - 1 Kg');
    const apple = productCard(page, 'Apple - 1 Kg');
    const quantity = broccoli.getByRole('spinbutton');

    await quantity.fill('0');
    await quantity.fill('1');
    await quantity.press('Tab');

    await expect(quantity).toHaveValue('1');
    await expect(apple.getByRole('spinbutton')).toHaveValue('1');
  });
});
