import { expect, test } from '@playwright/test';

const storefrontUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';

test('rejects an invalid promo code without changing the total', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto(storefrontUrl);

  const search = page.getByRole('searchbox', { name: 'Search for Vegetables and Fruits' });
  await search.fill('Apple');
  const apple = page.locator('.product').filter({
    has: page.getByRole('heading', { name: 'Apple - 1 Kg', exact: true }),
  });
  await apple.getByRole('link', { name: '+', exact: true }).click();
  await apple.getByRole('button', { name: 'ADD TO CART' }).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();

  await page.getByRole('textbox', { name: 'Enter promo code' }).fill('INVALIDCODE');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('button', { name: 'Applying ...' })).toBeHidden({ timeout: 30_000 });

  await expect(page.getByText('Invalid code ..!')).toBeVisible();
  await expect(page.locator('body')).toContainText('Discount : 0%');
  await expect(page.locator('body')).toContainText('Total After Discount : 144');
  await expect(page.getByRole('button', { name: 'Place Order' })).toBeVisible();
});
