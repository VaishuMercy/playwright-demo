import { expect, test } from '@playwright/test';

const homePageUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';

test.describe('GreenKart home page and product catalog', () => {
  test('1.1 loads the home page with a clean cart', async ({ page }) => {
    await page.goto(homePageUrl);

    await expect(page).toHaveTitle('GreenKart - veg and fruits kart');
    await expect(page.getByText('GREENKART', { exact: true })).toBeVisible();
    await expect(page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    })).toBeVisible();

    const products = page.getByRole('heading', { level: 4 });
    await expect(products.first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Cart/ })).toBeVisible();

    const quantities = page.getByRole('spinbutton');
    await expect(quantities).toHaveCount(30);
    for (const quantity of await quantities.all()) {
      await expect(quantity).toHaveValue('1');
    }

    await page.getByRole('link', { name: /^Cart/ }).click();
    await expect(page.getByRole('heading', { name: 'You cart is empty!' })).toBeVisible();
    await expect(page).toHaveURL(homePageUrl);
  });

  test('1.2 verifies product details and controls stay with their cards', async ({ page }) => {
    await page.goto(homePageUrl);

    const sampledProducts = [
      { name: 'Brocolli - 1 Kg', price: '120' },
      { name: 'Apple - 1 Kg', price: '72' },
      { name: 'Raspberry - 1/4 Kg', price: '160' },
      { name: 'Walnuts - 1/4 Kg', price: '170' },
    ];

    for (const productData of sampledProducts) {
      const card = page.locator('.product').filter({
        has: page.getByRole('heading', {
          name: productData.name,
          exact: true,
        }),
      });

      await expect(card).toHaveCount(1);
      await expect(card.getByRole('heading', {
        name: productData.name,
        exact: true,
      })).toBeVisible();
      await expect(card.getByRole('img', {
        name: productData.name,
        exact: true,
      })).toBeVisible();
      await expect(card.locator('p')).toContainText(productData.price);
      await expect(card.getByRole('spinbutton')).toHaveValue('1');
      await expect(card.getByRole('link', { name: '–' })).toBeVisible();
      await expect(card.getByRole('link', { name: '+' })).toBeVisible();
      await expect(card.getByRole('button', { name: 'ADD TO CART' })).toBeVisible();
    }
  });

  test('1.3 browses the complete catalog without losing or duplicating products', async ({ page }) => {
    await page.goto(homePageUrl);

    const products = page.getByRole('heading', { level: 4 });
    await expect(products).toHaveCount(30);

    const initialNames = await products.allTextContents();
    expect(new Set(initialNames).size).toBe(initialNames.length);
    expect(initialNames[0]).toBe('Brocolli - 1 Kg');
    expect(initialNames[initialNames.length - 1]).toBe('Walnuts - 1/4 Kg');

    const lastProduct = page.getByRole('heading', {
      name: 'Walnuts - 1/4 Kg',
      exact: true,
    });
    await lastProduct.scrollIntoViewIfNeeded();
    await expect(lastProduct).toBeInViewport();

    const firstProduct = page.getByRole('heading', {
      name: 'Brocolli - 1 Kg',
      exact: true,
    });
    await firstProduct.scrollIntoViewIfNeeded();
    await expect(firstProduct).toBeInViewport();

    await expect(products).toHaveCount(initialNames.length);
    expect(new Set(await products.allTextContents()).size).toBe(initialNames.length);
  });
});
