import puppeteer from "puppeteer";
const URL = `https://www.google.com/`

/**
 * Chowme browser > right click > inspect > input > right click > copy > xPath
 * Use: xpath/<copied xpath>
 */
const selectors = {
    searchInput: `xpath//html/body/div[1]/div[3]/form/div[1]/div[1]/div[1]/div/div[2]/input`,
    closeLogin: `xpath///*[@id="yDmH0d"]/c-wiz/div/div/c-wiz/div/div/div/div[2]/div[2]/button`,
    apiLink: `xpath///*[@id="rso"]/div[1]/div/div/table/tbody/tr[1]/td/div/h3/a`
}

async function waitAndType(page, selector, text) {
    await page.waitForSelector(selector);
    await page.type(selector, text)
}

async function waitAndClick(page, selector) {
    await page.waitForSelector(selector);
    await page.click(selector)
}

async function waitAndClickLink(page, text) {
    const linkHandlers = await page.$x(`//a[contains(text(), '${text}')]`);

    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error("Link not found");
    }
}

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto(URL);
   // await waitAndClick(page, selectors.closeLogin)
    await waitAndType(page, selectors.searchInput, "puppeteer")
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await waitAndClickLink(page, 'API Reference')
}

await main()