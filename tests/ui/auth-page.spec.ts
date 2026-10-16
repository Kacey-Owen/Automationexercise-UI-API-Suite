import { test, expect } from '@playwright/test';
import { AuthPage, SignupPage } from '../../pages/AuthPage';
import { validUserDetails, invalidUser, existinguser } from '../../test-data/users';
import { HomePage } from '../../pages/HomePage';

let authPage: AuthPage;
let signupPage: SignupPage;

test.beforeEach(async ({ page }) => {

    //block google popups
        await page.route(
            '**/*',
            (route) => {
                const url = route.request().url();
                if (url.includes('googlesyndication') || 
                    url.includes('doubleclick') || 
                    url.includes('googleadservices') || 
                    url.includes('pagead')) {
                    return route.abort();
                }
                return route.continue();
            }
        );

    //navigate to auth page every test
    authPage = new AuthPage(page);
    await authPage.goto();
});

test.describe('Happy Paths', () => {
    
    test('check if auth page is visible', async ({ page }) => {
        //get headers
        const loginMessage = authPage.getHeader('Login to your account');
        const signupMessage = authPage.getHeader('New User Signup!');

        //check for correct url and login and signup messages
        await expect(page).toHaveURL('/login');
        await expect(loginMessage).toHaveText('Login to your account');
        await expect(signupMessage).toHaveText('New User Signup!');
    });

    test('check sign up form works', async ({ page }) => {
        //fill in signup textboxes
        await authPage.signupEmail.fill(validUserDetails.email);
        await authPage.signupName.fill(validUserDetails.fullName);
        await authPage.signupBtn.click();

        //create signup page instance after navigating to signup page
        signupPage = new SignupPage(page);

        //fill in sign up form with user info
        await signupPage.fillUserInfo();
        await signupPage.createAccountBtn.click();

        //check if url and confirmation message are correct
        const creationMsg = signupPage.getHeader('Account Created!');
        await expect(creationMsg).toHaveText('Account Created!');
        await expect(page).toHaveURL('/account_created');

        //delete account to avoid orphan accounts
        await signupPage.continueBtn.click();
        let homePage = new HomePage(page);
        await homePage.deleteAccLink.click();
    });

    test('check log in form works', async ({ page }) => {
        //fill in login textboxes
        await authPage.loginEmail.fill(existinguser.email);
        await authPage.loginPassword.fill(existinguser.password);
        await authPage.loginBtn.click();

        //create home page instance
        const homePage = new HomePage(page);

        //check if url is redirected to home page and logout button is showing
        await expect(page).toHaveURL('/');
        await expect(homePage.logOutNavLink).toHaveText('Logout');
    });

    test('check log out button works after logging in', async ({ page }) => {
        //fill in login textboxes
        await authPage.loginEmail.fill(existinguser.email);
        await authPage.loginPassword.fill(existinguser.password);
        await authPage.loginBtn.click();

        //create home page instance
        const homePage = new HomePage(page);

        //check if log out button works and redirects back to auth page
        await homePage.logOutNavLink.click();
        await expect(page).toHaveURL('/login');
        await expect(authPage.getHeader('Login to your account')).toHaveText('Login to your account');
    });
});

test.describe('Negative Paths', () => {

    test('check if invalid user login shows error', async ({ page }) => {
        //fill in login textboxes
        await authPage.loginEmail.fill(invalidUser.email);
        await authPage.loginPassword.fill(invalidUser.password);
        await authPage.loginBtn.click();

        //get incorrect user info text
        const errorText = page.getByText('Your email or password is incorrect!');

        //check if url is still on loginpage and correct message is showing
        await expect(page).toHaveURL('/login');
        await expect(errorText).toHaveText('Your email or password is incorrect!');
    });

    test('check for error with empty textboxes', async ({ page }) => {
        //don't fill in textboxes
        await authPage.loginBtn.click();

        //check if url is still on loginpage, email field is focused, and html has required attribute
        await expect(page).toHaveURL('/login');
        await expect(authPage.loginEmail).toBeFocused();
        await expect(authPage.loginEmail).toHaveAttribute('required');
    });

    test('check if incorrect sign up info is accepted without validation', async ({ page }) => {
        //fill textboxes with random input but correct format
        await authPage.signupName.fill('fake');
        await authPage.signupEmail.fill('fake123@fake');//invalid email format
        await authPage.signupBtn.click();

        //get sign up page instance
        const signupPage = new SignupPage(page);

        //expect email to be accepted without validation
        await expect(page).toHaveURL('/signup');
        await expect(signupPage.getHeader('Enter Account Information')).toHaveText('Enter Account Information');
    });

    test('check if sign up with already registered email shows error', async ({ page }) => {
        //fill textboxes with already registered user
        await authPage.signupName.fill(existinguser.name);
        await authPage.signupEmail.fill(existinguser.email);
        await authPage.signupBtn.click();

        //check if error message shows
        await expect(page).toHaveURL('/signup');//page still redirects to signup page
        await expect(page.getByText('Email Address already exist!')).toBeVisible();
        await expect(authPage.loginEmail).toBeVisible();//still shows login page despite url
    });
});