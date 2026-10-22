import { test, expect } from '@playwright/test';

test.describe('Positive tests for /api/productsList', () => {

    test('check if api is up and running and specific product is defined', async ({ request }) => {
        //get products list
        const response = await request.get('/api/productsList');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check products count > 0
        expect(body.products.length).toBeGreaterThan(0);

        //find product id 3 and assert name is sleeveless dress
        const product = body.products.find((p: any) => p.id === 3);

        expect(product).toBeDefined();
        expect(product.name).toBe('Sleeveless Dress');
    });
});

test.describe('Negative tests for /api/productsList', () => {
    
    test('check if productsList endpoint with post method returns 405 status', async ({ request }) => {
        //try to post to products list
        const response = await request.post('/api/productsList');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //assert for correct 405 status code and message
        expect(body.responseCode).toBe(405);
        expect(body.message).toContain('This request method is not supported.');
    });
});