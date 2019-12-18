package pages.admin.venue;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import model.Venue;
import pages.BasePage;
import pages.components.GenericDropDown;
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

	@FindBy(id = "address")
	private WebElement addressField;

	@FindBy(id = "city")
	private WebElement cityField;

	@FindBy(id = "postal_code")
	private WebElement zipField;

	@FindBy(xpath = "//form//input[@id='state']/preceding-sibling::div[@aria-haspopup='true']")
	private WebElement stateDropDownActivate;
	@FindBy(id = "menu-state")
	private WebElement stateContainer;

	@FindBy(id = "country")
	private WebElement countryField;

	@FindBy(xpath = "//form//div/button[@type='submit' and span[text()='Create']]")
	private WebElement createButton;

	@FindBy(xpath = "//form//div/button[@type='submit' and span[contains(text(),'Update')]]")
	private WebElement updateButton;

	public CreateVenuePage(WebDriver driver) {
		super(driver);
	}

	@Override
	public void presetUrl() {
		setUrl(Constants.getAdminVenueCreate());
	}

	public List<Consumer<Venue>> getListOfRequiredFunctions(boolean createVenue) {
		List<Consumer<Venue>> functions = new ArrayList<>();
		functions.add(p -> enterVenueName(p));
		if (createVenue) {
			functions.add(p -> enterOrganization(p));
		}
		functions.add(p -> enterAddress(p));
		functions.add(p -> enterCity(p));
		functions.add(p -> enterZip(p));
		if (createVenue) {
			functions.add(p -> enterState(p));
		}
		functions.add(p -> enterCountry(p));
		return functions;
	}
	
	public void clearFields() {
		getAccessUtils().clearInputFields(venueNameField, addressField, cityField, zipField, countryField);
	}
	
	public void clearCountryField() {
		getAccessUtils().clearInputField(countryField);
	}
	
	public List<String> getListOfStatesInDropDown(){
		GenericDropDown dropDown = new GenericDropDown(driver, stateDropDownActivate, stateContainer);
		return dropDown.getDropDownList();
	}
	
	public void uploadImageUsingLink(String imageUrl) {
		UploadImageComponent uploadImageComponent = new UploadImageComponent(driver);
		uploadImageComponent.uploadImageViaExternalLink(imageUrl, uploadImageButton);
	}
	
	public void uploadImageUsingFilePath(Venue venue) {
		uploadImageUsingFilePath(venue.getImageName());
	}

	public void uploadImageUsingFilePath(String imageName) {
		UploadImageComponent uploadImageComponent = new UploadImageComponent(driver);
		uploadImageComponent.uploadImageFromResources(imageName, uploadImageButton);
	}
	
	public void enterVenueName(Venue venue) {
		enterVenueName(venue.getName());
	}

	public void enterVenueName(String venueName) {
		waitForTime(500);
		SeleniumUtils.clearInputField(venueNameField, driver);
		waitVisibilityAndSendKeys(venueNameField, venueName);
	}

	public void enterOrganization(Venue venue) {
		enterOrganization(venue.getOrganization());
	}
	
	public void enterOrganization(String organizationName) {
		GenericDropDown dropDown = new GenericDropDown(driver, organizationDropDownActivate,
				organizationDropDownContainer);
		dropDown.selectElementFromDropDownHiddenInput(dropDownListXpath(organizationName), organizationName);
	}

	public void enterTimezone(Venue venue) {
		enterTimezone(venue.getTimezone());
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
	
	public void enterAddress(Venue venue) {
		enterAddress(venue.getAddress());
	}

	public void enterAddress(String address) {
		waitVisibilityAndClearFieldSendKeysF(addressField, address);
	}

	public void enterCity(Venue venue) {
		enterCity(venue.getCity());
	}
	
	public void enterCity(String city) {
		waitVisibilityAndClearFieldSendKeysF(cityField, city);
	}

	public void enterZip(Venue venue) {
		enterZip(venue.getZip());
	}
	
	public void enterZip(String zip) {
		waitVisibilityAndClearFieldSendKeysF(zipField, zip);
	}

	public void enterCountry(Venue venue) {
		enterCountry(venue.getCountry());
	}
	
	public void enterCountry(String country) {
		waitVisibilityAndClearFieldSendKeysF(countryField, country);
	}

	public void enterPhoneNumber(String phoneNumber) {
		SeleniumUtils.clearInputField(phoneNumberField, driver);
		waitVisibilityAndSendKeysSlow(phoneNumberField, phoneNumber);
	}
	
	public void enterState(Venue venue) {
		enterState(venue.getState());
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

	private boolean isElementVisible(WebElement element) {
		return isExplicitlyWaitVisible(3, element);
	}

}