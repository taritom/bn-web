package test.facade;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;

import model.Venue;
import pages.admin.venue.AdminVenuePage;
import pages.admin.venue.CreateVenuePage;
import pages.admin.venue.ValidationVenueFields;
import pages.components.GenericDropDown;
import pages.components.admin.AdminSideBar;
import pages.components.admin.venues.AdminVenueComponent;
import utils.MsgConstants;
import utils.ProjectUtils;

public class VenueStepsFacade extends BaseFacadeSteps {

	private AdminVenuePage venuePage;
	private CreateVenuePage createVenuePage;
	private AdminSideBar adminSideBar;
	private Map<String, Object> dataMap;

	private final String VENUE_NAME_KEY = "venue_name_key";

	public VenueStepsFacade(WebDriver driver) {
		super(driver);
		this.venuePage = new AdminVenuePage(driver);
		this.createVenuePage = new CreateVenuePage(driver);
		this.adminSideBar = new AdminSideBar(driver);
		this.dataMap = new HashMap<String, Object>();
	}

	public void venueCreateSteps(Venue venue) {
		givenUserIsOnVenuesPage();
		givenUserIsOnCreateVenuePage();
		whenUserFillsOutVenueInfo(venue, true);
		whenUserClicksOnCreateVenue();
		checkNotification(true);
	}
	
	public void venueUpdateSteps(Venue venue, boolean randomizeName) {
		whenUserClicksOnEditButtonOfSelectedVenue(venue.getName());
		if (randomizeName) {
			venue.setName(ProjectUtils.setSuffixDateOfText(venue.getName()));
		}
		whenUserFillsOutVenueInfo(venue, false);
		whenUserClickOnUpdateButtonOnEditPage();
		checkNotification(false);
	}
	
	public void venueRequiredFieldsValidation(Venue venue, boolean randomizeName, boolean createVenue) {
		givenUserIsOnVenuesPage();
		if (createVenue) {
			givenUserIsOnCreateVenuePage();
			createVenuePage.clearCountryField();
		} else {
			whenUserClicksOnEditButtonOfSelectedVenue(venue.getName());
			createVenuePage.clearFields();
		}
		if (randomizeName) {
			venue.setName(ProjectUtils.setSuffixDateOfText(venue.getName()));
		}
		executeValidationCheck(venue, createVenue);
	}
	
	private void executeValidationCheck(Venue venue, boolean createVenue) {
		SoftAssert softAssert = new SoftAssert();
		createVenuePage.enterTimezone(venue.getTimezone());
		ValidationVenueFields validation = new ValidationVenueFields(driver);
		List<Consumer<Venue>> functions = createVenuePage.getListOfRequiredFunctions(createVenue);
		int numberOfRequiredFields = functions.size();
		submit(createVenue);
		for (int i = 0; i < functions.size(); i++) {
			functions.get(i).accept(venue);
			if (i == (functions.size()-1 )){
				submit(createVenue);
				checkNotification(createVenue);
			} else {
				int invalidFields = validation.numberOfInvalidFields(createVenue);
				if(invalidFields != (numberOfRequiredFields - i)) {
					softAssert.assertTrue(false, "Number of invalid fields: " + invalidFields 
							+ " , and number of required fields: " + numberOfRequiredFields + " index: " + i);
				}
				submit(createVenue);
			}
		}
		softAssert.assertAll();
	}
	
	private void submit(boolean createVenue) {
		if (createVenue) {
			whenUserClicksOnCreateVenue();
		} else {
			whenUserClickOnUpdateButtonOnEditPage();
		}
	}
	
	private void checkNotification(boolean createVenue) {//return value here
		if (createVenue) {
			boolean isNotificationVisible = thenNotificationVenueCreatedShouldBeVisible();
			Assert.assertTrue(isNotificationVisible, "Success venue creation notification not visible");
		} else {
			boolean isNotifUpdate = thenNotificationVenueUpdatedShoudBeVisible();
			Assert.assertTrue(isNotifUpdate, "Notification for venue update not visible");
			boolean isOnVenuePage = thenUserIsOnVenuesPage();
			Assert.assertTrue(isOnVenuePage, "User is not redirected on venue page after venue update");
		}
	}
	
	public boolean isVenueAlreadyCreated(Venue venue) {
		return venuePage.isVenueWithNamePresent(venue.getName());
	}

	public void givenUserIsOnVenuesPage() {
		adminSideBar.clickOnVenues();
		thenUserIsOnVenuesPage();
	}

	public void givenUserIsOnCreateVenuePage() {
		venuePage.clickOnCreateVenueButton();
		thenUserIsOnCreateVenuePage();
	}

	public void whenUserFillsOutVenueInfo(Venue venue, boolean createVenue) {
		createVenuePage.uploadImageUsingFilePath(venue.getImageName());
		createVenuePage.enterVenueName(venue.getName());
		if (createVenue) {
			createVenuePage.enterOrganization(venue.getOrganization());
		}
		createVenuePage.enterTimezone(venue.getTimezone());
		createVenuePage.enterRegion(venue.getRegion());
		createVenuePage.enterPhoneNumber(venue.getPhoneNumber());
		createVenuePage.enterAddress(venue.getAddress());
		createVenuePage.enterCity(venue.getCity());
		createVenuePage.enterZip(venue.getZip());
		createVenuePage.enterState(venue.getState());
		createVenuePage.enterCountry(venue.getCountry());
	}
	
	public void checkStatesIfStatesAreAbbreviated(SoftAssert softAssert) {
		List<String> dropDownList = createVenuePage.getListOfStatesInDropDown();
		
		for(String st  : dropDownList) {
			if (!ProjectUtils.isMatch("\\([A-Z]{2}\\)", st)){
				softAssert.fail("No state abbriviation match for: " + st);
			}
		}
	}

	public void whenUserClicksOnCreateVenue() {
		createVenuePage.clickOnCreateButton();
	}

	public void whenUserClicksOnEditButtonOfSelectedVenue(String venueName) {
		AdminVenueComponent selectedVenue = venuePage.findVenueByName(venueName);
		String vName = selectedVenue.getVenueName();
		setData(VENUE_NAME_KEY, vName);
		selectedVenue.clickOnEditButton();
	}



	public void whenUserClickOnUpdateButtonOnEditPage() {
		createVenuePage.clickOnUpdateButton();
	}

	public boolean thenNotificationVenueCreatedShouldBeVisible() {
		return venuePage.isNotificationDisplayedWithMessage(MsgConstants.VENUE_CREATED_SUCCESS);
	}

	public boolean thenNotificationVenueUpdatedShoudBeVisible() {
		return venuePage.isNotificationDisplayedWithMessage(MsgConstants.VENUE_UPDATED_SUCCESS);
	}

	public boolean thenUserIsOnVenuesPage() {
		return venuePage.isAtPage();
	}

	public boolean thenUserIsOnCreateVenuePage() {
		return createVenuePage.isAtPage();
	}

	@Override
	protected void setData(String key, Object value) {
		this.dataMap.put(key, value);
	}

	@Override
	protected Object getData(String key) {
		return this.dataMap.get(key);
	}

}
