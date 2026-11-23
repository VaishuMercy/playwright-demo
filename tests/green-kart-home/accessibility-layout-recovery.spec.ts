import { expect, test } from '@playwright/test';
import {
  cartLine,
  cartLink,
  homePageUrl,
  openCart,
  productCard,
} from './helpers';

test.describe('GreenKart home-page accessibility, layout, and recovery', () => {
  test('5.1 operates product and cart controls with keyboard navigation', async ({ page }) => {
    await page.goto(homePageUrl);
    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });
    const broccoli = productCard(page, 'Brocolli - 1 Kg');
    const quantity = broccoli.getByRole('spinbutton');
    const decrement = broccoli.getByRole('link', { name: '–', exact: true });
    const increment = broccoli.getByRole('link', { name: '+', exact: true });
    const addButton = broccoli.getByRole('button', { name: 'ADD TO CART' });

    await expect(search).toHaveAccessibleName('Search for Vegetables and Fruits');
    await quantity.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(decrement).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(quantity).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(quantity).toHaveValue('2');
    await page.keyboard.press('ArrowDown');
    await expect(quantity).toHaveValue('1');
    await page.keyboard.press('Tab');
    await expect(increment).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(addButton).toBeFocused();
    await page.keyboard.press('Enter');

    await cartLink(page).focus();
    await page.keyboard.press('Enter');
    const broccoliLine = cartLine(page, 'Brocolli - 1 Kg');
    await expect(broccoliLine).toBeVisible();

    const removeButton = broccoliLine.getByRole('link', { name: '×' });
    await removeButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'You cart is empty!' })).toBeVisible();
  });

  test('5.2 keeps core controls usable at desktop, tablet, and mobile widths', async ({ page }) => {
    await page.goto(homePageUrl);
    const viewports = [
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'tablet', width: 768, height: 900 },
      { name: 'mobile', width: 320, height: 720 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();

      const search = page.getByRole('searchbox', {
        name: 'Search for Vegetables and Fruits',
      });
      await expect.soft(search, `${viewport.name}: search is visible`).toBeVisible();

      const horizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect.soft(horizontalOverflow, `${viewport.name}: no horizontal overflow`).toBe(false);

      if (await search.isVisible()) {
        await search.fill('Carrot');
      }
      const carrot = productCard(page, 'Carrot - 1 Kg');
      await expect(carrot).toBeVisible();
      await carrot.getByRole('link', { name: '+', exact: true }).click();
      await expect(carrot.getByRole('spinbutton')).toHaveValue('2');
      await carrot.getByRole('button', { name: 'ADD TO CART' }).click();

      await openCart(page);
      await expect(cartLine(page, 'Carrot - 1 Kg')).toContainText('2 Nos.');
      await expect(cartLine(page, 'Carrot - 1 Kg')).toBeVisible();
      await cartLine(page, 'Carrot - 1 Kg')
        .getByRole('link', { name: '×' }).click();
      await expect(page.getByRole('heading', { name: 'You cart is empty!' })).toBeVisible();
      await cartLink(page).click();
      if (await search.isVisible()) {
        await search.fill('');
      }
    }
  });

  test('5.3 reloads the home page and restores usable default state', async ({ page }) => {
    await page.goto(homePageUrl);
    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });
    await search.fill('Apple');
    const apple = productCard(page, 'Apple - 1 Kg');
    await expect(apple).toBeVisible();
    await apple.getByRole('link', { name: '+', exact: true }).click();

    await page.reload();
    await expect(page).toHaveURL(homePageUrl);
    await expect(search).toHaveValue('');
    await expect(page.getByRole('spinbutton')).toHaveCount(30);
    for (const quantity of await page.getByRole('spinbutton').all()) {
      await expect(quantity).toHaveValue('1');
    }

    await openCart(page);
    await expect(page.getByRole('heading', { name: 'You cart is empty!' })).toBeVisible();
    await cartLink(page).click();
    await search.fill('Carrot');
    const carrot = productCard(page, 'Carrot - 1 Kg');
    await expect(carrot).toBeVisible();
    await carrot.getByRole('link', { name: '+', exact: true }).click();
    await expect(carrot.getByRole('spinbutton')).toHaveValue('2');
  });
});
