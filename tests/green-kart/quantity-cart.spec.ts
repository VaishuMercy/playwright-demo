import { expect, test } from '@playwright/test';

const storefrontUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';

test.describe('GreenKart quantities and cart totals', () => {
  test('increments and decrements quantity without going below one', async ({ page }) => {
    await page.goto(storefrontUrl);

    const brocolli = page.locator('.product').filter({
      has: page.getByRole('heading', { name: 'Brocolli - 1 Kg', exact: true }),
    });
    const quantity = brocolli.getByRole('spinbutton');

    await expect(quantity).toHaveValue('1');
    await brocolli.getByRole('link', { name: '+', exact: true }).click();
    await expect(quantity).toHaveValue('2');
    await brocolli.getByRole('link', { name: '–', exact: true }).click();
    await expect(quantity).toHaveValue('1');
    await brocolli.getByRole('link', { name: '–', exact: true }).click();
    await expect(quantity).toHaveValue('1');
  });

  test('adds two apples and verifies the checkout summary without placing an order', async ({ page }) => {
    await page.goto(storefrontUrl);

    const search = page.getByRole('searchbox', { name: 'Search for Vegetables and Fruits' });
    await search.fill('Apple');
    const apple = page.locator('.product').filter({
      has: page.getByRole('heading', { name: 'Apple - 1 Kg', exact: true }),
    });

    await apple.getByRole('link', { name: '+', exact: true }).click();
    await apple.getByRole('button', { name: 'ADD TO CART' }).click();
    await expect(page.getByRole('row', { name: /Items\s*:\s*1/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price\s*:\s*144/ })).toBeVisible();

    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
    await expect(page).toHaveURL(/#\/cart$/);
    await expect(page.getByRole('row', { name: /Apple - 1 Kg\s+2\s+72\s+144/ })).toBeVisible();
    await expect(page.locator('body')).toContainText('No. of Items : 1');
    await expect(page.locator('body')).toContainText('Total Amount :');
    await expect(page.locator('body')).toContainText('Discount : 0%');
    await expect(page.locator('body')).toContainText('Total After Discount : 144');
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeVisible();
  });
});
