const { By, until } = require('selenium-webdriver');

class ModalWindowPage {
    constructor(driver) {
        this.driver = driver;
    }

    async enterPhoneNumber(phoneNumber) {
        const phoneInput = await this.driver.findElement(By.css('.enter-phone__phone-input'));
        await phoneInput.sendKeys(phoneNumber);
    }

    async clickGetSmsButton() {
        const getSmsButton = await this.driver.findElement(By.css('.main-button__main-content'));
        await getSmsButton.click();
    }

    async enterSmsCode(smsCode) {
        const smsInput = await this.waitForElement(By.css('.sms-code__input-code'), 5000);
        await smsInput.sendKeys(smsCode);
    }

    async waitForSmsInput() {
        await this.waitForElement(By.css('.sms-code__input-code'), 5000);
    }

    async getErrorMessage() {
        const errorElement = await this.waitForElement(By.css('.enter-phone__phone-error-msg'), 5000);
        return await errorElement.getText();
    }

    async waitForElement(selector, timeout = 5000) {
        return await this.driver.wait(until.elementLocated(selector), timeout);
    }
}

module.exports = ModalWindowPage;
