import { test } from '@playwright/test';
import { CreateArticlePage } from '../../pages/article/CreateArticlePage';

export async function createNewArticle(page, articleData) {
  await test.step('Create a new article', async () => {
    const createArticlePage = new CreateArticlePage(page);

    const {
      title,
      description,
      text,
      tags = [],
    } = articleData;

    await page.goto('/editor');

    await createArticlePage.fillTitleField(title);
    await createArticlePage.fillDescriptionField(description);
    await createArticlePage.fillTextField(text);

    for (const tag of tags) {
      await createArticlePage.fillTagsField(tag);
    }

    await createArticlePage.clickPublishArticleButton();
  });
}