import "jest-puppeteer"
import "expect-puppeteer"
import puppeteer, { Browser, WebWorker, Target, Page } from "puppeteer"
import path from "path"

jest.setTimeout(30000) // 30 seconds


const EXTENSION_PATH = path.resolve(__dirname, "../dist")

let browser: Browser
let worker: WebWorker | null
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

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // can also set this to `new`
    pipe: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      // '--disable-web-security', //Don't enforce the same-origin policy.
    ],
  })

  await new Promise((resolve) => setTimeout(resolve, 2000));

  worker = await getServiceWorker(browser)
})

afterAll(async () => {
  // await browser.close()
})

test("applies selectors to specified elements", async () => {
  const page = await goToLink(browser, youTubeWatchLink)
  await page.waitForSelector("[monitoring-interactions]")
})

test("service worker is created", async () => {
  expect(worker).not.toBeNull()
})

test("entry created in local storage when accessing monitored tab", async () => {

  expect(worker).not.toBeNull()
  const page = await goToLink(browser, "https://jikaelgagnon.github.io/")

  if (worker){
    const storage = await worker.evaluate(() => {
      return chrome.storage.local.get(null);
    });
    const tabId = await worker.evaluate(() => {
      const queryOptions = { active: true, currentWindow: true };
      // Return the promise directly instead of awaiting
      return chrome.tabs.query(queryOptions).then(([tab]) => tab.id);
    })
    const tabData = storage?.[String(tabId)] ?? null;
    console.log(tabData)
    expect(tabData).not.toBeNull()

  }
})

test("no entry created in local storage when accessing monitored tab", async () => {
  expect(worker).not.toBeNull()
  if (worker){
    const storage = await worker.evaluate(() => {
      return chrome.storage.local.get(null);
    });
    const tabId = await worker.evaluate(() => {
      const queryOptions = { active: true, currentWindow: true };
      // Return the promise directly instead of awaiting
      return chrome.tabs.query(queryOptions).then(([tab]) => tab.id);
    })
    const tabData = storage?.[String(tabId)] ?? null;
    console.log(tabData)
    expect(tabData).toBeNull()

  }
})

// cant get this to work!!!!!!!!!!!!!!!!!!!
// works in manual tests but cant seem to automate it... very annoying

test.only("anchor navigations added to local storage", async () => {
  // const extensionsPage = await browser.newPage();
  // await extensionsPage.goto("chrome://extensions/");
  // await extensionsPage.click("#devMode");
  // await extensionsPage.click("a[title='service worker']")
  // const page = browser.go
  // const page = await goToLink(browser, "https://jikaelgagnon.github.io/");
  const page = await goToLink(browser, "about:blank");
  
  await page.goto("https://jikaelgagnon.github.io", { waitUntil: "networkidle0" });
  await page.bringToFront();

  console.log('Current URL before click:', page.url());

  // Click and wait for SPA navigation (pushState change)
  await Promise.all([
    page.click(".nav-link[href='/blog/']"),
    page.waitForFunction(() => location.pathname === "/blog/", { timeout: 10000 })
  ]);

  console.log('Current URL after click:', page.url());

  expect(worker).not.toBeNull();
  if (worker) {
    const tabId = await worker.evaluate(() => {
      return chrome.tabs.query({ active: true, currentWindow: true })
        .then(([tab]) => tab.id);
    });

    const storage = await worker.evaluate(() => chrome.storage.local.get(null));
    const tabData = storage?.[String(tabId)] ?? null;

    console.log(tabData);
    expect(tabData["documents"].length).not.toBe(0);
  }
});