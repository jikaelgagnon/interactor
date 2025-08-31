import "jest-puppeteer"
import "expect-puppeteer"
import puppeteer, { Browser } from "puppeteer"
import path from "path"

jest.setTimeout(30000) // 30 seconds

const EXTENSION_PATH = path.resolve(__dirname, "../dist")

let browser: Browser
let extensionId: string

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // can also set this to `new`
    pipe: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  })
})

afterAll(async () => {
  await browser.close()
})

test("can message service worker", async () => {
  const page = await browser.newPage()
  await page.goto("https://www.youtube.com/watch?v=ONjc3M6VxXM")
  await page.bringToFront()
  await page.waitForSelector("[monitoring-interactions]")
})
