import { test } from '@playwright/test';

import { HomePage } from '../../src/ui/pages/HomePage';
import { CreateArticlePage } from '../../src/ui/pages/article/CreateArticlePage';

import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';

import { ARTICLE_ERROR_MESSAGES } from '../../src/ui/constants/articleErrorMessages';

test.describe('Create article without required fields', () => {
  let homePage;
  let createArticlePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    createArticlePage = new CreateArticlePage(page);

    const userData = generateNewUserData();

    await signUpUser(page, userData);
  });

  test('Create an article without required fields', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.clickPublishArticleButtonForValidation();

    await createArticlePage.assertErrorMessageContainsText(
      ARTICLE_ERROR_MESSAGES.TITLE_EMPTY
    );
  });
});