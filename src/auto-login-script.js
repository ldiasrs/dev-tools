import { launch } from "puppeteer";
import { getCustomer, debug } from "./helpers.js";

const selectors = {
  page: {
    getStart: "[data-testid=LayoutB-Content]",
    phone: "[data-testid=LayoutA-Content]",
  },
  buttons: {
    dissmisTestAlert: "#__next > div.SandboxBannerstyled__Container-sc-1m8844-0.gsNrFq > div.SandboxBannerstyled__Content-sc-1m8844-1.SandboxBannerstyled__ContentButton-sc-1m8844-2.gJBCMd.iGJYkl > button",
    dissmisTestAlertLocal: "#__next > div.SandboxBannerstyled__Container-sc-1m8844-0.gPzDyC > div.SandboxBannerstyled__Content-sc-1m8844-1.SandboxBannerstyled__ContentButton-sc-1m8844-2.gJBCMd.jdaLHp > button",
    getStart: "//button[contains(., 'started')]",
    proceedWithouPhone: "//button[contains(., 'PROCEED')]",
    proceedWithouPhoneConfirmation: "//button[contains(., 'PROCEED')]",
    customerConfirmFirstSection: "[data-testid=section-button]",
    customerConfirmForm: "[data-testid=section-button]",
  },
  inputs: {
    firstName: "#firstName",
    lastName: "#lastName",
    birthDate: "#birthDate",
    city: "#city",
    address: "#address",
    zipCode: "#zipCode",
    ssNumber: "#ssNumber",
    phone: "#phone",
    email: "#email",
    memberid: "#memberId",
    annualIncome: "#annualIncome",
    monthlyIncome: "#monthlyIncome",
    jobTitle: "#jobTitle",
    employerName: "#employerName",
    monthsAtEmployer: "#monthsAtEmployer",
    housingPayment: "#housingPayment",
    VIN: "collateral.vin",
  },
  selects: {
    state: "#state",
    loggedUser :"[data-testid=customer-menu-button]",
    housingType: "#housingType",
    housingTypeItem :"div.styles__DesktopBoundary-sc-g4gvh0-0.fIVhiE > div > div > div.LayoutAstyled__ContentStyled-sc-1dlr617-1.cqDLrj > div > form > div > div.Sectionsstyled__Section-sc-n2qm2n-1.bwIHd > div.Selectstyled__ComponentContainer-sc-1stjsqp-3.fDiCDq > div > select > option:nth-child(1)",
    employmentItem :"#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(3)",
    employmentStatus: "#employmentStatus",
    citizenship: "#citizenship",
  },
};

async function purchase(page) {
  debug("Purchase");
  await page.goto(`${URL}/purchase`);
  const iKnowMyVinLink = `xpath///*[@id="__next"]/div[2]/div/div/div[3]/form/div/div[2]/div[1]/div[1]/p`;
  await page.waitForSelector(iKnowMyVinLink);
  await page.click(iKnowMyVinLink);
  const VIN_Input = `xpath///*[@id="__next"]/div[2]/div/div/div[3]/form/div/div[2]/div[1]/div[2]/div/div/div/div/div/div/div/input`;
  await page.waitForSelector(VIN_Input);
  await page.type(VIN_Input, "JTND4RBE8L3089611");
  await page.waitForTimeout(500);
  const mileageInput = `xpath///*[@id="__next"]/div[2]/div/div/div[3]/form/div/div[2]/div[4]/div[4]/div[1]/div/input`;
  const input = await page.waitForSelector(mileageInput);
  await input.click({ clickCount: 3 });
  await page.type(mileageInput, "1000");
  const amountInput = `xpath///*[@id="amount"]`;
  await page.waitForSelector(amountInput);
  await page.type(amountInput, "29000");
}

async function formSecondSection(page) {
  debug("Form second section");
  if (checkAnnualIncome()) {
    await page.waitForSelector(selectors.inputs.annualIncome);
    await page.type(selectors.inputs.annualIncome, customer.annualIncome);
  } 
  else {
    const monthlyIncome = (Number(customer.annualIncome) / 12).toString();
    debug(`--> usingMonthlyIncome: ${monthlyIncome}`);
    await page.waitForSelector(selectors.inputs.monthlyIncome);
    await page.type(selectors.inputs.monthlyIncome, monthlyIncome);
  }
  if (checkJobTitle()) {
    await page.type(selectors.inputs.jobTitle, customer.jobTitle);
  }
  await page.type(selectors.inputs.employerName, customer.employerName);
  await page.type(selectors.inputs.monthsAtEmployer, customer.monthsAtEmployer);
  await page.type(selectors.inputs.housingPayment, customer.housingPayment);
  if (checkEmploymentStatus()) {
    await page.click(selectors.selects.employmentStatus);
    await page.click(selectors.selects.employmentItem);
    await page.waitForTimeout(500);
  }
  await page.click(selectors.selects.housingType);
  await page.waitForTimeout(500);
  await page.click(selectors.buttons.customerConfirmForm);
  await page.click(selectors.buttons.customerConfirmForm);

  await page.waitForSelector(selectors.selects.loggedUser, { timeout: 60000 });
}

async function formFirstSection(page) {
  debug("Form first section");
  await page.waitForSelector(selectors.inputs.firstName);
  await page.type(selectors.inputs.firstName, customer.firstName);
  await page.type(selectors.inputs.lastName, customer.lastName);
  await page.type(selectors.inputs.birthDate, customer.birthDate);
  await page.type(selectors.inputs.address, customer.address);
  await page.type(selectors.inputs.city, customer.city);
  await page.click(selectors.selects.state);

  const stateToBeSelected = `[data-value="${customer.state}"]`;
  await page.click(stateToBeSelected);

  await page.type(selectors.inputs.zipCode, customer.zipCode);
  await page.type(selectors.inputs.ssNumber, customer.ssNumber);
  await page.type(selectors.inputs.phone, customer.phone);
  await page.type(selectors.inputs.email, customer.email);
  await page.waitForTimeout(200);
  if (checkCitizenship()) {
    await page.waitForSelector("#citizenship");
    await page.click("#citizenship");
    await page.waitForTimeout(200);
    await page.click("#citizenship");
    const item =
      "#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)";
    await page.waitForSelector(item);
    await page.click(item);
  }
  await page.waitForTimeout(500);
  await page.click(selectors.buttons.customerConfirmFirstSection);
}

async function phonePage(page) {
  debug("Phone page");
  await page.waitForSelector(selectors.page.phone);
  const [proceedBtn] = await page.$x(selectors.buttons.proceedWithouPhone);
  if (proceedBtn) {
    await proceedBtn.click();
  }

  if (checkConfirmationProceedPhone()) {
    await page.waitForSelector('body > div.MuiDialog-root.ManualInformationDialogstyled__Dialog-sc-y0uhnu-0.InmEV > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > h2')
    await page.click('body > div.MuiDialog-root.ManualInformationDialogstyled__Dialog-sc-y0uhnu-0.InmEV > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div.DialogActionsstyled__DialogActionsWrapper-sc-ouithx-0.cXJUtn > button:nth-child(2)')  
  }

  const proceedConfirmBtn = await page.$(
    "body > div.MuiDialog-root.ManualInformationDialogstyled__Dialog-sc-1si0082-0.dWcFqW > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div.MuiDialogActions-root.MuiDialogActions-spacing > button:nth-child(2)"
  );
  if (proceedConfirmBtn) {
    await proceedConfirmBtn.click();
  } else {
    const proceedConfirmBtnLocal = await page.$(
      "body > div.MuiDialog-root.ManualInformationDialogstyled__Dialog-sc-1si0082-0.enFPJe > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div.MuiDialogActions-root.MuiDialogActions-spacing > button:nth-child(2)"
    );
    await proceedConfirmBtnLocal?.click();
  }
  await page.waitForSelector(selectors.inputs.firstName);
}

async function getStartPage() {
  debug("Start page");
  const browser = await launch({
    headless: false,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(URL);

  await page.waitForSelector(selectors.page.getStart);

  const [button] = await page.$x(selectors.buttons.getStart);
  if (button) {
    await button.click();
  }
  await page.click(env=="local" ? selectors.buttons.dissmisTestAlertLocal : selectors.buttons.dissmisTestAlert);
  return page;
}

const checkJobTitle = () => {
  const notCheckOn = ["mycccu"];
  const check = !notCheckOn.includes(partner);
  debug(`--> checkJonTitle: ${check}`);
  return check;
};

const checkAnnualIncome = () => {
  const notCheckOn = ["dcu"];
  const check = !notCheckOn.includes(partner);
  debug(`--> checkAnnualIncome: ${check}`);
  return check;
};

const checkCitizenship = () => {
  const notCheckOn = ["americafirst", "americafirst-demo", "eecu", "cuofamerica", "dcu", "wingsfinancial"];
  const check = !notCheckOn.includes(partner);
  debug(`--> checkCitizenship: ${check}`);
  return check;
};

const checkConfirmationProceedPhone = () => {
  const notCheckOn = ["americafirst"];
  const check = !notCheckOn.includes(partner);
  debug(`--> checkConfirmationProceedPhone: ${check}`);
  return check;
};

const checkEmploymentStatus = () => {
  const notCheckOn = ["americafirst", "americafirst-demo", "mycccu", "cuofamerica"];
  const check = !notCheckOn.includes(partner);
  debug(`--> checkEmploymentStatus: ${check}`);
  return check;
};

const env = process.argv[2];
const operation = process.argv[3];
const customerXLSIndex = process.argv[4];
const partner = process.argv[5];

const URL =
  env == "local" ? `http://${partner}.local.clutchapi.com:3002/` : `https://${partner}.sandbox.clutchapi.dev/`;
debug(`Env: ${env}`);
debug(`Partner: ${partner}`);
debug(`Customer XLS Index: ${customerXLSIndex}`);
debug(`Operation: ${operation}`);
debug(`URL: ${URL}`);
const customer = getCustomer(customerXLSIndex);
debug(`Customer: ${customer.firstName}`);

async function main() {
  const page = await getStartPage();
  await phonePage(page);
  await formFirstSection(page);
  await formSecondSection(page);
  if (operation === "purchase") {
    await purchase(page);
  }
}
main();
