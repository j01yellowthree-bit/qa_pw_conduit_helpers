import { expect, test } from '@playwright/test';

export class CreateArticlePage {
  constructor(page) {
    this.page = page;

    this.titleField = page.getByPlaceholder('Article Title');

    this.descriptionField = page.getByPlaceholder(
      "What's this article about?"
    );

    this.textField = page.getByPlaceholder(
      'Write your article (in markdown)'
    );

    this.tagsField = page.getByPlaceholder('Enter tags');

    this.publishArticleButton = page.getByRole('button', {
      name: /(Publish|Update) Article/i,
    });

    this.errorMessage = page.locator('.error-messages');
  }

  async fillTitleField(title) {
    await test.step("Fill the 'Title' field", async () => {
      await this.titleField.fill(title);
    });
  }

  async clearTitleField() {
    await test.step("Clear the 'Title' field", async () => {
      await this.titleField.fill('');
    });
  }

  async fillDescriptionField(description) {
    await test.step("Fill the 'Description' field", async () => {
      await this.descriptionField.fill(description);
    });
  }

  async clearDescriptionField() {
    await test.step("Clear the 'Description' field", async () => {
      await this.descriptionField.fill('');
    });
  }

  async fillTextField(text) {
    await test.step("Fill the 'Text' field", async () => {
      await this.textField.fill(text);
    });
  }

  async clearTextField() {
    await test.step("Clear the 'Text' field", async () => {
      await this.textField.fill('');
    });
  }

  async fillTagsField(tag) {
    await test.step("Fill the 'Tags' field", async () => {
      await this.tagsField.fill(tag);
      await this.tagsField.press('Enter');
    });
  }

  async removeTag(tagName) {
    await test.step(`Remove tag '${tagName}'`, async () => {
      const tagRemoveIcon = this.page
        .locator('.tag-default')
        .filter({ hasText: tagName })
        .locator('i');

      await tagRemoveIcon.click();
    });
  }

  async clickPublishArticleButton() {
    await test.step("Click the 'Publish Article' button", async () => {
      const responsePromise = this.page.waitForResponse(
        (response) => {
          const method = response.request().method();

          return (
            response.url().includes('/api/articles') &&
            ['POST', 'PUT'].includes(method)
          );
        },
        { timeout: 10000 }
      );

      await this.publishArticleButton.click();

      const response = await responsePromise;

      // waitForResponse returns a browser Response, not an APIResponse.
      expect(response.ok()).toBeTruthy();

      await this.page.waitForURL(
        (url) => url.pathname.includes('/article/'),
        { timeout: 10000 }
      );

      // Load the saved article state from the server.
      await this.page.reload();

      await expect(
        this.page.locator('h1').first()
      ).toBeVisible();
    });
  }

  async clickPublishArticleButtonForValidation() {
    await test.step('Submit invalid article data', async () => {
      await this.publishArticleButton.click();

      await expect(this.errorMessage).toBeVisible();
    });
  }

  async assertTitleFieldHasValue(title) {
    await test.step('Assert the title field value', async () => {
      await expect(this.titleField).toHaveValue(title);
    });
  }

  async assertDescriptionFieldHasValue(description) {
    await test.step('Assert the description field value', async () => {
      await expect(this.descriptionField).toHaveValue(description);
    });
  }

  async assertTextFieldHasValue(text) {
    await test.step('Assert the text field value', async () => {
      await expect(this.textField).toHaveValue(text);
    });
  }

  async assertErrorMessageContainsText(messageText) {
    await test.step(`Assert the '${messageText}' error is shown`, async () => {
      await expect(this.errorMessage).toContainText(messageText);
    });
  }
}