import "jest-puppeteer"
import "expect-puppeteer"
import puppeteer, { Browser, WebWorker, GoToOptions } from "puppeteer"
import path from "path"

jest.setTimeout(30000) // 30 seconds


const EXTENSION_PATH = path.resolve(__dirname, "../dist")

let BROWSER: Browser;
let SERVICE_WORKER: WebWorker | null
const YOUTUBE_WATCH_LINK = "https://www.youtube.com/watch?v=l6cZ6zs7dTg&t=499s"
const PERSONAL_SITE_LINK = "https://jikaelgagnon.github.io/"
const WIKIPEDIA_LINK = "https://en.wikipedia.org/wiki/Multilayer_perceptron"

async function getServiceWorker(browser: Browser): Promise<WebWorker | null> {
  const workerTarget = await browser.waitForTarget(
    (target) => target.type() === "service_worker",
  )
  const worker = await workerTarget.worker()
  return worker
}

async function goToLink(browser: Browser, link: string, options: GoToOptions = {}) {
  const page = await browser.newPage()
  await page.goto(link, options)
  await page.bringToFront()
  return page
}

function getCurrentTabId() {
      const queryOptions = { active: true, currentWindow: true };
      // Return the promise directly instead of awaiting
      return chrome.tabs.query(queryOptions).then(([tab]) => tab.id);
}

beforeAll(async () => {
  BROWSER = await puppeteer.launch({
    headless: true, // can also set this to `new`
    pipe: true,
    // dumpio: true,
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
    ],
  })

  await new Promise((resolve) => setTimeout(resolve, 2000));

  SERVICE_WORKER = await getServiceWorker(BROWSER)
})

afterEach(async () => {
  const pages = await BROWSER.pages();
  await Promise.all(pages.map(page => page.close()));
});


afterAll(async () => {
  await SERVICE_WORKER?.close();
  await BROWSER.close()
})

test("applies selectors to specified elements", async () => {
  const page = await goToLink(BROWSER, YOUTUBE_WATCH_LINK)
  await page.waitForSelector("[monitoring-interactions]")
})

test("service worker is created", async () => {
  expect(SERVICE_WORKER).not.toBeNull()
})

test("entry created in local storage when accessing monitored tab", async () => {
  const page = await goToLink(BROWSER, PERSONAL_SITE_LINK, { waitUntil: "networkidle0" });  
  await page.bringToFront();


  expect(SERVICE_WORKER).not.toBeNull();
  if (SERVICE_WORKER) {
    const tabId = await SERVICE_WORKER.evaluate(getCurrentTabId);
    const storage = await SERVICE_WORKER.evaluate(() => chrome.storage.local.get(null));
    const tabData = storage?.[String(tabId)] ?? null;
    console.log(tabData);
    expect(tabData).not.toBeNull();
  }
})

test("no entry created in local storage when accessing monitored tab", async () => {
  await goToLink(BROWSER, WIKIPEDIA_LINK)
  if (SERVICE_WORKER){
    const storage = await SERVICE_WORKER.evaluate(() => {
      return chrome.storage.local.get(null);
    });
    const tabId = await SERVICE_WORKER.evaluate(getCurrentTabId)
    const tabData = storage?.[String(tabId)] ?? null;
    console.log(tabData)
    expect(tabData).toBeNull()

  }
})

test("anchor navigations added to local storage", async () => {
  const page = await goToLink(BROWSER, PERSONAL_SITE_LINK, { waitUntil: "networkidle0" });  
  await page.bringToFront();

  console.log('Current URL before click:', page.url());

  // Click and wait for SPA navigation (pushState change)
  await Promise.all([
    page.click(".nav-link[href='/blog/']"),
    page.waitForFunction(() => location.pathname === "/blog/", { timeout: 10000 })
  ]);

  console.log('Current URL after click:', page.url());

  expect(SERVICE_WORKER).not.toBeNull();
  if (SERVICE_WORKER) {
    const tabId = await SERVICE_WORKER.evaluate(getCurrentTabId);
    const storage = await SERVICE_WORKER.evaluate(() => chrome.storage.local.get(null));
    const tabData = storage?.[String(tabId)] ?? null;
    console.log(tabData);
    expect(tabData["documents"].length).not.toBe(0);
  }
});

test("anchor clicks and navigations added to local storage", async () => {
  const page = await goToLink(BROWSER, PERSONAL_SITE_LINK, { waitUntil: "networkidle0" });  
  await page.bringToFront();

  console.log('Current URL before click:', page.url());

  // Click and wait for SPA navigation (pushState change)
  await Promise.all([
    page.click(".nav-link[href='/blog/']"),
    page.waitForFunction(() => location.pathname === "/blog/", { timeout: 10000 })
  ]);

  console.log('Current URL after click:', page.url());

  expect(SERVICE_WORKER).not.toBeNull();
  if (SERVICE_WORKER) {
    const tabId = await SERVICE_WORKER.evaluate(getCurrentTabId);
    const storage = await SERVICE_WORKER.evaluate(() => chrome.storage.local.get(null));
    const tabData = storage?.[String(tabId)] ?? null;
    console.log(tabData);
    expect(tabData["documents"].length).not.toBe(0);
    expect(tabData["documents"][0]["activityType"]).toBe("Interaction")
    expect(tabData["documents"][1]["activityType"]).toBe("State Change")
  }
});

test("session removed from local storage after tab close", async () => {
  const page = await goToLink(BROWSER, PERSONAL_SITE_LINK, { waitUntil: "networkidle0" });  
  await page.bringToFront();

  console.log('Current URL before click:', page.url());

  // Click and wait for SPA navigation (pushState change)
  await Promise.all([
    page.click(".nav-link[href='/blog/']"),
    page.waitForFunction(() => location.pathname === "/blog/", { timeout: 10000 })
  ]);

  console.log('Current URL after click:', page.url());

  expect(SERVICE_WORKER).not.toBeNull();
  if (SERVICE_WORKER) {
    const tabId = await SERVICE_WORKER.evaluate(getCurrentTabId);
    await page.close()
    const storage = await SERVICE_WORKER.evaluate(() => chrome.storage.local.get(null));
    const tabData = storage?.[String(tabId)] ?? null;
    expect(tabData).toBe(null)
  }
});

test("session removed from local storage after changing to untracked page", async () => {
  const page = await goToLink(BROWSER, PERSONAL_SITE_LINK, { waitUntil: "networkidle0" });  
  await page.bringToFront();

  console.log('Current URL before click:', page.url());

  // Click and wait for SPA navigation (pushState change)
  await Promise.all([
    page.click(".nav-link[href='/blog/']"),
    page.waitForFunction(() => location.pathname === "/blog/", { timeout: 10000 })
  ]);

  console.log('Current URL after click:', page.url());

  await page.goto(WIKIPEDIA_LINK, { waitUntil: "networkidle0" })

  expect(SERVICE_WORKER).not.toBeNull();
  if (SERVICE_WORKER) {
    const tabId = await SERVICE_WORKER.evaluate(getCurrentTabId);
    const storage = await SERVICE_WORKER.evaluate(() => chrome.storage.local.get(null));
    const tabData = storage?.[String(tabId)] ?? null;
    expect(tabData).toBe(null)
  }
});

test("browser back button button counts as navigation", async () => {
  const page = await goToLink(BROWSER, PERSONAL_SITE_LINK, { waitUntil: "networkidle0" });  
  await page.bringToFront();

  // Click and wait for SPA navigation (pushState change)
  await Promise.all([
    page.evaluate(() => history.pushState({}, "", "/teaching/")),
    page.waitForFunction(() => location.pathname === "/teaching/", { timeout: 10000 })
  ]);

  console.log('Current URL after click:', page.url());

  await Promise.all([
    page.goBack(),
    page.waitForFunction(() => location.pathname === "/", { timeout: 10000 })
  ]);

  console.log('Current URL after goBack:', page.url())

  expect(SERVICE_WORKER).not.toBeNull();
  if (SERVICE_WORKER) {
    const tabId = await SERVICE_WORKER.evaluate(getCurrentTabId);
    const storage = await SERVICE_WORKER.evaluate(() => chrome.storage.local.get(null));
    const tabData = storage?.[String(tabId)] ?? null;
    console.log(tabData["documents"])
    expect(tabData).not.toBe(null)
    expect(tabData["documents"].length).toBe(3);
    expect(tabData["documents"][0]["activityType"]).toBe("State Change")
    expect(tabData["documents"][1]["activityType"]).toBe("Traversal")
    expect(tabData["documents"][2]["activityType"]).toBe("State Change")
  }
});

