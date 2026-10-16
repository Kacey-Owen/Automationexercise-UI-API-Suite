import { test, expect } from '@playwright/test';
import { validUserDetails } from '../../test-data/users';
import { HomePage } from '../../pages/HomePage';
import { AuthPage, SignupPage } from '../../pages/AuthPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';

    let homePage: HomePage;
    let authPage: AuthPage;
    let signupPage: SignupPage;
    let productsPage: ProductsPage;
    let productDetailPage: ProductDetailPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let paymentPage: PaymentPage;

    test.beforeEach(async ({ page }) => {
        //block Google popups
        await page.route(
            '**/*',
            (route) => {
                const url = route.request().url();
                if (url.includes('googlesyndication') || 
                    url.includes('doubleclick') || 
                    url.includes('googleadservices') || 
                    url.includes('pagead')) {
                    return route.abort();
                }
                return route.continue();
            }
        );

        homePage = new HomePage(page);
        await homePage.goto();
    });

    test('Full E2E purchase flow', async ({ page }) => {
        //sign up user
        await homePage.logInNavLink.click();
        authPage = new AuthPage(page);

        //fill in user info and click signup
        await authPage.signupName.fill(validUserDetails.fullName);
        await authPage.signupEmail.fill(validUserDetails.email);
        await authPage.signupBtn.click();

        //fill in rest of user info and finish signup
        signupPage = new SignupPage(page);
        await signupPage.fillUserInfo();
        await signupPage.createAccountBtn.click();
        
        //check if url and confirmation message are correct
        const creationMsg = signupPage.getHeader('Account Created!');
        await expect(creationMsg).toHaveText('Account Created!');
        await expect(page).toHaveURL('/account_created');

        //hit continue button and navigate to products page
        await signupPage.continueBtn.click();
        await homePage.productNavLink.click();
        productsPage = new ProductsPage(page);
        
        //search for Grunt Blue Slim Fit Jeans and add a few to cart
        await productsPage.searchBox.fill('Grunt Blue Slim Fit Jeans');
        await productsPage.getViewProductLink('Grunt Blue Slim Fit Jeans').click();
        productDetailPage = new ProductDetailPage(page);
        await productDetailPage.quantityInput.fill('3');
        await productDetailPage.addToCartBtn.click();
        
        //check for add to cart confirmation message
        await expect(productDetailPage.addedToCartMsg).toHaveText('Your product has been added to cart.');

        //navigate to cart
        await productDetailPage.viewCartLink.click();
        cartPage = new CartPage(page);

        //get numbers for calculation
        const productQty = await cartPage.convertQtyToNumber('Grunt Blue Slim Fit Jeans', '37');
        const productPrice = await cartPage.convertPriceToNumber('Grunt Blue Slim Fit Jeans', '37');
        const total = (productQty * productPrice);

        //check for correct info
        await expect(cartPage.getHeader('Grunt Blue Slim Fit Jeans')).toHaveText('Grunt Blue Slim Fit Jeans');
        await expect(productQty).toBe(3);
        await expect(productPrice).toBe(1400);
        await expect(total).toBe(4200);

        //navigate to checkout
        await cartPage.checkoutBtn.click();
        checkoutPage = new CheckoutPage(page);

        //check if total is correct
        const price = await checkoutPage.convertTotalToNum();
        await expect(price).toBe(total);

        //fill message box and place order
        await checkoutPage.messageBox.fill('Please leave at side door instead of front door.');
        await checkoutPage.placeOrderBtn.click();
        paymentPage = new PaymentPage(page);

        //fill in payment info and confirm order
        await paymentPage.nameInput.fill(validUserDetails.fullName);
        await paymentPage.cardNumber.fill(validUserDetails.cardNumber);
        await paymentPage.cvcNum.fill(validUserDetails.cvc);
        await paymentPage.expirationMonth.fill(validUserDetails.expirationMonth);
        await paymentPage.expirationYear.fill(validUserDetails.expirationYear);
        await paymentPage.confirmOrderBtn.click();

        //check for order placed message
        await expect(paymentPage.orderConfirmedMsg).toHaveText('Order Placed!');

        //press continue button and then delete account
        await paymentPage.continueBtn.click();
        homePage = new HomePage(page);
        await homePage.deleteAccLink.click();

        //check for deleted account confirmation message
        await expect(homePage.accDeletedMsg).toHaveText('Account Deleted!');

        //E2E flow done
    });