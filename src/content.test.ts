import "jest-puppeteer";
import "expect-puppeteer";

describe("Google Homepage", (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto("https://google.com");
  });

  it('should display "google" text on page', async (): Promise<void> => {
    await expect(page).toMatchTextContent(/Google/);
  });
});