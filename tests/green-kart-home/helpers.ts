import type { Locator, Page } from '@playwright/test';

export const homePageUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';

export function productCard(page: Page, name: string): Locator {
  return page.locator('.product').filter({
    has: page.getByRole('heading', { name, exact: true }),
  });
}

export function cartLink(page: Page): Locator {
  return page.getByRole('link', { name: /^Cart/ });
}

export function cartLine(page: Page, name: string): Locator {
  return page.getByRole('listitem').filter({ hasText: name });
}

export async function openCart(page: Page): Promise<void> {
  await cartLink(page).click();
}
