import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

let productsPage: ProductsPage;
let cartPage: CartPage;

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

        //navigate to products page, add a couple products, then navigate to cart
        productsPage = new ProductsPage(page);
        await productsPage.goto();

        //add 2 Blue Tops and 1 Men Tshirt to cart
        await productsPage.addToCart('Blue Top');
        await productsPage.continueShoppingBtn.click();

        await productsPage.addToCart('Blue Top');
        await productsPage.continueShoppingBtn.click();

        await productsPage.addToCart('Men Tshirt');
        await productsPage.viewCartLink.click();

        //create cartPage instance
        cartPage = new CartPage(page);
    });

    test.describe('Happy Path tests', () => {

        test('check if total is correct', async () => {
            //convert Blue Tops qty and price to number for math
            const product1Qty = await cartPage.convertQtyToNumber('Blue Top', '1');
            const product1Price = await cartPage.convertPriceToNumber('Blue Top', '1');

            //convert Men Tshirt qty and price to number for math
            const product2Qty = await cartPage.convertQtyToNumber('Men Tshirt', '2');
            const product2Price = await cartPage.convertPriceToNumber('Men Tshirt', '2');

            //check if total is correct number
            const totalProduct1 = (product1Qty * product1Price);
            await expect(totalProduct1).toBe(1000);

            const totalProduct2 = (product2Qty * product2Price);
            await expect(totalProduct2).toBe(400);
        });

        test('check if remove buttons work', async () => {
            //click remove buttons
            await cartPage.getRemoveBtn('Blue Top', '1').click();
            await cartPage.getRemoveBtn('Men Tshirt', '2').click();

            //check for empty cart message
            await expect(cartPage.emptyCartMessage).toHaveText('Cart is empty!');
        });

    });

    test.describe('Negative Paths', async () => {
        
        test('check if site allows checkout while not logged in', async () => {
            //click checkout button
            await cartPage.checkoutBtn.click();

            //check for modal message
            await expect(cartPage.modalMsg).toHaveText('Register / Login account to proceed on checkout.');
        });

    });