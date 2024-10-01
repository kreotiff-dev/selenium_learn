const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ModalWindowPage = require('../../pages/ModalWindowPage');

describe('TC_002: Регистрация с некорректным номером телефона', () => {
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

  test('Регистрация с некорректным номером телефона', async () => {
    const persCabinetBtn = await driver.findElement(By.css('.app-header__dashboard-login'));
    await persCabinetBtn.click();
    await modalWindow.enterPhoneNumber('900000000');  
    await modalWindow.clickGetSmsButton();

    const errorText = await modalWindow.getErrorMessage();
    expect(errorText).toBe('Введите номер телефона');

    // Проверка, что запрос не был отправлен
    const logs = await driver.manage().logs().get('performance');
    const sendSmsRequest = logs.find(log => log.message.includes('/authentication/send-sms'));

    if (sendSmsRequest) {
      throw new Error('Запрос на отправку SMS был отправлен, но не должен был.');
    } else {
      console.log('Запрос на отправку SMS не был отправлен, как и ожидалось.');
    }
  }, 30000);
});
