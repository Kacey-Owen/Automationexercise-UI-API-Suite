import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

let productDetailPage: ProductDetailPage;
let productsPage: ProductsPage;

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

        //navigate to products page and click on Blue Top
        productsPage = new ProductsPage(page);
        await productsPage.goto();
        const blueTopLink = productsPage.getViewProductLink('Blue Top');
        await blueTopLink.click();
        productDetailPage = new ProductDetailPage(page);
    });

test.describe('Happy Path tests', () => {

    test('check if correct item shows', async ({ page }) => {
        //check for Blue Top header
        const productName = productDetailPage.getHeader('Blue Top');

        //check for correct url and product name
        await expect(page).toHaveURL('/product_details/1');
        await expect(productName).toHaveText('Blue Top');
    });

    test('check if quantity input works', async ({ page }) => {
        //fill quantity with number greater than or equal to 1
        await productDetailPage.quantityInput.fill('10');
        await productDetailPage.addToCartBtn.click();

        //check for confirmation message
        await expect(productDetailPage.addedToCartMsg).toHaveText('Your product has been added to cart.');
        await productDetailPage.viewCartLink.click();

        //check cart page for correct quantity
        const cartPage = new CartPage(page);
        await expect(cartPage.getProductQuantity('Blue Top', '1')).toHaveText('10');
    });

    test('check if review section works', async ({ page }) => {
        //fill review boxes
        await productDetailPage.reviewName.fill('Jack');
        await productDetailPage.reviewEmail.fill('fake@fake.com');
        await productDetailPage.reviewMsg.fill('Great product!');

        //click submit and check for confirmation message
        await productDetailPage.submitBtn.click();
        await expect(productDetailPage.reviewConfirm).toBeVisible();
    });
});

test.describe('Negative Paths', async () => {

    test('check if negative quantity is validated', async ({ page }) => {
        //fill quantity with negative number
        await productDetailPage.quantityInput.fill('-2');
        await productDetailPage.addToCartBtn.click();

        //check for confirmation message instead of validation of input
        await expect(productDetailPage.addedToCartMsg).toHaveText('Your product has been added to cart.');

        //go to cart and see if quantity is still negative
        await productDetailPage.viewCartLink.click();
        const cartPage = new CartPage(page);
        await expect(cartPage.getProductQuantity('Blue Top', '1')).toHaveText('-2');//quantity is still negative in cart
    });

    test('check if quantity is required to be numerical', async () => {
        //check if input is required to be numerical
        await expect(productDetailPage.quantityInput).toHaveAttribute('type', 'number');
    })
});