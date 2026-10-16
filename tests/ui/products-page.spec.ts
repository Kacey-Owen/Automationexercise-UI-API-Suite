import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';

let productsPage: ProductsPage;

    test.beforeEach(async ({ page }) => {

        //block google popups
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

        //navigate to products page each test
        productsPage = new ProductsPage(page);

        await productsPage.goto();
    });


test.describe('Happy path tests', async () => {

    test('check if product page is visible', async ({ page }) => {
        //make sure home page banner is visible and url is correct
        const productHeader = productsPage.getHeader('All Products');
        await expect(productHeader).toHaveText('All Products');
        await expect(page).toHaveURL('/products');
    });

    test('check if clicking the women then the dress categories works', async  ({ page }) => {
        //click on women and then dress categories
        let categoryBtn = productsPage.getCategory('Women');

        await categoryBtn.click();

        categoryBtn = productsPage.getCategory('Dress');

        await categoryBtn.click();

        //get header
        const productHeader = productsPage.getHeader('Women - Dress Products');

        //check if site directs to dress page correctly
        await expect(page).toHaveURL('https://automationexercise.com/category_products/1');
        await expect(productHeader).toHaveText('Women - Dress Products');
    });

    test('check if clicking the men then the jeans categories works', async  ({ page }) => {
        //click on men and then jeans categories
        let categoryBtn = productsPage.getCategory('Men');

        await categoryBtn.click();

        categoryBtn = productsPage.getCategory('Jeans');

        await categoryBtn.click();

        //get header
        const productHeader = productsPage.getHeader('Men - Jeans Products');

        //check if site directs to jeans page correctly
        await expect(page).toHaveURL('https://automationexercise.com/category_products/6');
        await expect(productHeader).toHaveText('Men - Jeans Products');
    });

    test('check if clicking the polo brand link works', async  ({ page }) => {
        //click Polo brand category
        const categoryBtn = productsPage.getBrandCategory('Polo');

        await categoryBtn.click();

        //get header
        const productHeader = productsPage.getHeader('Brand - Polo Products');

        //check if site directs to polo page correctly
        await expect(page).toHaveURL('/brand_products/Polo');
        await expect(productHeader).toHaveText('Brand - Polo Products');
    });

    test('check if clicking the H&M brand link works', async  ({ page }) => {
        //click Polo brand category
        const categoryBtn = productsPage.getBrandCategory('H&M');

        await categoryBtn.click();

        //get header
        const productHeader = productsPage.getHeader('Brand - H&M Products');

        //check if site directs to polo page correctly
        await expect(page).toHaveURL('/brand_products/H&M');
        await expect(productHeader).toHaveText('Brand - H&M Products');
    });

    test('check if search box works', async ({ page }) => {
        //fill search box and press search button
        await productsPage.searchBox.fill('Blue Top');

        await productsPage.searchBtn.click();

        //get product name
        const product = productsPage.getProductName('Blue Top');

        //check if correct product was found
        await expect(product).toHaveText('Blue Top');
        await expect(page).toHaveURL('/products?search=Blue%20Top');
    });

    test('check if add to cart button works', async () => {
        //add Blue Top to cart
        await productsPage.addToCart('Blue Top');

        //check if add to cart confirmation message appears
        await expect(productsPage.addedToCartMsg).toHaveText('Your product has been added to cart.');
    });
});

test.describe('Negative paths', async() => {

    test('check if empty search box search just shows all products', async ({ page }) => {
        //press search button with nothing in it
        await productsPage.searchBtn.click();

        const productCount = await page.locator('.single-products').count();
        const pageHeader = productsPage.getHeader('All Products');

        //expect it to show all products
        await expect(pageHeader).toHaveText('All Products');
        await expect(productCount).toBeGreaterThan(0);
    });

    test('search for nonexistant product', async ({ page }) => {
        //fill search box with nonexistant product and press search button
        await productsPage.searchBox.fill('Nonexistant Product');

        await productsPage.searchBtn.click();

        //check for correct url and that there are no products shown
        await expect(page.locator('.single-products')).toHaveCount(0);
        await expect(page).toHaveURL('/products?search=Nonexistant%20Product');
    });

    test('search for long random string', async ({ page }) => {
        //fill search box with long random string and press search button
        await productsPage.searchBox.fill(';lkjfdsa;lkjfds;alkjfds;lakjfds;lakjfds;lakjfdsklajhfdsakjlhfdslk;jafd;slakj');

        await productsPage.searchBtn.click();

        //check that there are no products shown
        await expect(page.locator('.single-products')).toHaveCount(0);
    });
});