import { expect, test } from '@playwright/test';
import {
  cartLine,
  cartLink,
  homePageUrl,
  openCart,
  productCard,
} from './helpers';

test.describe('GreenKart home-page cart preview', () => {
  test('4.1 adds one product at the default quantity', async ({ page }) => {
    await page.goto(homePageUrl);
    await productCard(page, 'Apple - 1 Kg')
      .getByRole('button', { name: 'ADD TO CART' }).click();

    await openCart(page);
    const apple = cartLine(page, 'Apple - 1 Kg');
    await expect(apple).toHaveCount(1);
    await expect(apple).toContainText('1 No.');
    await expect(apple).toContainText('72');
  });

  test('4.2 adds the selected quantity and calculates the line total', async ({ page }) => {
    await page.goto(homePageUrl);
    const appleCard = productCard(page, 'Apple - 1 Kg');
    await appleCard.getByRole('link', { name: '+', exact: true }).click();
    await appleCard.getByRole('button', { name: 'ADD TO CART' }).click();

    await openCart(page);
    const apple = cartLine(page, 'Apple - 1 Kg');
    await expect(apple).toContainText('2 Nos.');
    await expect(apple).toContainText('144');
  });

  test('4.3 adds different products as separate cart lines', async ({ page }) => {
    await page.goto(homePageUrl);
    await productCard(page, 'Apple - 1 Kg')
      .getByRole('button', { name: 'ADD TO CART' }).click();
    await productCard(page, 'Brocolli - 1 Kg')
      .getByRole('button', { name: 'ADD TO CART' }).click();

    await openCart(page);
    await expect(cartLine(page, 'Apple - 1 Kg')).toContainText('72');
    await expect(cartLine(page, 'Brocolli - 1 Kg')).toContainText('120');
    await expect(page.getByRole('listitem')).toHaveCount(2);
  });

  test('4.4 accumulates repeated additions of the same product', async ({ page }) => {
    await page.goto(homePageUrl);
    const appleCard = productCard(page, 'Apple - 1 Kg');
    const addButton = appleCard.getByRole('button', { name: 'ADD TO CART' });

    await addButton.click();
    await addButton.click();
    await openCart(page);

    const apple = cartLine(page, 'Apple - 1 Kg');
    await expect(apple).toHaveCount(1);
    await expect(apple).toContainText('2 Nos.');
    await expect(apple).toContainText('144');
  });

  test('4.5 removes a product and returns to the empty-cart state', async ({ page }) => {
    await page.goto(homePageUrl);
    await productCard(page, 'Apple - 1 Kg')
      .getByRole('button', { name: 'ADD TO CART' }).click();
    await openCart(page);

    await cartLine(page, 'Apple - 1 Kg')
      .getByRole('link', { name: '×' }).click();
    await expect(page.getByRole('heading', { name: 'You cart is empty!' })).toBeVisible();
    await expect(cartLink(page)).toHaveAccessibleName('Cart');
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('4.6 shows an empty state without stale cart items', async ({ page }) => {
    await page.goto(homePageUrl);
    await openCart(page);

    await expect(page.getByRole('heading', { name: 'You cart is empty!' })).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'PROCEED TO CHECKOUT' })).toBeVisible();
  });

  test('4.7 opens and closes the cart without changing its contents', async ({ page }) => {
    await page.goto(homePageUrl);
    await productCard(page, 'Apple - 1 Kg')
      .getByRole('button', { name: 'ADD TO CART' }).click();

    await openCart(page);
    const apple = cartLine(page, 'Apple - 1 Kg');
    await expect(apple).toContainText('1 No.');
    await cartLink(page).click();
    await expect(apple).toBeHidden();
    await cartLink(page).click();
    await expect(apple).toContainText('1 No.');
    await expect(apple).toContainText('72');
  });

  for (const value of ['0', '-1']) {
    test(`4.8 does not add a product with quantity ${value}`, async ({ page }) => {
      await page.goto(homePageUrl);
      const appleCard = productCard(page, 'Apple - 1 Kg');
      await appleCard.getByRole('spinbutton').fill(value);
      await appleCard.getByRole('button', { name: 'ADD TO CART' }).click();
      await openCart(page);

      await expect.soft(cartLine(page, 'Apple - 1 Kg')).toHaveCount(0);
      await expect.soft(page.getByRole('heading', {
        name: 'You cart is empty!',
      })).toBeVisible();
    });
  }
});
