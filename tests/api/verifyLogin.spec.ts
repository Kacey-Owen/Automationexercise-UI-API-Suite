import { test, expect } from '@playwright/test';
import { existinguser } from '../../test-data/users';

test.describe('Positive tests for /api/verifyLogin', () => {

    test('Post to verify login with valid details', async ({ request }) => {
        //post with valid email and password
        const response = await request.post('/api/verifyLogin', {
            form: {
                email: existinguser.email,
                password: existinguser.password
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //verify 200 code and user exists message
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User exists!');
    });
});

test.describe('Negative tests for /api/verifyLogin', () => {

    test('Post to verify login without email parameter', async ({ request }) => {
        //try to post without email
        const response = await request.post('/api/verifyLogin', {
            form: {
                password: existinguser.password
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //verify 400 response code and bad request message
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    test('Post to verify login without parameters', async ({ request }) => {
        //try to post to verify login without parameters
        const response = await request.post('/api/verifyLogin');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //verify 400 response code and bad request message
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    test('Try to DELETE to verify login', async ({ request }) => {
        //try to delete to /api/verifyLogin
        const response = await request.delete('/api/verifyLogin');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check for 405 response code and error message
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });
});