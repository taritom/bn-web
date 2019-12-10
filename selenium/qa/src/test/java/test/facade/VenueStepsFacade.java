package test.facade;

import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.WebDriver;
import org.testng.Assert;

import model.Venue;
import pages.admin.venue.AdminVenuePage;
import pages.admin.venue.CreateVenuePage;
import pages.components.admin.AdminSideBar;
import pages.components.admin.venues.AdminVenueComponent;
import utils.MsgConstants;

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
		whenUserFillsOutVenueInfo(venue);
		whenUserClicksOnCreateVenue();
		boolean isNotificationVisible = thenNotificationVenueCreatedShouldBeVisible();
		Assert.assertTrue(isNotificationVisible, "Success venue creation notification not visible");
	}

	public void venueUpdateSteps(Venue venue) {
		whenUserClicksOnEditButtonOfSelectedVenue(venue.getName());
		whenUserFillsOutVenueInfo(venue, false);
		whenUserClickOnUpdateButtonOnEditPage();
		boolean isNotifUpdate = thenNotificationVenueUpdatedShoudBeVisible();
		Assert.assertTrue(isNotifUpdate, "Notification for venue update not visible");
		boolean isOnVenuePage = thenUserIsOnVenuesPage();
		Assert.assertTrue(isOnVenuePage, "User is not redirected on venue page after venue update");
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

	public void whenUserFillsOutVenueInfo(Venue venue) {
		whenUserFillsOutVenueInfo(venue, true);
	}

	public void whenUserFillsOutVenueInfo(Venue venue, boolean setOrganization) {
		createVenuePage.uploadImageUsingFilePath(venue.getImageName());
		createVenuePage.enterVenueName(venue.getName());
		if (setOrganization) {
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
