package pages.admin.venue;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import pages.BasePage;
import pages.components.GenericDropDown;
import pages.components.ManualAddressEntryComponent;
import pages.components.admin.UploadImageComponent;
import utils.Constants;
import utils.SeleniumUtils;

public class CreateVenuePage extends BasePage {

	@FindBy(xpath = "//form//button[@type='button' and span[contains(text(),'Upload image')]]")
	private WebElement uploadImageButton;

	@FindBy(id = "name")
	private WebElement venueNameField;

	@FindBy(xpath = "//form//input[@id='organization']/preceding-sibling::div[@aria-haspopup='true']")
	private WebElement organizationDropDownActivate;

	@FindBy(id = "menu-organization")
	private WebElement organizationDropDownContainer;

	@FindBy(xpath = "//form//input[@id='timezone']/preceding-sibling::div[@aria-haspopup='true']")
	private WebElement timezoneDropDownActivate;

	@FindBy(id = "menu-timezone")
	private WebElement timezoneDropDownContainer;

	@FindBy(xpath = "//form//input[@id='region']/preceding-sibling::div[@aria-haspopup='true']")
	private WebElement regionDropDownActivate;

	@FindBy(id = "menu-region")
	private WebElement regionDropDownContainer;

	@FindBy(id = "phone")
	private WebElement phoneNumberField;

	@FindBy(xpath = "//body//main//form//div[contains(@class, 'location-search-input')]//input")
	private WebElement locationAutoSearchField;

	@FindBy(xpath = "//form//div/button[@type='submit' and span[text()='Create']]")
	private WebElement createButton;

	@FindBy(xpath = "//form//div/button[@type='submit' and span[contains(text(),'Update')]]")
	private WebElement updateButton;

	@FindBy(id = "address")
	private WebElement addressField;
	
	@FindBy(id = "city")
	private WebElement cityFiled;
	
	@FindBy(id = "postal_code")
	private WebElement zipField;
	
	@FindBy(xpath = "//form//input[@id='state']/preceding-sibling::div[@aria-haspopup='true']")
	private WebElement stateDropDownActivate;

	@FindBy(id = "menu-state")
	private WebElement stateContainer;
	
	@FindBy(id = "country")
	private WebElement countryField;
	
	public CreateVenuePage(WebDriver driver) {
		super(driver);
	}

	@Override
	public void presetUrl() {
		setUrl(Constants.getAdminVenueCreate());
	}

	public void uploadImageUsingLink(String imageUrl) {
		UploadImageComponent uploadImageComponent = new UploadImageComponent(driver);
		uploadImageComponent.uploadImageViaExternalLink(imageUrl, uploadImageButton);
	}

	public void uploadImageUsingFilePath(String imageName) {
		UploadImageComponent uploadImageComponent = new UploadImageComponent(driver);
		uploadImageComponent.uploadImageFromResources(imageName, uploadImageButton);
	}

	public void enterVenueName(String venueName) {
		waitForTime(500);
		SeleniumUtils.clearInputField(venueNameField, driver);
		waitVisibilityAndSendKeys(venueNameField, venueName);
	}

	public void enterOrganization(String organizationName) {
		GenericDropDown dropDown = new GenericDropDown(driver, organizationDropDownActivate,
				organizationDropDownContainer);
		dropDown.selectElementFromDropDownHiddenInput(dropDownListXpath(organizationName), organizationName);
	}

	public void enterTimezone(String timezone) {
		GenericDropDown dropDown = new GenericDropDown(driver, timezoneDropDownActivate, timezoneDropDownContainer);
		dropDown.selectElementFromDropDownHiddenInput(dropDownListXpath(timezone), timezone);
	}

	public void enterRegion(String regionName) {
		GenericDropDown dropDown = new GenericDropDown(driver, regionDropDownActivate, regionDropDownContainer);
		dropDown.selectElementFromDropDownHiddenInput(dropDownListXpath(regionName), regionName);
		waitForTime(1000);
	}

	private By dropDownListXpath(String value) {
		return By.xpath(".//ul//li[contains(text(),'" + value + "')]");
	}
	
	public void enterAddress(String address) {
		waitVisibilityAndClearFieldSendKeysF(addressField, address);
	}
	
	public void enterCity(String city) {
		waitVisibilityAndClearFieldSendKeysF(cityFiled, city);
	}
	
	public void enterZip(String zip) {
		waitVisibilityAndClearFieldSendKeysF(zipField, zip);
	}
	
	public void enterCountry(String country) {
		waitVisibilityAndClearFieldSendKeysF(countryField, country);
	}
	
	public void enterPhoneNumber(String phoneNumber) {
		SeleniumUtils.clearInputField(phoneNumberField, driver);
		waitVisibilityAndSendKeysSlow(phoneNumberField, phoneNumber);
	}
	
	public void enterState(String state) {
		GenericDropDown dd = new GenericDropDown(driver, stateDropDownActivate, stateContainer);
		dd.selectElementFromDropDownHiddenInput(dropDownListXpath(state), state);
	}

	public void clickOnCreateButton() {
		waitVisibilityAndBrowserCheckClick(createButton);
	}

	public void clickOnUpdateButton() {
		waitVisibilityAndBrowserCheckClick(updateButton);
	}

}