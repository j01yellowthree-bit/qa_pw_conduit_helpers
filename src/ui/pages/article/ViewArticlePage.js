import { expect, test } from '@playwright/test';

export class ViewArticlePage {
  constructor(page) {
    this.page = page;

    this.articleTitleHeader = page.locator('h1').first();

    this.editArticleButton = page
      .getByRole('link', { name: /Edit Article/ })
      .first();

    this.articleBody = page.locator('.article-content');
    this.tagsList = page.locator('.tag-list');
  }

  async clickEditArticleButton() {
    await test.step("Click the 'Edit Article' button", async () => {
      await this.editArticleButton.click();

      await expect(
        this.page.getByPlaceholder('Article Title')
      ).toBeVisible();
    });
  }

  async assertArticleTitleIsVisible(title) {
    await test.step('Assert the article title', async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleDescriptionIsVisible(description) {
    await test.step('Assert the saved article description', async () => {
      await this.clickEditArticleButton();

      await expect(
        this.page.getByPlaceholder("What's this article about?")
      ).toHaveValue(description);
    });
  }

  async assertArticleTextIsVisible(text) {
    await test.step('Assert the article text', async () => {
      await expect(this.articleBody).toContainText(text);
    });
  }

  async assertArticleTagIsVisible(tagName) {
    await test.step(`Assert the tag '${tagName}' is visible`, async () => {
      await expect(
        this.tagsList.getByText(tagName, { exact: true })
      ).toBeVisible();
    });
  }

  async assertArticleTagIsNotVisible(tagName) {
    await test.step(`Assert the tag '${tagName}' is not visible`, async () => {
      await expect(
        this.tagsList.getByText(tagName, { exact: true })
      ).toHaveCount(0);
    });
  }
}