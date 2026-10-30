import { expect } from "@playwright/test";

export const getUserDetailShape = {
    id: expect.any(Number),
    name: expect.any(String),
    email: expect.any(String),
    title: expect.any(String),
    birth_day: expect.any(String),
    birth_month: expect.any(String),
    birth_year: expect.any(String),
    first_name: expect.any(String),
    last_name: expect.any(String),
    company: expect.any(String),
    address1: expect.any(String),
    address2: expect.any(String),
    country: expect.any(String),
    state: expect.any(String),
    city: expect.any(String),
    zipcode: expect.any(String),
}