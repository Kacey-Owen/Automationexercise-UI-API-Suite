import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { AuthPage } from '../../pages/AuthPage';

let homePage: HomePage;

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

        //navigate to homepage
        homePage = new HomePage(page);
        await homePage.goto();
    });

test.describe('Happy Path home page tests', () => {

    test('Home Page is visible', async ({ page }) => {
        //make sure home page banner is visible and url is correct
        await expect(homePage.homePageFeaturesHeader).toHaveText('Features Items');
        await expect(page).toHaveURL('/');
    });

    test('View Product link works', async ({ page }) => {
        //navigate to product detail page
        const productDetailPage = new ProductDetailPage(page);
        const viewProduct = homePage.getViewProductLink('Blue Top');

        await viewProduct.click();

        //check for correct url and correct product
        await expect(page).toHaveURL('/product_details/1');

        await expect(productDetailPage.getHeader('Blue Top')).toHaveText('Blue Top');
    });

    test('Products link works', async ({ page }) => {
        //navigate to products page 
        const productPage = new ProductsPage(page);

        await homePage.productNavLink.click();

        //get product header
        const productHeader = productPage.getHeader('All Products');

        //check for correct url and correct header
        await expect(page).toHaveURL('/products');
        await expect(productHeader).toHaveText('All Products');
    });

    test('Cart link works', async ({ page }) => {
        //navigate to cart page
        const cartPage = new CartPage(page);

        await homePage.cartNavLink.click();

        //check for correct url and "Cart is empty" message
        await expect(page).toHaveURL('/view_cart');
        await expect(cartPage.emptyCartMessage).toHaveText('Cart is empty!');
    });

    test('check if Signup/Login link works', async ({ page }) => {
        //navigate to login/signup page
        const authPage = new AuthPage(page);

        await homePage.logInNavLink.click();

        //get header
        const loginMessage = authPage.getHeader('Login to your account');
        const signupMessage = authPage.getHeader('New User Signup!');

        //check for correct url and login and signup messages
        await expect(page).toHaveURL('/login');
        await expect(loginMessage).toHaveText('Login to your account');
        await expect(signupMessage).toHaveText('New User Signup!');
    });

    test('check website logo link works', async ({ page }) => {
        //click logo
        await homePage.websiteLogo.click();

        //check for correct url and header
        await expect(page).toHaveURL('https://automationexercise.com/');
        await expect(homePage.homePageFeaturesHeader).toHaveText('Features Items');
    });
});

test.describe('Negative Path home page test', () => {

    test('try to go to nonexistant page', async ({ page }) => {
        //check if website redirects for incorrect url
        await page.goto('/nonexistant_page');
        await expect(page).toHaveURL('https://automationexercise.com/');
    });

});