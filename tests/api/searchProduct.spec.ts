import { test, expect } from '@playwright/test'

test.describe('positive tests for /api/searchProduct', () => {

    test('search for product', async ({ request }) => {
        //search for prodcuts matching "top"
        const response = await request.post('/api/searchProduct', {
            form: {
                search_product: 'top'
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check for successful response
        expect(body.responseCode).toBe(200);

        //check for status code and search results > 0 and that at least one result contains "top"
        expect(body.products).toBeDefined();
        expect(body.products.length).toBeGreaterThan(0);
        expect(body.products[0].name.toLowerCase()).toContain('top');

        //check that properties are correct structure
        for (const product of body.products) {

            expect(product.id).toEqual(expect.any(Number));
            expect(product.name).toEqual(expect.any(String));
            expect(product.price).toEqual(expect.any(String));
            expect(product.price).toContain('Rs. ');
            expect(product.brand).toEqual(expect.any(String));

            expect(product.category).toEqual(
                expect.objectContaining({
                    usertype: expect.objectContaining({
                        usertype: expect.any(String)
                    }),
                    category: expect.any(String)
                })
            );
        }
    });
});

test.describe('Negative tests for /api/searchProduct', () => {

    test('search for nonexistant product', async ({ request }) => {

        //search for nonexistant product
        const response = await request.post('/api/searchProduct', {
            form: {
                search_product: 'dog'
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check if response is 200 and that there are no products 
        expect(body.responseCode).toBe(200);
        expect(body.products).toBeDefined(); //products is defined
        expect(body.products).toEqual([]);//but products array is empty
        expect(body.products.length).toBe(0);
    });

    test('search without parameter', async ({ request }) => {

        //search for nonexistant product
        const response = await request.post('/api/searchProduct');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check if response is 400 and that there are no products 
        expect(body.responseCode).toBe(400);
        expect(body.products).not.toBeDefined();
        expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });

    test('search for empty string', async ({ request }) => {

        //search for empty string
        const response = await request.post('/api/searchProduct', {
            form: {
                search_product: ''
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check if response is 200 and products.length is > 0
        expect(body.responseCode).toBe(200);
        expect(body.products).toBeDefined();
        expect(body.products.length).toBeGreaterThan(0);
    });

    test('try to GET using /api/searchProduct', async ({ request }) => {
        //GET method on searchProduct endpoint
        const response = await request.get('/api/searchProduct', {
            form: {
                search_product: 'top'
            }
        });
        expect(response.status()).toBe(200);//200 status despite unsupported method
        const body = await response.json();

        //check for response code 400 and error message
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });
});