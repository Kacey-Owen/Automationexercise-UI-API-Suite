import { test } from '../../fixtures/api-fixtures';
import { expect } from '@playwright/test';
import { ApiUserDetails, existinguser } from '../../test-data/users';
import { getUserDetailShape } from '../../test-data/params';

test.describe('Positive tests for /api/getUserDetailByEmail', () => {

    test('GET method', async ({ request }) => {
        //get user by email
        const response = await request.get('/api/getUserDetailByEmail', {
            params: {
                email: existinguser.email
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //ensure response code is 200 and object shape is correct
        expect(body.responseCode).toBe(200);
        expect(body.user).toMatchObject(getUserDetailShape);

        //destructure body.user and existinguser to compare
        const {id, ...user1} = body.user;
        const {password, ...user2} = existinguser;
        expect(user1).toEqual(user2);
    });

    test('create an account and get details', async ({ request, createAccount, deleteAccount, verifyLogin }) => {
        //create account
        await createAccount(ApiUserDetails);

        try {
            //get user details
            const response = await request.get('/api/getUserDetailByEmail', {
            params: {
                email: ApiUserDetails.email
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //ensure response code is 200 and object shape is correct
        expect(body.responseCode).toBe(200);
        expect(body.user).toMatchObject(getUserDetailShape);
        
        //destructure body.user and ApiUserDetails and mapping to compare
        //API docs list firstname/lastname/birth_date, but the actual response uses
        //first_name/last_name/birth_day
        //variable names inconsistent between endpoints
        const {id, ...user1} = body.user;
        const {password, mobile_number, firstname, lastname, birth_date, ...temp} = ApiUserDetails;
        const user2 = {
            ...temp,
            first_name: firstname,
            last_name: lastname,
            birth_day: birth_date
        }
        expect(user1).toEqual(user2);

        } finally {
            //cleanup
            await deleteAccount(ApiUserDetails);
        }

        //verify deletion
        const result = await verifyLogin(ApiUserDetails);
        expect(result.responseCode).toBe(404);
        expect(result.message).toBe('User not found!');
    });
});

test.describe('Negative tests for /api/getUserDetailByEmail', () => {

    test('try to GET user detail without parameters', async ({ request }) => {
        //GET with no parameters
        const response = await request.get('/api/getUserDetailByEmail');

        expect(response.status()).toBe(200);//200 despite bad request
        const body = await response.json();

        //expect 400 responseCode and error message
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, email parameter is missing in GET request.');
    });

    test('try to GET with empty strings as parameter', async ({ request }) => {
        //GET with '' as parameters
        const response = await request.get('/api/getUserDetailByEmail', {
            params: {
                email: ''
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //Potential security flaw. GET can get almost all of the info of a random email
        expect(body.responseCode).toBe(200);
        expect(body.user).toEqual(getUserDetailShape);
    });

    test('try to GET a nonexistent email', async ({ request }) => {
        //GET with generated email
        const response = await request.get('/api/getUserDetailByEmail', {
            params: {
                email: `missingUser${Date.now()}@fake.com`
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        expect(body.responseCode).toBe(404);
        expect(body.message).toBe('Account not found with this email, try another email!');
    });

    test('try to POST to /api/getUserDetailByEmail', async ({ request }) => {
        //try to POST
        const response = await request.post('/api/getUserDetailByEmail', {
            params: {
                email: existinguser.email
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });

    test('try to DELETE to /api/getUserDetailByEmail', async ({ request }) => {
        //try to DELETE
        const response = await request.delete('/api/getUserDetailByEmail', {
            params: {
                email: existinguser.email
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });

    test('try to PUT to /api/getUserDetailByEmail', async ({ request }) => {
        //try to PUT
        const response = await request.put('/api/getUserDetailByEmail', {
            params: {
                email: existinguser.email
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });

    test('try to PATCH to /api/getUserDetailByEmail', async ({ request }) => {
        //try to PATCH
        const response = await request.patch('/api/getUserDetailByEmail', {
            params: {
                email: existinguser.email
            }
        });
        expect(response.status()).toBe(405);
        const body = await response.json();

        //Inconsisten with POST/PUT/DELETE: those return HTTP 200
        //with responseCode 405 in body, but PATCH returns real 405
        //status with a "detail" field
        expect(body.detail).toBe('Method "PATCH" not allowed.');
    });

    test('try to GET with invalid email', async ({ request }) => {
        //use notanemail as param
        const response = await request.get('/api/getUserDetailByEmail', {
            params: {
                email: "notanemail"
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();

        //potential security flaw. No validation on email input
        expect(body.responseCode).toBe(200);
        expect(body.user).toEqual(getUserDetailShape);
    });
});