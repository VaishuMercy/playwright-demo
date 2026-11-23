# GreenKart Comprehensive Storefront Test Plan

## Application Overview

Comprehensive functional and UX test plan for https://rahulshettyacademy.com/seleniumPractise/#/. The app has a searchable produce catalog with per-card quantity steppers and ADD TO CART, a header cart summary, a checkout summary with promo-code application, and a Top Deals route with a searchable/sortable/paginated table plus delivery-date controls. Observed anchor data: Apple - 1 Kg is ₹72; adding quantity 2 produced header item count 1 (distinct product), price ₹144, and checkout line total ₹144. Applying INVALIDCODE displayed “Invalid code ..!” and left the total unchanged. The public demo was not purchased from. Assume each test begins with a fresh browser context, empty cart, and cleared search unless the test specifies otherwise; restore state after each scenario. Run in authorized test contexts only. Never click Place Order on the public demo. During exploration, browser console errors were observed; capture the baseline and triage errors rather than silently ignoring them.

## Test Scenarios

### 1. Catalog, navigation, and product search

**Seed:** `tests/seed.spec.ts`

#### 1.1. [P1] Load storefront and verify product cards

**File:** `tests/green-kart-comprehensive/catalog-smoke.spec.ts`

**Steps:**
  1. Open the home route in a fresh browser context.
    - expect: The browser title is GreenKart - veg and fruits kart and the GREENKART header is visible.
    - expect: The product catalog renders product cards with names, prices, quantity controls, and ADD TO CART buttons.
    - expect: The header starts at Items: 0 and Price: 0.
  2. Scroll through the complete catalog and return to the top.
    - expect: Product cards remain readable and controls are associated with the correct product.
    - expect: No broken or overlapping content prevents using the catalog.

#### 1.2. [P1] Search catalog with matching and nonmatching queries

**File:** `tests/green-kart-comprehensive/catalog-search.spec.ts`

**Steps:**
  1. Type Apple in Search for Vegetables and Fruits.
    - expect: The product list filters to Apple - 1 Kg at ₹72.
  2. Replace the query with a partial matching term such as app, then try a different letter case.
    - expect: Matching products are filtered consistently; matching is not unexpectedly lost solely because of letter case.
  3. Replace the query with zznotfound.
    - expect: The empty state displays “Sorry, no products matched your search!” and instructs the user to enter a different keyword.
  4. Clear the search field.
    - expect: The full product list returns and the empty state disappears.

#### 1.3. [P1] Verify quantity stepper increments and minimum boundary

**File:** `tests/green-kart-comprehensive/quantity.spec.ts`

**Steps:**
  1. Locate Brocolli - 1 Kg, whose quantity initially displays 1.
    - expect: The starting quantity is 1.
  2. Select its increment control once and then its decrement control once.
    - expect: Quantity changes from 1 to 2 and back to 1.
  3. Select the decrement control again at quantity 1.
    - expect: Quantity remains 1 and never becomes zero or negative.
  4. If the quantity field accepts direct keyboard entry, try zero, a negative number, and nonnumeric input; restore quantity to 1.
    - expect: Invalid values are prevented or safely corrected; a zero, negative, or nonnumeric quantity cannot be added to the cart.

#### 1.4. [P2] Navigate to Top Deals and verify primary links

**File:** `tests/green-kart-comprehensive/navigation.spec.ts`

**Steps:**
  1. Select Top Deals from the home-page header.
    - expect: The app navigates to the offers route and displays the offers table.
  2. Return to the home route using browser navigation.
    - expect: The produce catalog is displayed and no accidental purchase or cart mutation occurs.
  3. Inspect the Flight Booking and QA Career Accelerator links without entering data or completing an external flow.
    - expect: Each link has a working destination and opens/navigates as configured; the original app remains usable when returning.

### 2. Cart and checkout calculation

**Seed:** `tests/seed.spec.ts`

#### 2.1. [P1] Add one product at default quantity

**File:** `tests/green-kart-comprehensive/cart.spec.ts`

**Steps:**
  1. From an empty cart, select ADD TO CART for Apple - 1 Kg without changing its default quantity.
    - expect: Header item count becomes 1 and header price becomes ₹72.
  2. Open Cart.
    - expect: Cart preview opens and provides a path to proceed to checkout.

#### 2.2. [P1] Add multiple units and verify checkout line total

**File:** `tests/green-kart-comprehensive/cart.spec.ts`

**Steps:**
  1. From a fresh cart, set Apple - 1 Kg quantity to 2 and add it to the cart.
    - expect: Header item count is 1 distinct product and header price is ₹144.
  2. Open Cart and select PROCEED TO CHECKOUT.
    - expect: Checkout summary shows Apple - 1 Kg, quantity 2, unit price 72, and line total 144.
    - expect: Summary shows 1 distinct item, total amount 144, discount 0%, and total after discount 144.
  3. Stop at the checkout summary without selecting Place Order.
    - expect: No order is submitted.

#### 2.3. [P1] Calculate totals for multiple products

**File:** `tests/green-kart-comprehensive/cart.spec.ts`

**Steps:**
  1. From a fresh cart, add one Apple (₹72) and one Brocolli - 1 Kg (₹120), each at quantity 1.
    - expect: Header item count is 2 and total price is ₹192.
  2. Proceed to checkout summary.
    - expect: Both products appear on separate lines with correct unit prices and line totals.
    - expect: Distinct-item count and overall total agree with the products added; total is ₹192 before discount.
  3. Stop before Place Order.
    - expect: No order is submitted.

#### 2.4. [P2] Add the same product more than once

**File:** `tests/green-kart-comprehensive/cart.spec.ts`

**Steps:**
  1. From a fresh cart, add Apple - 1 Kg once, then add it again using its product card.
    - expect: Cart item count and price reflect both additions with no lost or duplicated price calculation.
  2. Proceed to checkout summary.
    - expect: The product is represented consistently (merged or separate lines according to the app design) and the combined amount is ₹144.

#### 2.5. [P2] Handle empty cart and checkout access

**File:** `tests/green-kart-comprehensive/cart-empty.spec.ts`

**Steps:**
  1. Open Cart with an empty cart.
    - expect: The cart shows an empty state and does not present a misleading nonzero total.
  2. Check whether a checkout action is available while the cart is empty.
    - expect: The app prevents advancing with no items or clearly reports that the cart is empty.

#### 2.6. [P1] Reject invalid promo code without changing totals

**File:** `tests/green-kart-comprehensive/checkout-promo.spec.ts`

**Steps:**
  1. Reach checkout summary with Apple quantity 2 and total 144.
    - expect: Enter promo code and Apply controls are visible.
  2. Enter INVALIDCODE, select Apply, and wait until Applying... finishes.
    - expect: The page displays “Invalid code ..!”.
    - expect: Discount stays 0% and total after discount stays 144.
  3. Do not select Place Order.
    - expect: No order is submitted.

#### 2.7. [P2] Validate blank and repeated promo submissions

**File:** `tests/green-kart-comprehensive/checkout-promo.spec.ts`

**Steps:**
  1. On a fresh checkout summary, select Apply with the promo field empty.
    - expect: No discount is applied and the total remains unchanged; the page gives appropriate validation or retains the unchanged state.
  2. Submit an invalid code, wait for the response, and submit it once more.
    - expect: Loading feedback resolves after each submission, the error is clear, and totals do not change or accumulate a discount.

#### 2.8. [P2] Apply a valid promo code when a QA fixture is provided

**File:** `tests/green-kart-comprehensive/checkout-promo.spec.ts`

**Steps:**
  1. Only when an approved, currently valid demo promo code is documented, apply it to a known subtotal.
    - expect: The app confirms acceptance and calculates the discount and post-discount total correctly for the documented fixture.
    - expect: Without a verified valid code, mark this case blocked/not applicable rather than guessing a code.

### 3. Top Deals table and delivery-date controls

**Seed:** `tests/seed.spec.ts`

#### 3.1. [P1] Search Top Deals and handle no matches

**File:** `tests/green-kart-comprehensive/offers-search-sort.spec.ts`

**Steps:**
  1. Open Top Deals from the home page.
    - expect: Offers table contains Veg/fruit name, Price, and Discount price columns.
    - expect: Search field and page-size selector are visible.
  2. Search for Carrot.
    - expect: Only matching offer rows are shown and the Carrot row is visible.
  3. Replace the query with a nonmatching term.
    - expect: No unrelated rows are displayed and the empty-results state is clear.
  4. Clear search.
    - expect: The offers rows return.

#### 3.2. [P1] Sort offers by each table column in both directions

**File:** `tests/green-kart-comprehensive/offers-search-sort.spec.ts`

**Steps:**
  1. On Top Deals, select the Veg/fruit name column header twice.
    - expect: Rows sort ascending on the first selection and descending on the second; the table's sort announcement matches the direction.
  2. Repeat for Price and Discount price.
    - expect: Each column sorts in both directions and displayed data stays aligned with its row headings.

#### 3.3. [P1] Change page size and navigate pagination boundaries

**File:** `tests/green-kart-comprehensive/offers-pagination.spec.ts`

**Steps:**
  1. Open Top Deals with no search filter; record the current page and available page controls.
    - expect: Page size choices 5, 10, and 20 are available; the initial page size is 5.
  2. Select page size 10, then 20.
    - expect: The table displays up to the selected number of rows and page navigation reflects the resulting row count.
  3. Navigate Next, Previous, First, and Last where enabled.
    - expect: The current page indicator updates correctly; Previous/First are disabled on the first page and Next/Last are disabled on the last page.

#### 3.4. [P2] Preserve offer-table state across controls

**File:** `tests/green-kart-comprehensive/offers-state.spec.ts`

**Steps:**
  1. Search for Carrot, choose a different page size, and change sort order.
    - expect: The search filter remains applied, results remain relevant to Carrot, and sorting/page-size controls stay functional.
  2. Use each delivery-date field/control shown below the table; enter a valid date and an invalid date in a separate run.
    - expect: Date controls have understandable accessible names, valid values are represented consistently, and invalid dates are rejected or clearly corrected.
  3. After using the date control, inspect table search, sort, and pagination again.
    - expect: Unrelated date interactions do not silently clear the offer search or corrupt the table state.

### 4. Resilience, accessibility, and layout

**Seed:** `tests/seed.spec.ts`

#### 4.1. [P2] Operate core shopping controls with keyboard and accessible names

**File:** `tests/green-kart-comprehensive/accessibility.spec.ts`

**Steps:**
  1. Use Tab and Shift+Tab to reach catalog search, a product quantity control, ADD TO CART, Cart, and Top Deals.
    - expect: Focus is visible and follows a logical order; keyboard activation works for interactive controls.
  2. Inspect accessible names and roles of search, quantity inputs, cart link, table headers, pagination, promo field, and buttons.
    - expect: Controls can be identified by meaningful names and roles; icon-only controls have an accessible name or equivalent text.

#### 4.2. [P2] Verify key flows at desktop, tablet, and mobile widths

**File:** `tests/green-kart-comprehensive/responsive.spec.ts`

**Steps:**
  1. At desktop, tablet, and narrow mobile viewport sizes, load the home catalog and Top Deals.
    - expect: Header, search, product controls, offer table, and pagination remain usable without clipped actions or unintended horizontal overflow.
  2. At each viewport, open Cart and the checkout summary.
    - expect: Cart details and totals remain readable and the checkout-entry controls are reachable.

#### 4.3. [P2] Monitor runtime errors during core paths

**File:** `tests/green-kart-comprehensive/runtime-health.spec.ts`

**Steps:**
  1. Capture console and failed-request baseline on a fresh page, then exercise search, add-to-cart, cart, promo validation, and Top Deals.
    - expect: No new uncaught application errors or failed first-party requests are introduced by these operations; any known baseline errors are recorded and triaged.
