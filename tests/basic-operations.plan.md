# Sauce Demo Basic Operations Test Plan

## Application Overview

Basic customer operations for Sauce Demo, a Shopify storefront. The live homepage showed product links, Catalog, search, login/register, and cart/checkout navigation. Catalog lists seven products including two marked Sold Out; in-stock product pages show price, a variant selector, and Add to Cart. A cart item updates the header count and cart page displays line price, quantity, total, note field, Update, and Check Out. Searching for “jacket” returned Grey jacket and Noir jacket. Login and registration forms are available. Keep checkout tests at the checkout-entry step; do not submit orders or payment.

## Test Scenarios

### 1. Basic storefront operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. [P1] Load storefront and browse catalog

**File:** `tests/basic-operations/home-catalog.spec.ts`

**Steps:**
  1. Navigate to the storefront home page.
    - expect: The Sauce Demo title and storefront tagline are visible.
    - expect: Featured products Grey jacket, Noir jacket, and Striped top are listed with prices.
  2. Open Catalog from the primary navigation.
    - expect: The Products catalog page loads.
    - expect: Product cards show names and prices; Brown Shades and White sandals are visibly marked Sold Out.
  3. Open an in-stock product from the catalog.
    - expect: The product detail page shows its product name, price, variant selector, and Add to Cart button.

#### 1.2. [P1] Add product and update cart quantity

**File:** `tests/basic-operations/cart.spec.ts`

**Steps:**
  1. From a clean cart, add one Grey jacket from its product page.
    - expect: The header cart count changes from 0 to 1.
  2. Open the cart using Check Out in the header.
    - expect: The cart lists Grey jacket with unit price £55.00 and quantity 1.
    - expect: The cart total is £55.00.
    - expect: Quantity input, order note, Update, and Check Out controls are visible.
  3. Change quantity to 2 and select Update.
    - expect: The line quantity is 2.
    - expect: The line total and cart total update to £110.00.

#### 1.3. [P1] Remove cart item and verify empty cart

**File:** `tests/basic-operations/cart.spec.ts`

**Steps:**
  1. With a product in the cart, select its remove (x) link.
    - expect: The item is removed from the cart.
    - expect: The header cart count becomes 0 and the cart displays its empty state.

#### 1.4. [P1] Search for products and handle no matches

**File:** `tests/basic-operations/search.spec.ts`

**Steps:**
  1. Search for “jacket” using the header search field and submit.
    - expect: The search results page indicates results for jacket.
    - expect: Grey jacket (£55.00) and Noir jacket (£60.00) are listed.
  2. Search for a distinctive term that does not match a product.
    - expect: The search results page shows an empty/no-results state without product cards.

#### 1.5. [P1] Proceed from cart to checkout

**File:** `tests/basic-operations/checkout.spec.ts`

**Steps:**
  1. Add an in-stock product, open the cart, and select the cart Check Out button.
    - expect: The Shopify checkout page opens and presents its initial checkout step.
    - expect: Stop before entering customer or payment details or submitting an order.

#### 1.6. [P2] Open login and registration forms

**File:** `tests/basic-operations/account.spec.ts`

**Steps:**
  1. Open Log In from the header.
    - expect: Customer Login page shows Email Address and Password fields, a Forgot your password link, and Sign In button.
  2. Open Sign up from the header.
    - expect: Create Account page shows First Name, Last Name, Email Address, and Password fields and a Create button.
