import { test } from '../../fixtures/api-fixtures';
import { expect } from '@playwright/test';
import { ApiUserDetails } from '../../test-data/users';


test.describe('Positive tests for /api/deleteAccount', () => {

    test('delete an account with email and password', async ({ request, createAccount, verifyLogin }) => {
        //setup test
        await createAccount(ApiUserDetails);

        //try to delete account
        const response = await request.delete('/api/deleteAccount', {
            form: ApiUserDetails
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('Account deleted!');

        const result = await verifyLogin(ApiUserDetails);
        expect(result.responseCode).toBe(404);
        expect(result.message).toBe('User not found!');
    });
});

test.describe('Negative tests for /api/deleteAccount', () => {
    
    test('try to delete without parameters', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            //try to delete without parameters
            const response = await request.delete('/api/deleteAccount');
            expect(response.status()).toBe(200);//200 despite bad request

            const body = await response.json();
            expect(body.responseCode).toBe(400);
            expect(body.message).toBe('Bad request, email parameter is missing in DELETE request.');

            //ensure that account was not deleted
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup after failed delete attempt
            await deleteAccount(ApiUserDetails);
        }
    });

    test('try to delete missing email', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            //try to delete without parameter
            const response = await request.delete('/api/deleteAccount', {
                form: {
                    password: ApiUserDetails.password
                }
            });
            expect(response.status()).toBe(200);//200 despite bad request

            const body = await response.json();
            expect(body.responseCode).toBe(400);
            expect(body.message).toBe('Bad request, email parameter is missing in DELETE request.');

            //ensure that user was not deleted
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup after failed delete attempt
            await deleteAccount(ApiUserDetails);
        }
    });

    test('try to delete missing password', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            //try to delete without parameters
            const response = await request.delete('/api/deleteAccount', {
                form: {
                    email: ApiUserDetails.email
                }
            });
            expect(response.status()).toBe(200);//200 despite bad request

            const body = await response.json();
            expect(body.responseCode).toBe(400);
            expect(body.message).toBe('Bad request, password parameter is missing in DELETE request.');

            //ensure that user was not deleted
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup after failed delete attempt
            await deleteAccount(ApiUserDetails);
        }
    });

    test('try to post to /api/deleteAccount', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            const response = await request.post('/api/deleteAccount', {
                form: ApiUserDetails
            })
            expect(response.status()).toBe(405);//only endpoint so far to have correct response.status()
            const body = await response.json();

            expect(body.detail).toBe('Method "POST" not allowed.');

            //ensure that POST did not delete account
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup
            await deleteAccount(ApiUserDetails);
        }
    });

    test('try to GET to /api/deleteAccount', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            const response = await request.get('/api/deleteAccount', {
                form: ApiUserDetails
            })
            expect(response.status()).toBe(405);//only endpoint so far to have correct response.status()
            const body = await response.json();

            expect(body.detail).toBe('Method "GET" not allowed.');

            //ensure that GET did not delete account
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup
            await deleteAccount(ApiUserDetails);
        }
    });

    test('try to PUT to /api/deleteAccount', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            const response = await request.put('/api/deleteAccount', {
                form: ApiUserDetails
            })
            expect(response.status()).toBe(405);//only endpoint so far to have correct response.status()
            const body = await response.json();

            expect(body.detail).toBe('Method "PUT" not allowed.');

            //ensure that PUT did not delete account
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup
            await deleteAccount(ApiUserDetails);
        }
    });

    test('try to DELETE with empty email string', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create user
        await createAccount(ApiUserDetails);

        try {
            //put empty string in credential
            const response = await request.delete('/api/deleteAccount', {
                form: {
                    ...ApiUserDetails, email: ''
                }
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            expect(body.responseCode).toBe(404);
            expect(body.message).toBe('Account not found!');

            //ensure that account was not deleted
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally { 
            await deleteAccount(ApiUserDetails);
        }
        
    });

    test('try to DELETE with empty password string', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create user
        await createAccount(ApiUserDetails);

        try {
            //put empty string in credential
            const response = await request.delete('/api/deleteAccount', {
                form: {
                    ...ApiUserDetails, password: ''
                }
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            expect(body.responseCode).toBe(404);
            expect(body.message).toBe('Account not found!');

            //ensure that account was not deleted
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally { 
            await deleteAccount(ApiUserDetails);
        }
        
    });

    test('try to DELETE with right email wrong password', async ({ request, createAccount, deleteAccount, verifyLogin}) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            //try to delete with wrong password
            const response = await request.delete('/api/deleteAccount', {
                form: {
                    email: ApiUserDetails.email,
                    password: 'wrong password'
                }
            });
            expect(response.status()).toBe(200);//200 bug again
            const body = await response.json();

            expect(body.responseCode).toBe(404);
            expect(body.message).toBe('Account not found!');

            //ensure that account was not deleted
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup
            await deleteAccount(ApiUserDetails);
        }
    });

    test('try to DELETE with wrong email right password', async ({ request, createAccount, deleteAccount, verifyLogin}) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            //try to delete with wrong password
            const response = await request.delete('/api/deleteAccount', {
                form: {
                    email: 'wrong@email',
                    password: ApiUserDetails.password
                }
            });
            expect(response.status()).toBe(200);//200 bug again
            const body = await response.json();

            expect(body.responseCode).toBe(404);
            expect(body.message).toBe('Account not found!');

            //ensure that account was not deleted
            const verifyRes = await verifyLogin(ApiUserDetails);
            expect(verifyRes.responseCode).toBe(200);
            expect(verifyRes.message).toBe('User exists!');
        } finally {
            //cleanup
            await deleteAccount(ApiUserDetails);
        }
    });
});