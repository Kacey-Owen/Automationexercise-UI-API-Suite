import { test } from '../../fixtures/api-fixtures';
import { expect } from '@playwright/test';
import { ApiUserDetails, existinguser } from '../../test-data/users';

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

test.describe('positive tests for /api/searchProduct', () => {

    test('search for product', async ({ request }) => {
        //search for prdocuts matching "top"
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

    test('search for bad input', async ({ request }) => {

        //search for nonexistant product
        const response = await request.post('/api/searchProduct');
        expect(response.status()).toBe(200);
        const body = await response.json();

        //check if response is 400 and that there are no products 
        expect(body.responseCode).toBe(400);
        expect(body.products).not.toBeDefined();
        expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });
});

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

test.describe('Positive tests for /api/createAccount', () => {

    test('POST to create/register account', async ({ request }) => {
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
            const deleteResponse = await request.delete('/api/deleteAccount', {
                form: {
                    email: ApiUserDetails.email,
                    password: ApiUserDetails.password
                }
            });
            const deleteBody = await deleteResponse.json();
            expect(deleteResponse.status()).toBe(200);
            expect(deleteBody.message).toBe('Account deleted!');
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

    test('try to post with incorrect parameter types', async ({ request }) => {
        //post with incorrect parameters
        const newUser = { ...ApiUserDetails, email: 3211};
        const response = await request.post('/api/createAccount', {
            form: newUser
        });
        const body = await response.json();
        expect(response.status()).toBe(200);

        expect(body.responseCode).toBe(201);
        expect(body.message).toBe('User created!');

        //delete account for cleanup
        const deleteResponse = await request.delete('/api/deleteAccount', {
            form: {
                email: newUser.email,
                password: newUser.password
            }
        });
        const deleteBody = await deleteResponse.json();
        expect(deleteResponse.status()).toBe(200);
        expect(deleteBody.message).toBe('Account deleted!');
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