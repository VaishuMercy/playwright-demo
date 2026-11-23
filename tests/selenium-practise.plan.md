# GreenKart SeleniumPractise Storefront Test Plan

## Application Overview

Live exploration of GreenKart at https://rahulshettyacademy.com/seleniumPractise/#/. The home route shows a searchable produce catalog with quantity steppers and ADD TO CART buttons; the header tracks item count and total price. Proceeding from Cart opens a checkout summary with product, quantity, unit price, line total, promo-code input, discount/total summary, and Place Order. An invalid promo code displays “Invalid code ..!” without changing totals. The Top Deals route (#/offers) exposes a sortable, searchable table with 5/10/20 page-size choices and pagination. Run each scenario independently from a fresh page/cart state. Never click Place Order or complete any purchase.

## Test Scenarios

### 1. GreenKart shopping operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. [P1] Browse products and search catalog

**File:** `tests/green-kart/catalog-search.spec.ts`

**Steps:**
  1. Open the home route with an empty search field and fresh cart.
    - expect: The GreenKart header and produce catalog are visible.
    - expect: Each product card shows a product name, price, quantity input defaulting to 1, decrement and increment controls, and ADD TO CART.
  2. Search for Apple in the Search for Vegetables and Fruits field.
    - expect: The catalog filters to Apple - 1 Kg with price ₹72.
  3. Replace the query with a term that does not match a product.
    - expect: The empty state says “Sorry, no products matched your search!” and prompts the user to enter a different keyword.
  4. Clear the search field.
    - expect: The full product list returns.

#### 1.2. [P1] Change product quantity and verify minimum boundary

**File:** `tests/green-kart/quantity-cart.spec.ts`

**Steps:**
  1. On the fresh catalog, locate Brocolli - 1 Kg, whose quantity starts at 1.
    - expect: The quantity input displays 1.
  2. Select the increment control once, then the decrement control once.
    - expect: The quantity changes to 2 and returns to 1.
  3. Select the decrement control again while quantity is 1.
    - expect: The quantity remains at 1 and does not become zero or negative.

#### 1.3. [P1] Add products and verify checkout summary totals

**File:** `tests/green-kart/quantity-cart.spec.ts`

**Steps:**
  1. On the fresh catalog, set Apple - 1 Kg quantity to 2 and select ADD TO CART.
    - expect: The header item count is 1 distinct product and the header price is ₹144.
  2. Open Cart and select PROCEED TO CHECKOUT.
    - expect: The checkout summary lists Apple - 1 Kg, quantity 2, unit price 72, and line total 144.
    - expect: The summary reports 1 distinct item, total amount 144, discount 0%, and total after discount 144.
  3. Stop at the checkout summary without selecting Place Order.
    - expect: No order is submitted.

#### 1.4. [P1] Reject an invalid promo code without changing totals

**File:** `tests/green-kart/promo-code.spec.ts`

**Steps:**
  1. Reach the checkout summary with Apple - 1 Kg quantity 2 and total 144.
    - expect: The Enter promo code field and Apply button are visible.
  2. Enter INVALIDCODE and select Apply; wait for the Applying state to finish.
    - expect: The page displays “Invalid code ..!”.
    - expect: Discount remains 0% and total after discount remains 144.
  3. Do not select Place Order.
    - expect: No order is submitted.

#### 1.5. [P1] Search and sort Top Deals

**File:** `tests/green-kart/top-deals.spec.ts`

**Steps:**
  1. Open Top Deals from the home-page header.
    - expect: The offers table shows Veg/fruit name, Price, and Discount price columns.
    - expect: Page size defaults to 5; search and pagination controls are visible.
  2. Click the Price column header once.
    - expect: The table announces that it is sorted by price in ascending order and the displayed rows are ordered accordingly.
  3. Search for Carrot in the offers-table search field.
    - expect: Only matching offer rows are shown; the Carrot row is visible.
  4. Search for a term with no matches.
    - expect: No unrelated offer rows are shown and the empty-results behavior is clear.

#### 1.6. [P2] Change offers page size and navigate pages

**File:** `tests/green-kart/top-deals.spec.ts`

**Steps:**
  1. Open Top Deals with its default page size and clear table search.
    - expect: The table has multiple pages and page-size choices 5, 10, and 20.
  2. Select page size 10.
    - expect: Up to 10 rows are displayed on the current page and pagination reflects the available rows.
  3. Navigate to the next page, then use Previous or First.
    - expect: The correct page becomes current, and boundary controls such as Previous on the first page are disabled.
