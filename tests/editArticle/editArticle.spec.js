import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { createNewArticle } from '../../src/ui/actions/article/createNewArticle';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';

import { generateNewArticleData } from '../../src/common/testData/generateNewArticleData';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';

import { ARTICLE_ERROR_MESSAGES } from '../../src/ui/constants/articleErrorMessages';

import { CreateArticlePage } from '../../src/ui/pages/article/CreateArticlePage';
import { ViewArticlePage } from '../../src/ui/pages/article/ViewArticlePage';

test.describe('Edit article tests', () => {
  let createArticlePage;
  let viewArticlePage;

  test.beforeEach(async ({ page }) => {
    createArticlePage = new CreateArticlePage(page);
    viewArticlePage = new ViewArticlePage(page);

    const userData = generateNewUserData();

    await signUpUser(page, userData);
  });

  test('Edit the article title for the existing article', async ({
    page,
  }) => {
    const article = generateNewArticleData();
    const updatedTitle = `Updated ${faker.lorem.words(2)} ${Date.now()}`;

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.fillTitleField(updatedTitle);
    await createArticlePage.clickPublishArticleButton();

    await viewArticlePage.assertArticleTitleIsVisible(updatedTitle);
  });

  test('Edit the article description for the existing article', async ({
    page,
  }) => {
    const article = generateNewArticleData();
    const updatedDescription = `${faker.lorem.sentence()} ${Date.now()}`;

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.fillDescriptionField(updatedDescription);
    await createArticlePage.clickPublishArticleButton();

    await viewArticlePage.assertArticleDescriptionIsVisible(
      updatedDescription
    );
  });

  test('Edit the article text for the existing article', async ({
    page,
  }) => {
    const article = generateNewArticleData();
    const updatedText = `${faker.lorem.sentences(2)} ${Date.now()}`;

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.fillTextField(updatedText);
    await createArticlePage.clickPublishArticleButton();

    await viewArticlePage.assertArticleTextIsVisible(updatedText);
  });

  test('Add the tag for the existing article without tags', async ({
    page,
  }) => {
    const article = generateNewArticleData(0);
    const newTag = `new-tag-${Date.now()}`;

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.fillTagsField(newTag);
    await createArticlePage.clickPublishArticleButton();

    await viewArticlePage.assertArticleTagIsVisible(newTag);
  });

  test('Add the tag for the existing article with tags', async ({
    page,
  }) => {
    const article = generateNewArticleData(1);
    const extraTag = `added-tag-${Date.now()}`;

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.fillTagsField(extraTag);
    await createArticlePage.clickPublishArticleButton();

    await viewArticlePage.assertArticleTagIsVisible(article.tags[0]);
    await viewArticlePage.assertArticleTagIsVisible(extraTag);
  });

  test('Remove an article tag for the existing article with tag', async ({
    page,
  }) => {
    const article = generateNewArticleData(1);
    const tagToRemove = article.tags[0];

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.removeTag(tagToRemove);
    await createArticlePage.clickPublishArticleButton();

    await viewArticlePage.assertArticleTagIsNotVisible(tagToRemove);
  });

  test('Remove an article title for the existing article', async ({
    page,
  }) => {
    const article = generateNewArticleData();

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.clearTitleField();
    await createArticlePage.clickPublishArticleButtonForValidation();

    await createArticlePage.assertErrorMessageContainsText(
      ARTICLE_ERROR_MESSAGES.TITLE_EMPTY
    );
  });

  test('Remove an article description for the existing article', async ({
    page,
  }) => {
    const article = generateNewArticleData();

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.clearDescriptionField();
    await createArticlePage.clickPublishArticleButtonForValidation();

    await createArticlePage.assertErrorMessageContainsText(
      ARTICLE_ERROR_MESSAGES.DESCRIPTION_EMPTY
    );
  });

  test('Remove the article text for the existing article', async ({
    page,
  }) => {
    const article = generateNewArticleData();

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();
    await createArticlePage.clearTextField();
    await createArticlePage.clickPublishArticleButtonForValidation();

    await createArticlePage.assertErrorMessageContainsText(
      ARTICLE_ERROR_MESSAGES.BODY_EMPTY
    );
  });

  test('Edit all fields for the existing article', async ({ page }) => {
    const article = generateNewArticleData(1);

    const updatedArticle = {
      title: `Fully Updated ${faker.lorem.words(2)} ${Date.now()}`,
      description: `${faker.lorem.sentence()} ${Date.now()}`,
      text: `${faker.lorem.sentences(2)} ${Date.now()}`,
    };

    const extraTag = `fully-updated-tag-${Date.now()}`;

    await createNewArticle(page, article);

    await viewArticlePage.clickEditArticleButton();

    await createArticlePage.fillTitleField(updatedArticle.title);
    await createArticlePage.fillDescriptionField(
      updatedArticle.description
    );
    await createArticlePage.fillTextField(updatedArticle.text);
    await createArticlePage.fillTagsField(extraTag);

    await createArticlePage.clickPublishArticleButton();

    await viewArticlePage.assertArticleTitleIsVisible(updatedArticle.title);
    await viewArticlePage.assertArticleTextIsVisible(updatedArticle.text);
    await viewArticlePage.assertArticleTagIsVisible(article.tags[0]);
    await viewArticlePage.assertArticleTagIsVisible(extraTag);

    await viewArticlePage.assertArticleDescriptionIsVisible(
      updatedArticle.description
    );
  });
});