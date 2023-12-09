import puppeteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000);

describe("page start", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:8080";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });
    //открыть браузер
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 150,
      devtools: true,
    });

    //просим браузер открыть новую страницу
    page = await browser.newPage();
  }, 10000);



//   test("Form should render on page start", async () => {
//     // await page.goto("http://localhost:9001");
//     await page.goto(baseUrl);

//     await page.waitForSelector(".innogrn-form-widget");
//   });

  test("Form input should add .valid class if inn is valid", async () => {
    await page.goto(baseUrl);

    await page.waitForSelector(".innogrn-form-widget");

    const form = await page.$(".innogrn-form-widget");
    const input = await form.$(".input");
    const submit = await form.$(".submit");

    await input.type("7715964180");
    await submit.click();

    const navbar = await page.$eval(".valid", (el) => (el ? true : false));
    expect(navbar).toBe(true);
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });
});
