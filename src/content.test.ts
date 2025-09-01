import "jest-puppeteer"
import "expect-puppeteer"
import puppeteer, { Browser, WebWorker, Target, Page } from "puppeteer"
import path from "path"
import fs from "fs"

jest.setTimeout(30000) // 30 seconds

const EXTENSION_PATH = path.resolve(__dirname, "../dist")

let browser: Browser
let extensionId: string

async function getServiceWorker(browser: Browser): Promise<WebWorker | null> {
  const workerTarget = await browser.waitForTarget(
    (target) => target.type() === "service_worker",
  )
  const worker = await workerTarget.worker()
  return worker
}

async function goToLink(browser: Browser, link: string) {
  const page = await browser.newPage()
  await page.goto(link)
  await page.bringToFront()
  return page
}

const youTubeWatchLink = "https://www.youtube.com/watch?v=l6cZ6zs7dTg&t=499s"
const wikipediaLink = "https://en.wikipedia.org/wiki/Multilayer_perceptron"

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
  // await browser.close()
})

test("applies selectors to specified elements", async () => {
  const page = await goToLink(browser, youTubeWatchLink)
  await page.waitForSelector("[monitoring-interactions]")
})

test("service worker is created", async () => {
  const worker = await getServiceWorker(browser)
  expect(worker).not.toBeNull()
})

test.only("mirror of SessionManager exists in chrome local storage", async () => {
  const page = await goToLink(browser, "https://jikaelgagnon.github.io/")
  page.click(".nav-link[href='/blog/']")
  const worker = await getServiceWorker(browser)
  expect(worker).not.toBeNull()
  // if (worker){
  //   const value = await worker.evaluate(() => {
  //     chrome.storage.local.get(null);
  //   });
  //   console.log(value);
  // }
})
