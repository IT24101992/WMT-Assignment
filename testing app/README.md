# Clothing App Unit Testing

Unit tests for the selected frontend logic and API request handling in the clothing app.

## Install

Run these commands from this folder:

```powershell
cd "C:\Users\LENOVO\Desktop\WMT-Assignment\testing app"
npm install
```

## Run All Tests

```powershell
npm test
```

## Run Individual Test Suites

```powershell
npm run test:cart
```

```powershell
npm run test:home
```

```powershell
npm run test:product
```

```powershell
npm run test:checkout
```

## Test Files

- `Cart.test.js` - cart API logic and cart calculation helpers
- `Home.test.js` - product list, category, search, filtering, and sorting logic
- `ProductDetails.test.js` - product detail API logic, size/quantity selection, and add-to-cart validation
- `Checkout.test.js` - checkout validation, order creation payloads, totals, selected cart cleanup, and order fetching

## Cart Covered Areas

- Fetch cart details
- Add item to cart
- Update item quantity
- Remove item from cart
- Clear cart
- Cart count calculation
- Line total and cart total calculation
- Empty cart handling
- Authentication and error handling

## Home Covered Areas

- Fetch all products
- Fetch product by ID
- Fetch products by category
- Search products
- Fetch categories
- Filter by category
- Filter by search text
- Filter new arrivals
- Filter discounted products
- Sort products by price
- Format LKR prices
- Empty result and server error handling

## Product Details Covered Areas

- Fetch product details
- Add product to cart
- Size selection validation
- Quantity increase and decrease rules
- Product image fallback handling
- Price display and discount logic
- Missing product and invalid response handling

## Checkout Covered Areas

- Create order request
- Fetch logged-in user's orders
- Remove only selected cart items after checkout
- Validate full name, address, city, phone number, and payment method
- Build checkout order items from cart items
- Trim shipping details before sending to backend
- Calculate subtotal, shipping, tax, and total
- Handle invalid payment method
- Handle invalid backend/server responses
- Build order status style keys
