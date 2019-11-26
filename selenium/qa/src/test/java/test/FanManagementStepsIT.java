package test;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import model.Event;
import model.Purchase;
import model.User;
import pages.admin.orders.manage.SelectedOrderPage;
import pages.components.admin.orders.manage.ActivityItem;
import pages.components.admin.orders.manage.ActivityItem.ExpandedContent;
import pages.components.dialogs.IssueRefundDialog.RefundReason;
import test.facade.AdminFanManagementFacade;
import test.facade.EventStepsFacade;
import test.facade.FacadeProvider;
import utils.DataConstants;

public class FanManagementStepsIT extends BaseSteps {
	
	private static final String EVENT_NAME = "TestFanManagementEventName";
	private static final Integer START_DAY_OFFSET = 1;
	private static final Integer DAYS_RANGE = 2;
	private static final Integer PURCHASE_QUANTITY = 3;
	private Purchase purchase;
	
	
	/**
	 * Automation: Big Neon : Test 32: Fan Management ,View Fan Profile And Event Activity Filtering #1830
	 * @param fan
	 * @param orgAdmin
	 */
	@Test(dataProvider = "fan_profile_data", dependsOnMethods = {"predifinedDataUserPurchasesTickets"},
			priority = 24, retryAnalyzer = utils.RetryAnalizer.class )
	public void viewFanProfileAndEventsFiltering(User fan, User orgAdmin) throws Exception {

		FacadeProvider fp = new FacadeProvider(driver);
		maximizeWindow();
		loginAndNavigationToFanProfilePage(fp, fan, orgAdmin);
		
		boolean isFanInfoValid = fp.getFanManagmentFacade().whenUserChecksValidityOfFanInformation(fan);
		Assert.assertTrue(isFanInfoValid, "Fan information on fan profile page is not valid for fan: " + fan.getEmailAddress());
		
		fp.getFanManagmentFacade().whenUserChecksUpcomingEventList();
		boolean isOnPastEventsPage = fp.getFanManagmentFacade().whenUserClicksOnPastEventsLink();
		Assert.assertTrue(isOnPastEventsPage, "Failed to load past event list for fan: " + fan.getEmailAddress());
		
		boolean checkIfEventsAreDifferent = fp.getFanManagmentFacade().thenUserComparesUpcomingAndPastEventLists();
		Assert.assertTrue(checkIfEventsAreDifferent, "Events in upcoming and past list are not different");
		fp.getLoginFacade().logOut();
	}
	
	/**
	 * Automation: Big Neon: Test 33: Fan Management: Event Summary Card Should Contain Data #1837
	 * @param fan
	 * @param orgAdmin
	 */
	@Test(dataProvider = "fan_profile_data", priority = 25, retryAnalyzer = utils.RetryAnalizer.class)
	public void fanProfileEventSummaryCardsContainData(User fan, User orgAdmin) throws Exception {
		FacadeProvider fp = new FacadeProvider(driver);
		maximizeWindow();
		loginAndNavigationToFanProfilePage(fp, fan, orgAdmin);
		
		boolean isSummaryCardDataPresent = fp.getFanManagmentFacade().thenEventSummaryDataShouldBePresentAndActivitiesCollapsed();
		Assert.assertTrue(isSummaryCardDataPresent);
		
		fp.getLoginFacade().logOut();
	}
	/**
	 * Automation: Big Neon Test 34: Fan Management: ActivityItem/Purchased #1843
	 * @param fan
	 * @param orgAdmin
	 */
	@Test(dataProvider = "fan_profile_data", priority = 26, retryAnalyzer = utils.RetryAnalizer.class)
	public void fanProfilePurchasedActivityItems(User fan, User orgAdmin) throws Exception {
		
		FacadeProvider fp = new FacadeProvider(driver);
		maximizeWindow();
		loginAndNavigationToFanProfilePage(fp, fan, orgAdmin);
		ActivityItem item = fp.getFanManagmentFacade().whenUserClicksOnShowDetailsOfSelectedSummaryCard(purchase.getEvent());
		ExpandedContent expandedContent = item.getExpandedContent();
		boolean isDataVisible = expandedContent.isDataVisible();
		Assert.assertTrue(isDataVisible, "Not all data in expanded purchased activity item is visible");
		
		fp.getLoginFacade().logOut();
	}
	/**
	 * Automation: Big Neon: Fan Management: Test 35: ActivityItems/Refunded Created
	 * @param fan
	 * @param orgAdmin
	 */
	@Test(dataProvider = "fan_profile_data", priority = 27, retryAnalyzer = utils.RetryAnalizer.class)
	public void fanProfileRefundedActivityItem(User fan, User orgAdmin) throws Exception {

		FacadeProvider fp = new FacadeProvider(driver);
		maximizeWindow();
		
		//given
		loginAndNavigationToFanProfilePage(fp, fan, orgAdmin);
		
		//when
		fp.getFanManagmentFacade().whenUserPicksEventSummaryCard(this.purchase.getEvent());
		SelectedOrderPage selectedOrderPage = fp.getFanManagmentFacade().whenUserClicksOnPurchasedActivityItemOrderNumberLink();
		boolean isOnOrderManagePage = fp.getOrderManageFacade().thenUserIsOnSelectedManageOrderPage(selectedOrderPage);
		Assert.assertTrue(isOnOrderManagePage, "Not on orders manage page");
		fp.getOrderManageFacade().refundSteps(RefundReason.UNABLE_TO_ATTEND);
		navigateToFanProfilePage(fp.getFanManagmentFacade(), fan);
		fp.getFanManagmentFacade().whenUserPicksEventSummaryCard(this.purchase.getEvent());
		
		//then
		boolean isRefundDataVisible = fp.getFanManagmentFacade().thenRefundedActivityItemForSpecificEventShouldBeVisible(orgAdmin, fan);
		Assert.assertTrue(isRefundDataVisible, "Refund data on activity item missing");
		fp.getLoginFacade().logOut();
		
	}
	
	private void loginAndNavigationToFanProfilePage(FacadeProvider fp, User fan, User orgAdmin) throws Exception {
		fp.getLoginFacade().givenAdminUserIsLogedIn(orgAdmin);
		fp.getOrganizationFacade().givenOrganizationExist(this.purchase.getEvent().getOrganization());
		navigateToFanProfilePage(fp.getFanManagmentFacade(), fan);
	}
	
	private void navigateToFanProfilePage(AdminFanManagementFacade fanManagementFacade, User fan) {
		fanManagementFacade.givenUserIsOnFansPage();
		fanManagementFacade.whenUserSelectsFanFormList(fan);
	}
	
	
	@DataProvider(name = "fan_profile_data")
	public static Object[][] fanProfileData(){
		Purchase purchase = preparePurchase();
		User fan = User.generateUserFromJson(DataConstants.DISTINCT_USER_THREE_KEY);
		User orgAdmin = User.generateUserFromJson(DataConstants.ORGANIZATION_ADMIN_USER_KEY);
		return new Object[][] {{fan, orgAdmin}};
	}
	
	@Test(dataProvider = "purchase_data", priority = 24)
	public void predifinedDataUserPurchasesTickets(User fan, Purchase purchas) throws Exception {
		maximizeWindow();
		EventStepsFacade eventsFacade = new EventStepsFacade(driver);

		// given
		eventsFacade.givenUserIsOnEventPage();

		eventsFacade.givenThatEventExist(purchas.getEvent(), fan, false);
		if (this.purchase == null ) {
			this.purchase = purchas;
		}
		// when
		eventsFacade.whenUserExecutesEventPagesStepsWithoutMapView(purchas.getEvent());

		Assert.assertTrue(eventsFacade.thenUserIsAtTicketsPage());

		eventsFacade.whenUserSelectsNumberOfTicketsAndClicksOnContinue(purchas);
		eventsFacade.whenUserLogsInOnTicketsPage(fan);
		eventsFacade.thenUserIsAtConfirmationPage();
		eventsFacade.whenUserEntersCreditCardDetailsAndClicksOnPurchase(purchas.getCreditCard());

		// then
		eventsFacade.thenUserIsAtTicketPurchaseSuccessPage();
		eventsFacade.getLoginPage().logOut();
	}

	@DataProvider(name = "purchase_data")
	public static Object[][] data() {
		Purchase purchaseOne = preparePurchase();

		User fan = User.generateUserFromJson(DataConstants.DISTINCT_USER_THREE_KEY);
		
		return new Object[][] { { fan, purchaseOne }};
	}

	private static Purchase preparePurchase() {
		Purchase purchase = Purchase.generatePurchaseFromJson(DataConstants.REGULAR_USER_PURCHASE_KEY);
		purchase.setNumberOfTickets(PURCHASE_QUANTITY);
		purchase.setEvent(Event.generateEventFromJson(DataConstants.EVENT_DATA_STANARD_KEY,
				EVENT_NAME, true, START_DAY_OFFSET, DAYS_RANGE));
		return purchase;
	}
}
