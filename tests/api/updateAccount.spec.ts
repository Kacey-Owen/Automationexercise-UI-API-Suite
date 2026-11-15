import { test } from '../../fixtures/api-fixtures'
import { expect } from '@playwright/test'
import { getApiUserDetails } from '../../test-data/users';
import { getExpectedUser } from '../../test-data/ExpectedUser';

test.describe('Positive tests for /api/updateAccount', () => {

    test('create account and change one field', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account then make variable for updated info
        const user = getApiUserDetails();
        await createAccount(user);

        const newUser = {...user, name: 'James Sunderland'};

        try {
            //update account
            const response = await request.put('/api/updateAccount', {
                form: newUser
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //expect 200 code and positive message
            expect(body.responseCode).toBe(200);
            expect(body.message).toBe('User updated!');

            //create variables with correct fields to compare
            //api accepts fields like birth_date but returns birth_day, etc
            const result = await getAccount(newUser);
            expect(result.responseCode).toBe(200);

            const {id, ...actualUser} = result.user;
            const expectedUser = getExpectedUser(newUser);
            expect(actualUser).toEqual(expectedUser);
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });

    test('create account and update all fields except email and password', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account
        const user = getApiUserDetails();
        await createAccount(user);

        const newUserDetails = {
            name: 'Mary Sunderland',
            email: user.email,
            password: user.password,
            title: 'Mrs',
            birth_date: '28',
            birth_month: '02',
            birth_year: '1983',
            firstname:'Mary',
            lastname: 'Sunderland',
            company: 'Restless Co.',
            address1: '456 Random',
            address2: 'St',
            country: 'France',
            zipcode: '55555',
            state: 'Normandic Region',
            city: 'Rouen',
            mobile_number: '8888888888'
        };

        try {
            //update account
            const response = await request.put('/api/updateAccount', {
                form: newUserDetails
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //expect 200 responseCode and updated message
            expect(body.responseCode).toBe(200);
            expect(body.message).toBe('User updated!');

            //create variables with correct fields to compare
            //api accepts fields like birth_date but returns birth_day, etc
            const result = await getAccount(newUserDetails);
            const {id, ...actualUser} = result.user;
            const expectedUser = getExpectedUser(newUserDetails);

            //verify details were changed
            expect(result.responseCode).toBe(200);
            expect(actualUser).toEqual(expectedUser);
        } finally {
            //cleanup
            await deleteAccount(newUserDetails);
        }
    });

    test('EDGE CASE: update with only email and password succeeds and leaves account unchanged', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account
        const user = getApiUserDetails();
        await createAccount(user);

        try {
            //try to update with only email and password parameters
            //don't need to actually update anything
            //spec doesn't define this case
            const response = await request.put('/api/updateAccount', {
                form: {
                    email: user.email,
                    password: user.password
                }
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //expect 200 responseCode and updated message
            expect(body.responseCode).toBe(200);
            expect(body.message).toBe('User updated!');

            //see if account details still match
            const result = await getAccount(user);
            expect(result.responseCode).toBe(200);

            const {id, ...actualUser} = result.user;
            const expectedUser = getExpectedUser(user);
            expect(actualUser).toEqual(expectedUser);
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });
});

test.describe('Negative tests for /api/updateAccount', () => {

    test('try to update with an empty body', async ({ request, createAccount, deleteAccount}) => {
        //create account
        const user = getApiUserDetails();
        await createAccount(user);

        try {
            //pass no params to api
            const response = await request.put('/api/updateAccount');
            expect(response.status()).toBe(200);//200 despite bad request
            const body = await response.json();

            //expect 400 responseCode and bad request message
            expect(body.responseCode).toBe(400);
            expect(body.message).toBe('Bad request, email parameter is missing in PUT request.');
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });

    test('try to update with a missing password', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account
        const user = getApiUserDetails();
        await createAccount(user);

        const { password, ...userWithoutPassword } = user;

        try {
            //pass only email param to api
            const response = await request.put('/api/updateAccount', {
                form: { ...userWithoutPassword, name: 'John Doe' }
            });
            expect(response.status()).toBe(200);//200 despite bad request
            const body = await response.json();

            //expect 400 responseCode and bad request message
            expect(body.responseCode).toBe(400);
            expect(body.message).toBe('Bad request, password parameter is missing in PUT request.');

            //create variables with correct fields to compare
            //api accepts fields like birth_date but returns birth_day, etc
            const result = await getAccount(userWithoutPassword);
            expect(result.responseCode).toBe(200);

            const {id, ...actualUser} = result.user;
            const expectedUser = getExpectedUser(userWithoutPassword);
            expect(actualUser).toEqual(expectedUser);
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });

    test('try to update with a missing email', async ({ request, createAccount, deleteAccount}) => {
        //create account
        const user = getApiUserDetails();
        await createAccount(user);

        try {
            //pass only password param to api
            const response = await request.put('/api/updateAccount', {
                form: {
                    password: user.password
                }
            });
            expect(response.status()).toBe(200);//200 despite bad request
            const body = await response.json();

            //expect 400 responseCode and bad request message
            expect(body.responseCode).toBe(400);
            expect(body.message).toBe('Bad request, email parameter is missing in PUT request.');
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });

    test('try to update with wrong password', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account
        const user = getApiUserDetails();
        await createAccount(user);

        try {
            //try to update with wrong password
            const response = await request.put('/api/updateAccount', {
                form: { ...user, password: 'incorrectpassword', name: 'John Doe'}
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //expect 404 responseCode and account not found message
            expect(body.responseCode).toBe(404);
            expect(body.message).toBe('Account not found!');

            //check that nothing was actually updated
            const result = await getAccount(user);
            expect(result.user.name).toBe(user.name);
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });

    test('try to update with nonexistent email', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account
        const user = getApiUserDetails();
        await createAccount(user);

        try {
            //try to update with nonexistent email
            const response = await request.put('/api/updateAccount', {
                form: { ...user, email: 'nonexistentemail@example.com', name: 'John Doe'}
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //expect 404 responseCode and account not found message
            expect(body.responseCode).toBe(404);
            expect(body.message).toBe('Account not found!');

            //check that nothing was actually updated
            const result = await getAccount(user);
            expect(result.user.name).toBe(user.name);
        } finally {
            //cleanup
            await deleteAccount(user);
        }
    });
});