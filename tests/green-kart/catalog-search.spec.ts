import { expect, test } from '@playwright/test';

const storefrontUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';

test.describe('GreenKart catalog and product search', () => {
  test('shows product cards and filters results, including the empty state', async ({ page }) => {
    await page.goto(storefrontUrl);

    await expect(page).toHaveTitle('GreenKart - veg and fruits kart');
    await expect(page.getByText('GREENKART', { exact: true })).toBeVisible();

    const products = page.locator('.product');
    await expect(products.first()).toBeVisible();
    await expect(products.first().getByRole('heading')).toBeVisible();
    await expect(products.first().getByRole('spinbutton')).toHaveValue('1');
    await expect(products.first().getByRole('link', { name: '–' })).toBeVisible();
    await expect(products.first().getByRole('link', { name: '+' })).toBeVisible();
    await expect(products.first().getByRole('button', { name: 'ADD TO CART' })).toBeVisible();

    const search = page.getByRole('searchbox', { name: 'Search for Vegetables and Fruits' });
    await search.fill('Apple');

    const apple = page.locator('.product').filter({
      has: page.getByRole('heading', { name: 'Apple - 1 Kg', exact: true }),
    });
    await expect(apple).toHaveCount(1);
    await expect(apple.locator('p')).toContainText('72');

    await search.fill('zznotfound');
    await expect(page.getByRole('heading', { name: 'Sorry, no products matched your search!' })).toBeVisible();
    await expect(page.getByText('Enter a different keyword and try.')).toBeVisible();

    await search.fill('');
    await expect(page.getByRole('heading', { name: 'Sorry, no products matched your search!' })).toBeHidden();
    await expect(products).not.toHaveCount(1);
  });
});
