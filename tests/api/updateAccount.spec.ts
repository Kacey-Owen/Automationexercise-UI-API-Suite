import { test } from '../../fixtures/api-fixtures'
import { expect } from '@playwright/test'
import { ApiUserDetails } from '../../test-data/users';

test.describe('Positive tests for /api/updateAccount', () => {

    test('create account and change one field', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account then make variable for updated info
        await createAccount(ApiUserDetails);

        const newUser = {...ApiUserDetails, name: 'James Sunderland'};

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

            //verify detail was changed
            const result = await getAccount(newUser);
            expect(result.responseCode).toBe(200);
            expect(result.user.name).toEqual(newUser.name);
        } finally {
            //cleanup
            await deleteAccount(ApiUserDetails);
        }
    });

    test('create account and update all fields except email and password', async ({ request, createAccount, deleteAccount, getAccount }) => {
        //create account 
        await createAccount(ApiUserDetails);

        const newUser = {
            name: 'Mary Sunderland',
            email: ApiUserDetails.email,
            password: ApiUserDetails.password,
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
                form: newUser
            });
            expect(response.status()).toBe(200);
            const body = await response.json();

            //expect 200 responseCode and updated message
            expect(body.responseCode).toBe(200);
            expect(body.message).toBe('User updated!');

            //create variables with correct fields to compare
            //api accepts fields like birth_date but returns birth_day, etc
            const result = await getAccount(newUser);
            const {id, ...updatedUser} = result.user;
            const expectedUser = {
                name: newUser.name,
                email: newUser.email,
                title: newUser.title,
                birth_day: newUser.birth_date,
                birth_month: newUser.birth_month,
                birth_year: newUser.birth_year,
                first_name: newUser.firstname,
                last_name: newUser.lastname,
                company: newUser.company,
                address1: newUser.address1,
                address2: newUser.address2,
                country: newUser.country,
                state: newUser.state,
                city: newUser.city,
                zipcode: newUser.zipcode
            }

            //verify details were changed
            expect(result.responseCode).toBe(200);
            expect(updatedUser).toEqual(expectedUser);
        } finally {
            //cleanup
            await deleteAccount(newUser);
        }
    });
});