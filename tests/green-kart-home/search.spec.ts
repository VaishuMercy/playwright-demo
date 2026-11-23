import { expect, test } from '@playwright/test';
import { cartLine, homePageUrl, openCart, productCard } from './helpers';

test.describe('GreenKart home-page product search', () => {
  test('2.1 finds exact and partial product names', async ({ page }) => {
    await page.goto(homePageUrl);
    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });

    await search.fill('Carrot');
    await expect(productCard(page, 'Carrot - 1 Kg')).toHaveCount(1);

    await search.fill('app');
    await expect(productCard(page, 'Apple - 1 Kg')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 4 })).toHaveCount(1);
  });

  test('2.2 matches product names without case sensitivity', async ({ page }) => {
    await page.goto(homePageUrl);
    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });

    await search.fill('Carrot');
    await expect(productCard(page, 'Carrot - 1 Kg')).toHaveCount(1);
    await search.fill('CARROT');
    await expect(productCard(page, 'Carrot - 1 Kg')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 4 })).toHaveCount(1);
  });

  test('2.3 shows a clear empty state when no products match', async ({ page }) => {
    await page.goto(homePageUrl);
    await page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    }).fill('zznotfound');

    await expect(page.getByRole('heading', {
      name: 'Sorry, no products matched your search!',
    })).toBeVisible();
    await expect(page.getByText('Enter a different keyword and try.')).toBeVisible();
    await expect(page.getByRole('heading', { level: 4 })).toHaveCount(0);
  });

  test('2.4 restores the catalog when the search is cleared', async ({ page }) => {
    await page.goto(homePageUrl);
    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });

    await search.fill('Apple');
    await expect(productCard(page, 'Apple - 1 Kg')).toHaveCount(1);
    await search.fill('');

    await expect(page.getByRole('heading', { level: 4 })).toHaveCount(30);
    await expect(page.getByRole('heading', {
      name: 'Sorry, no products matched your search!',
    })).toBeHidden();
  });

  test('2.5 matches a product when the query has surrounding whitespace', async ({ page }) => {
    await page.goto(homePageUrl);
    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });

    await search.fill('  Carrot  ');
    await expect(productCard(page, 'Carrot - 1 Kg')).toHaveCount(1);
  });

  test('2.5 shows a clear state for blank and punctuation-only queries', async ({ page }) => {
    await page.goto(homePageUrl);
    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });

    await search.fill('   ');
    await expect(page.getByRole('heading', {
      name: 'Sorry, no products matched your search!',
    })).toBeVisible();

    await search.fill('!?@#');
    await expect(page.getByRole('heading', {
      name: 'Sorry, no products matched your search!',
    })).toBeVisible();
  });

  test('2.6 keeps cart contents unchanged while searching', async ({ page }) => {
    await page.goto(homePageUrl);
    await productCard(page, 'Apple - 1 Kg')
      .getByRole('button', { name: 'ADD TO CART' }).click();

    const search = page.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });
    await search.fill('Carrot');
    await expect(productCard(page, 'Carrot - 1 Kg')).toHaveCount(1);

    await openCart(page);
    await expect(cartLine(page, 'Apple - 1 Kg')).toContainText('1 No.');
    await search.fill('');
    await expect(page.getByRole('heading', { level: 4 })).toHaveCount(30);
    await expect(cartLine(page, 'Apple - 1 Kg')).toContainText('72');
  });
});
