import { test, expect } from '@playwright/test';

test.describe('positive tests for /api/brandsList', () => {

    test('check if brands endpoint is working and specific brand is defined', async ({ request }) => {
        //get brands list
        const response = await request.get('/api/brandsList');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check brands count > 0
        expect(body.brands.length).toBeGreaterThan(0);

        //find id 3 and make sure it is defined and has name Madame
        const brand = body.brands.find((b: any ) => b.id === 3);

        expect(brand).toBeDefined();
        expect(brand.brand).toBe('Madame');
    });
});

test.describe('Negative tests for /api/brandsList', () => {
    
    test('check if brandsList endpoint with post method returns 405 status', async ({ request }) => {
        //try to post to brands list
        const response = await request.post('/api/brandsList');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //assert for correct 405 status code and message
        expect(body.responseCode).toBe(405);
        expect(body.message).toContain('This request method is not supported.');
    });

    test('try to PUT to brandsList', async ({ request }) => {
        //try to PUT to /api/brandsList
        const response = await request.put('/api/brandsList');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //verify 405 response code and error message
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });
});