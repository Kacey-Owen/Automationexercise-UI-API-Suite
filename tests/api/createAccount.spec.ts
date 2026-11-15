import { test } from '../../fixtures/api-fixtures';
import { expect } from '@playwright/test';
import { getApiUserDetails, existingUser } from '../../test-data/users';

test.describe('Positive tests for /api/createAccount', () => {

    test('POST to create/register account', async ({ request, deleteAccount }) => {
        //create user variable
        const user = getApiUserDetails();

        try {
            //POST to /api/createAccount
            const response = await request.post('/api/createAccount', {
                form: user
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //check for success code and message
            expect(body.responseCode).toBe(201);
            expect(body.message).toBe('User created!');
        } finally {
            //delete account for cleanup
            await deleteAccount(user);
        }
    });

    test('Create account and verify using verifyLogin', async ({ request, deleteAccount, verifyLogin }) => {
        //create newUser
        const user = getApiUserDetails();
        const newUser = { ...user, email: `test.${Date.now()}@example.com` };

        try{
            //POST to /api/createAccount
            const response = await request.post('/api/createAccount', {
                form: newUser
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //verify login
            const result = await verifyLogin(newUser);
            expect(result.responseCode).toBe(200);
            expect(result.message).toBe('User exists!');
        } finally {
            //cleanup
            await deleteAccount(newUser);
        }
    });
});

test.describe('Negative tests for /api/createAccount', () => {

    test('/api/createAccount rejects duplicate accounts', async ({ request, createAccount, deleteAccount }) => {
        //create account then try to create the same account after
        const user = getApiUserDetails();
        await createAccount(user);
        try {
            //Post using existing user
            const response = await request.post('/api/createAccount', {
                form: user
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //400 responseCode and error message
            expect(body.responseCode).toBe(400);
            expect(body.message).toBe('Email already exists!');
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });

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
        const user = getApiUserDetails();
        const {email, ...missingEmail} = user;
        const response = await request.post('/api/createAccount', {
            form: missingEmail
        });
        const body = await response.json();

        expect(response.status()).toBe(200); //still 200 status despite bad request
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, email parameter is missing in POST request.');
    });

    test('try to post with incorrect parameter', async ({ request, deleteAccount }) => {
        //create user variables
        const user = getApiUserDetails();
        const newUser = { ...user, email: '3211'};

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
        const user = getApiUserDetails();
        const newUser = { ...user, birth_month: '99'};

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