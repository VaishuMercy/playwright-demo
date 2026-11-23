# GreenKart Home Page Test Plan

## Scope

Test only the GreenKart home route: https://rahulshettyacademy.com/seleniumPractise/#/. Coverage includes the product catalog, search, product quantity controls, and the cart preview that opens from the home-page header. Do not navigate to Top Deals, Flight Booking, external links, or the checkout page. Do not select **PROCEED TO CHECKOUT** or place an order.

Use a fresh browser context with an empty cart for each scenario unless the steps specify otherwise. Search results update asynchronously, so wait for the catalog to finish filtering before asserting. Remove any added products or start a fresh context after each cart scenario.

## Exploration Notes

- The home page rendered 30 product cards during exploration. Each card showed a name, price, quantity input initially set to 1, decrement/increment controls, and an **ADD TO CART** button.
- Search was case-insensitive for `Carrot`/`CARROT`. A nonmatching or whitespace-only query displayed “Sorry, no products matched your search!”; clearing the query restored the catalog. A query with surrounding spaces around `Carrot` returned no match.
- The cart preview remained on the home route. An empty cart displayed “You cart is empty!”. Adding Apple twice at quantity 1 showed one Apple line with 2 Nos. and a ₹144 line total.
- The cart header count represents distinct product lines: the Apple example showed 1 product line for 2 units.
- **Observed issues to retest:** direct entry of `0`, `-1`, and `1.5` was accepted by quantity inputs; adding `0` or `-1` also created a cart line. The decrement button itself did not reduce a quantity below 1. Cross-card isolation passed when entering a valid positive quantity; verify it separately for invalid values.
- At a narrow 320px viewport, the search control was not visible to Playwright's accessibility locator. Confirm whether it is intentionally hidden or unavailable on mobile.

## Test Scenarios

### 1. Home Page and Product Catalog

#### 1.1. [P1, Positive] Load the home page with a clean cart

1. Open the home route in a fresh browser context.
   - **Expected:** The page title is “GreenKart - veg and fruits kart”; the GREENKART header, search field, product catalog, and Cart control are visible.
   - **Expected:** Product cards render with names, prices, quantity inputs, decrement/increment controls, and **ADD TO CART** buttons. Quantities start at 1 and the cart is empty.

#### 1.2. [P1, Positive] Verify product card content and control association

1. Inspect products at the beginning, middle, and end of the catalog, including items with fractional package labels such as Raspberry or Almonds.
   - **Expected:** Each card's name, price, quantity controls, and add button belong to that same product; text and prices are readable and do not overlap.
   - **Expected:** Product images load or provide an appropriate accessible text alternative.

#### 1.3. [P2, Positive] Browse the complete catalog

1. Scroll from the first product to the last and back to the top.
   - **Expected:** All cards remain reachable, controls remain usable, and the page does not lose or duplicate products while scrolling.

### 2. Product Search

#### 2.1. [P1, Positive] Find products by exact and partial name

1. Search for `Carrot`, then replace it with a partial term such as `app`.
   - **Expected:** The first query shows Carrot - 1 Kg; the partial query shows matching product names only.
   - **Expected:** Filtering completes without requiring navigation away from the home route.

#### 2.2. [P1, Positive] Search without case sensitivity

1. Search for `Carrot`, then `CARROT`.
   - **Expected:** Both queries return the same matching product.

#### 2.3. [P1, Negative] Handle a query with no matches

1. Search for a term not present in the catalog, such as `zznotfound`.
   - **Expected:** No product cards are shown and the empty-state message “Sorry, no products matched your search!” is displayed.
   - **Expected:** No unrelated product remains visible as a stale result.

#### 2.4. [P1, Positive] Clear search and restore the catalog

1. Enter a matching query, then clear the search field.
   - **Expected:** The full catalog returns, the empty state disappears, and no product data or cart contents are changed by searching.

#### 2.5. [P2, Boundary] Handle whitespace and punctuation in search

1. Search with leading/trailing spaces around a valid product name, a whitespace-only query, and punctuation that matches no product.
   - **Expected:** Matching is predictable; surrounding whitespace does not unexpectedly hide a valid match. Empty or nonmatching inputs show an understandable state and do not break the page.
   - **Observation:** A whitespace-only query showed the no-results message during exploration; confirm whether whitespace should instead be treated as an empty query.

#### 2.6. [P2, Negative] Search while the cart contains products

1. Add a product, then search for another product and clear the query.
   - **Expected:** Search only filters the catalog; it does not remove, duplicate, or change products in the cart.

### 3. Product Quantity Controls

#### 3.1. [P1, Positive] Increment and decrement a valid quantity

1. On a product whose quantity starts at 1, select increment once, then decrement once.
   - **Expected:** The quantity changes from 1 to 2 and back to 1.

#### 3.2. [P1, Boundary] Prevent decrement below the minimum

1. Select decrement repeatedly while the quantity is 1.
   - **Expected:** The quantity remains 1; it never becomes zero or negative.

#### 3.3. [P1, Positive] Enter a valid quantity directly

1. Set one product quantity to a positive whole number such as 3 using the input.
   - **Expected:** The selected product displays 3; other product quantities remain unchanged.

#### 3.4. [P1, Negative] Reject zero and negative quantities

1. Enter `0` and then `-1` directly into a product quantity input; attempt to add the product only if the page permits it.
   - **Expected:** Invalid quantities are rejected or corrected to the minimum, cannot be added to the cart, and do not produce zero or negative totals.
   - **Expected:** Changing one product quantity does not change quantity inputs on other product cards.
   - **Known observation:** Both values were accepted during exploration, and `-1` appeared in all product inputs. Record this as a failure if reproduced.

#### 3.5. [P2, Negative] Handle nonnumeric and fractional quantity input

1. Attempt to enter letters and a fractional value in a quantity input.
   - **Expected:** Only valid whole-number quantities can be applied; invalid values are prevented or clearly corrected, and cannot be added to the cart.

#### 3.6. [P2, Boundary] Recover after invalid quantity entry

1. Enter an invalid value, then restore the quantity to 1 using the supported controls or input.
   - **Expected:** The selected card returns to a valid state and other cards remain unaffected.

### 4. Cart Preview on the Home Page

#### 4.1. [P1, Positive] Add one product at the default quantity

1. From an empty cart, add Apple - 1 Kg at quantity 1 and open Cart.
   - **Expected:** The cart shows Apple - 1 Kg, 1 unit, unit price ₹72, and a ₹72 line total.
   - **Expected:** The header cart count is 1 distinct product line.

#### 4.2. [P1, Positive] Add a product with quantity greater than one

1. From an empty cart, set Apple - 1 Kg to quantity 2 and select **ADD TO CART**.
   - **Expected:** The cart preview shows 2 units and a ₹144 line total; the header count is 1 distinct product line.

#### 4.3. [P1, Positive] Add multiple different products

1. From an empty cart, add Apple - 1 Kg and Brocolli - 1 Kg once each.
   - **Expected:** The cart preview shows both products on separate lines, the header count is 2 distinct product lines, and the combined amount is ₹192.

#### 4.4. [P1, Positive] Add the same product more than once

1. From an empty cart, add Apple - 1 Kg at quantity 1 twice.
   - **Expected:** The cart reflects 2 units of Apple and a ₹144 line total without losing or duplicating the calculation.
   - **Observed:** The preview showed one Apple line with 2 Nos. and ₹144 after two additions.

#### 4.5. [P1, Positive] Remove a product from the cart

1. Add a product, open Cart, and select that product's remove control.
   - **Expected:** The product disappears, the header count and total return to the empty-cart state, and the empty-state message is shown.

#### 4.6. [P1, Negative] Open Cart when it is empty

1. Open Cart with no products added.
   - **Expected:** The empty-cart message is visible; no stale product, positive count, or nonzero amount is displayed.
   - **Scope boundary:** The preview also displays **PROCEED TO CHECKOUT**. Do not activate it; checkout behavior is outside this plan.

#### 4.7. [P2, Positive] Reopen and close the cart preview

1. Add a product, open Cart, close it by selecting Cart again, then reopen it.
   - **Expected:** The preview opens and closes predictably; cart contents and amounts remain unchanged.

#### 4.8. [P1, Negative] Prevent invalid quantities from entering the cart

1. Attempt to add a product after setting its quantity to zero or a negative number.
   - **Expected:** The cart does not contain a zero/negative quantity or an invalid line total; the page provides a valid correction or blocks the add action.

### 5. Accessibility, Layout, and Recovery

#### 5.1. [P2, Positive] Use the home-page controls with a keyboard

1. Use Tab, Shift+Tab, Enter, and Space to reach and operate search, a product quantity control, **ADD TO CART**, Cart, and the remove control.
   - **Expected:** Focus is visible and follows a logical order; controls have usable accessible names and keyboard interactions do not trigger unrelated actions.

#### 5.2. [P2, Boundary] Verify layout at common viewport sizes

1. Load the home page at desktop, tablet, and narrow mobile widths; search, adjust quantity, and open Cart at each size.
   - **Expected:** Product names, prices, and essential controls remain visible and operable without unintended clipping or horizontal overflow.

#### 5.3. [P2, Recovery] Reload the home page

1. Reload the home route from a clean state and repeat a search and quantity change.
   - **Expected:** The home page and catalog load successfully; default quantities and clean-cart assumptions are restored in a fresh context.

## Out of Scope

- Top Deals (`#/offers`) and its table/date controls.
- Flight Booking and QA Career Accelerator destinations.
- The checkout page, promo codes, delivery/order submission, and any purchase flow.
- Backend inventory, payment, authentication, and account behavior not exposed on this page.
