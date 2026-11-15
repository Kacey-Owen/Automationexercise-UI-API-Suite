import { randomUUID } from "node:crypto";

function getRandomEmail() {
    return `user${randomUUID().slice(0,8)}@website.com`;
}

export type ApiUser = ReturnType<typeof getApiUserDetails>;

export const validUserDetails = {
    fullName: 'Jack Allen',
    email: `user${Date.now()}@website.com`,
    password: 'password123',
    firstName:'Jack',
    lastName: 'Allen',
    address: '123 Random St',
    state: 'Colorado',
    city: 'Random City',
    country: 'United States',
    zipcode: '77777',
    mobileNumber: '5555555555', 
    cardNumber: '0000000000000000',
    cvc: '000',
    expirationMonth: '10',
    expirationYear: '2042'
}

export const getApiUserDetails = () => ({
    name: 'Jack Allen',
    email: getRandomEmail(),
    password: 'password123',
    title: 'Mr',
    birth_date: '31',
    birth_month: '10',
    birth_year: '1985',
    firstname:'Jack',
    lastname: 'Allen',
    company: 'Company Inc.',
    address1: '123 Random St',
    address2: '',
    country: 'United States',
    zipcode: '77777',
    state: 'Colorado',
    city: 'Random City',
    mobile_number: '5555555555'
});

export const invalidUser = {
    email: 'wronguser@website.com',
    password: 'wrongpassword123'
}

export const existingUser = {
    name: 'Fake User',
    email: 'fake123@fake.com',
    title: 'Mr',
    birth_day: '1',
    birth_month: '1',
    birth_year: '2000',
    first_name: 'Fake',
    last_name: 'User',
    company: '',
    address1: '123 random st',
    address2: '',
    country: 'United States',
    state: 'Colorado',
    city: 'Boulder',
    zipcode: '80304',
    password: 'password123'
}