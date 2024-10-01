const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ModalWindowPage = require('../../pages/ModalWindowPage');

describe('TC_001: Успешная регистрация пользователя с валидным номером телефона', () => {
  let driver;
  let modalWindow;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.set('goog:loggingPrefs', { performance: 'ALL' });

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    modalWindow = new ModalWindowPage(driver);
    await driver.get('https://growfood.pro/');
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Successful User Registration', async () => {
    const persCabinetBtn = await driver.findElement(By.css('.app-header__dashboard-login'));
    await persCabinetBtn.click();
    await modalWindow.enterPhoneNumber('9268397648');
    await modalWindow.clickGetSmsButton();
    await modalWindow.waitForSmsInput();
    await modalWindow.enterSmsCode('1234');

    const logs = await driver.manage().logs().get('performance');
    const loginRequest = logs.find(entry => entry.message.includes('/api/personal-cabinet/v2_0/authentication/login'));

    if (loginRequest) {
      const logData = JSON.parse(loginRequest.message).message.params;
      expect(logData.response.status).toBe(200);
    } else {
      throw new Error('Запрос на авторизацию не был отправлен');
    }
  }, 30000);
});
