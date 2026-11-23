import { expect, test } from '@playwright/test';

const offersUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/offers';

test.describe('GreenKart Top Deals', () => {
  test('searches and sorts offers, including a no-match query', async ({ page }) => {
    await page.goto(offersUrl);

    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Veg\/fruit name/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Price/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Discount price/ })).toBeVisible();
    await expect(page.getByLabel('Page size:')).toHaveValue('5');

    await page.getByRole('columnheader', { name: /Price/ }).click();
    await expect(page.getByRole('table', { name: 'Sorted by price: ascending order' })).toBeVisible();

    const search = page.getByRole('searchbox', { name: 'Search:' });
    await search.fill('Carrot');
    await expect(table.getByRole('row', { name: /Carrot/ })).toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(1);

    await search.fill('zznotfound');
    await expect(table.getByRole('cell', { name: 'No data' })).toBeVisible();
  });

  test('changes page size and navigates pagination boundaries', async ({ page }) => {
    await page.goto(offersUrl);

    const table = page.getByRole('table');
    const pageSize = page.getByLabel('Page size:');
    await expect(pageSize).toHaveValue('5');
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();

    await pageSize.selectOption('10');
    await expect(table.locator('tbody tr')).toHaveCount(10);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('button', { name: /2 \(current\)/ })).toBeVisible();

    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(page.getByRole('button', { name: /1 \(current\)/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });
});
