import { test } from '@playwright/test';

import { SignInPage } from '../../src/ui/pages/auth/SignInPage';
import { HomePage } from '../../src/ui/pages/HomePage';

import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';

test('Successful `Sign in` flow test', async ({ page }) => {
  const user = generateNewUserData();

  // Use a lowercase email and a simple test password.
  user.email = user.email.toLowerCase();
  user.password = `TestPass${Date.now()}!`;

  const signInPage = new SignInPage(page);
  const homePage = new HomePage(page);

  await test.step('Register a new user', async () => {
    await signUpUser(page, user);
  });

  await test.step('Clear the authentication state', async () => {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.context().clearCookies();
  });

  await test.step('Open Sign In page', async () => {
    await signInPage.open();
  });

  await test.step('Fill login credentials', async () => {
    await signInPage.fillEmailField(user.email);
    await signInPage.fillPasswordField(user.password);
  });

  await test.step('Submit the login form', async () => {
    await signInPage.clickSignInButton();
  });

  await test.step('Verify successful sign in', async () => {
    await homePage.assertYourFeedTabIsVisible();
  });
});