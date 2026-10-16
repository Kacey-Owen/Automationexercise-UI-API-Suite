<h1 align="center">AutomationExercise Playwright Test Suite</h1>

<p align="center">
  <strong>End-to-end UI automation using Playwright, TypeScript, and the Page Object Model</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge" alt="Playwright">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/UI%20%7C%20E2E-6B7280?style=for-the-badge" alt="UI and E2E">
  <img src="https://img.shields.io/badge/Page%20Object%20Model-8B5CF6?style=for-the-badge" alt="Page Object Model">
</p>

<p align="center">
  A QA automation project covering authentication, product discovery, cart behavior, checkout, payment, and a complete purchase journey.
</p>

<br>

---

<br>

<h2 align="center">📌 Overview</h2>

<br>

<p align="center">
This project is an automated <strong>UI and E2E test suite</strong> for AutomationExercise (https://automationexercise.com/), built with <strong>Playwright</strong> and <strong>TypeScript</strong>.
The suite covers happy paths as well as negative path, edge cases, and abnormal behavior findings using <strong>Page Object Model</strong> and dynamic test data.
</p>

<br>
<br>

## 🧪 Test Coverage

| Area | Coverage |
| :--- | :--- |
| 🏠 **Home** | Major navigation sections, logo behavior, invalid route handling |
| 🛍️ **Products** | Category filtering, brand filtering, product search, empty searches, no-match searches, add-to-cart |
| 🔎 **Product Detail** | Product information, quantity handling, invalid quantities, product reviews |
| 🔐 **Authentication** | Registration, login, logout, invalid credentials, empty fields, malformed input |
| 🛒 **Cart** | Multi-product pricing, item removal, quantity handling, checkout access control |
| 💳 **Checkout & Payment** | Checkout flow, payment details, order confirmation |
| 🔄 **Full E2E Flow** | Registration → search → cart → checkout → payment → confirmation → account deletion |

---

<h2 align="center">🚀 End-to-End Purchase Journey</h2>

<p align="center">A major focus of the project is validating that application state carries correctly across an entire user workflow rather than only testing individual pages in isolation.</p>

<p align="center">
  Register Account<br>
  ↓<br>
  Login<br>
  ↓<br>
  Search for Product<br>
  ↓<br>
  Add Product to Cart<br>
  ↓<br>
  Review Cart<br>
  ↓<br>
  Proceed to Checkout<br>
  ↓<br>
  Enter Payment Details<br>
  ↓<br>
  Confirm Order<br>
  ↓<br>
  Verify Order Confirmation<br>
  ↓<br>
  Delete Account
</p>

---

<h2 align="center">📖 Findings</h2>

1. No true 404 handling. Navigating to a nonexistent path doesn't return a 404 or show an error page. It just redirects to the homepage instead. A user following a broken or outdated link has no indication anything went wrong.

2. Signup accepts incorrect email addresses formats. The email field relies solely on HTML5 type="email" validation and only checks for the @ symbol and that there is letters after. An address like fake123@fake passes validation and the signup flow proceeds normally.

3. URL and page content disagree after a failed signup. Submitting signup with an already-registered email redirects the URL to /signup which is normally only after a successful signup.

4. Quantity accepts negative values with no validation. The quantity field is type="number", which correctly blocks non-numeric characters but there's no validation on the value itself. Entering -2 and adding to cart succeeds, and the cart displays and retains a quantity of -2.

5. No running total on the cart page. Each line item shows its own total, but there's no grand total anywhere on the cart page itself. A shopper has no way to see what they're about to spend without doing the math themselves or proceeding to checkout.

6. No way to adjust quantity from the cart. Changing the quantity of an item already in the cart requires removing it and adding it again from the product page. There's no in-place quantity control on the cart itself.
