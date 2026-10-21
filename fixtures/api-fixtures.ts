import { test as base, expect } from '@playwright/test';
import { ApiUserDetails } from '../test-data/users';

type ApiFixtures = {
    createAccount: (account: typeof ApiUserDetails) => Promise<void>;
    deleteAccount: (account: { email: string; password: string }) => Promise<void>;
    verifyLogin: (account: { email: string; password: string }) => Promise<{
        responseCode: number;
        message: string;
    }>;
}

export const test = base.extend<ApiFixtures>({
    createAccount: async ({ request }, use ) => {

        const createAccount = async (account: typeof ApiUserDetails): Promise<void> => {
            const response = await request.post('/api/createAccount', {
                form: account
            });
            expect(response.status(), 'setup: createAccount failed').toBe(200);
            const body = await response.json();

            expect(body.responseCode, 'setup: createAccount failed').toBe(201);
            expect(body.message, 'setup: createAccount failed').toBe('User created!');
        }

        await use(createAccount);

    },

    deleteAccount: async ({ request }, use ) => {

        const deleteAccount = async (account: { email: string, password: string }): Promise<void> => {
            const response = await request.delete('/api/deleteAccount', {
                form: {
                    email: account.email,
                    password: account.password
                }
            });
            expect(response.status(), 'clean up: deleteAccount failed').toBe(200);
            const body = await response.json();

            expect(body.responseCode, 'clean up: deleteAccount failed').toBe(200);
            expect(body.message, 'clean up: deleteAccount failed').toBe('Account deleted!');
        };

        await use(deleteAccount);
    },

    verifyLogin: async ({ request }, use ) => {

        const verifyLogin = async (account: { email: string, password: string }): Promise<{responseCode: number, message: string}> => {
            const response = await request.post('/api/verifyLogin', {
                form: account
            });
            expect(response.status(), 'check up: verifyLogin failed').toBe(200);
            const body = await response.json();

            return {
                responseCode: body.responseCode,
                message: body.message,
            };

        };

        await use(verifyLogin);
    },
});