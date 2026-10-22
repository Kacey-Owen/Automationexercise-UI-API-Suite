import { test } from '../../fixtures/api-fixtures';
import { expect } from '@playwright/test';
import { ApiUserDetails } from '../../test-data/users';

test.describe('Positive tests for /api/createAccount', () => {

    test('POST to create/register account', async ({ request, deleteAccount }) => {
        try {
            //POST to /api/createAccount
            const response = await request.post('/api/createAccount', {
                form: ApiUserDetails
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //check for success code and message
            expect(body.responseCode).toBe(201);
            expect(body.message).toBe('User created!');
        } finally {
            //delete account for cleanup
            await deleteAccount(ApiUserDetails);
        }
    });
});

test.describe('Negative tests for /api/createAccount', () => {

    test('Try to post without parameters', async ({ request }) => {
        //post without parameters
        const response = await request.post('/api/createAccount');
        const body = await response.json();
        expect(response.status()).toBe(200);

        //verify response code and error message
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, name parameter is missing in POST request.');
    });

    test('try to post with incomplete parameters', async ({ request }) => {
        //post with destructured object
        const {email, ...missingEmail} = ApiUserDetails;
        const response = await request.post('/api/createAccount', {
            form: missingEmail
        });
        const body = await response.json();

        expect(response.status()).toBe(200); //still 200 status despite bad request
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, email parameter is missing in POST request.');
    });

    test('try to post with incorrect parameter', async ({ request, deleteAccount }) => {
        
        const newUser = { ...ApiUserDetails, email: '3211'};

        try {
            //post with incorrect parameters
            const response = await request.post('/api/createAccount', {
                form: newUser
            });
            const body = await response.json();
            expect(response.status()).toBe(200);

            expect(body.responseCode).toBe(201);
            expect(body.message).toBe('User created!');
        } finally {
            //cleanup
            await deleteAccount(newUser);
        }
    });

    test('try to post with month = 99', async ({ request, deleteAccount, verifyLogin  }) => {
        //create test user credentials
        const newUser = { ...ApiUserDetails, birth_month: '99'};

        try {
            //try post with month = 99
            const response = await request.post('/api/createAccount', {
                form: newUser
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            expect(body.responseCode).toBe(201);
            expect(body.message).toBe('User created!');
        } finally {
            //cleanup
            await deleteAccount(newUser);
        }
        
        //verify account deletion
        const result = await verifyLogin(newUser);
        expect(result.responseCode).toBe(404);
        expect(result.message).toBe('User not found!');
    });
});