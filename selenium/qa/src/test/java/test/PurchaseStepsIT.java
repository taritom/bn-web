package test;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import data.holders.DataHolder;
import data.holders.ticket.order.OrderDetailsData;
import model.Event;
import model.Purchase;
import model.User;
import pages.mailinator.MailinatorHomePage;
import pages.mailinator.inbox.MailinatorInboxPage;
import test.facade.EventStepsFacade;
import test.facade.FacadeProvider;
import test.facade.LoginStepsFacade;
import utils.DataConstants;

public class PurchaseStepsIT extends BaseSteps {

	@Test(dataProvider = "purchase_data", priority = 7, retryAnalyzer = utils.RetryAnalizer.class)
	public void purchaseSteps(User user, Purchase purchase) {
		maximizeWindow();
		FacadeProvider fp = new FacadeProvider(driver);
		EventStepsFacade eventsFacade = fp.getEventFacade();
		LoginStepsFacade loginFacade = fp.getLoginFacade();
		// given
		eventsFacade.givenUserIsOnHomePage();
		eventsFacade.givenThatEventExist(purchase.getEvent(), user);

		// when
		eventsFacade.whenUserExecutesEventPagesSteps(purchase.getEvent());
		Assert.assertTrue(eventsFacade.thenUserIsAtTicketsPage(), "User is not on tickets page");
		
		eventsFacade.whenUserSelectsNumberOfTicketsAndClicksOnContinue(purchase);
		eventsFacade.whenUserLogsInOnTicketsPage(user);
		eventsFacade.thenUserIsAtConfirmationPage();
		eventsFacade.whenUserEntersCreditCardDetailsAndClicksOnPurchase(purchase.getCreditCard());

		// then
		eventsFacade.thenUserIsAtTicketPurchaseSuccessPage();
		loginFacade.logOut();
		
		MailinatorHomePage mailinatorHomePage = new MailinatorHomePage(driver);
		MailinatorInboxPage inboxPage = mailinatorHomePage.goToUserInbox(user.getEmailAddress());
		// then
		boolean retVal = inboxPage.openMailAndCheckValidity("Next Step - Get Your Tickets",
				purchase.getNumberOfTickets(), purchase.getEvent().getEventName());
		Assert.assertTrue(retVal);
	}
	
	@Test(dataProvider = "purchase_data", priority = 7, retryAnalyzer = utils.RetryAnalizer.class)
	public void purchaseWithOrderConfirmationDataValidation(User user, Purchase purchase) {
		maximizeWindow();
		FacadeProvider fp = new FacadeProvider(driver);
		EventStepsFacade eventsFacade = fp.getEventFacade();
		LoginStepsFacade loginFacade = fp.getLoginFacade();
		eventsFacade.givenUserIsOnHomePage();
		eventsFacade.givenThatEventExist(purchase.getEvent(), user);

		DataHolder holder = eventsFacade.whenUserExecutesEventPageStepsWithDataAndWithoutMapView(purchase.getEvent());
		Assert.assertTrue(eventsFacade.thenUserIsAtTicketsPage(), "User is not on tickets page");
		
		eventsFacade.whenUserSelectsNumberOfTicketsAndClicksOnContinue(purchase);
		eventsFacade.whenUserLogsInOnTicketsPage(user);
		eventsFacade.thenUserIsAtConfirmationPage();
		eventsFacade.whenUserEntersCreditCardDetailsAndClicksOnPurchase(purchase.getCreditCard());

		eventsFacade.thenUserIsAtTicketPurchaseSuccessPage();
		eventsFacade.whenUserChecksValidityOfInfoOnTicketSuccessPage(holder, user);
		OrderDetailsData orderDetailsData = (OrderDetailsData) eventsFacade.getOrderDetailsData();
		loginFacade.logOut();
		Assert.assertTrue(loginFacade.thenUserIsAtLoginPage(), "User should be on home page after logout");
		
		
		loginFacade.givenAdminUserIsLogedIn(purchase.getEvent().getOrganization().getTeam().getOrgAdminUser());
		fp.getOrganizationFacade().givenOrganizationExist(purchase.getEvent().getOrganization());
		
		fp.getAdminEventStepsFacade().whenUserGoesToEventDashboard(orderDetailsData.getEvent());
		fp.getEventDashboardFacade().givenUserIsOnManageOrdersPage();
		fp.getEventDashboardFacade().whenUserClickOnOrderWithOrderNumber(orderDetailsData.getOrderNumber(), fp.getOrderManageFacade());
		fp.getOrderManageFacade().whenUserComparesDataFromTicketSuccesPageAndOrderManagePage(orderDetailsData);
		loginFacade.logOut();
	}

	@DataProvider(name = "purchase_data")
	public static Object[][] data() {
		Purchase purchase = Purchase.generatePurchaseFromJson(DataConstants.REGULAR_USER_PURCHASE_KEY);
		Event event = Event.generateEventFromJson(DataConstants.EVENT_DATA_STANARD_KEY,"TestPurchaseNameEvent" , false, 2, 15);
		purchase.setEvent(event);
		// TODO: replace with some other number
		purchase.setPhoneNumber("14422460151");
		return new Object[][] { 
			{ User.generateUserFromJson(DataConstants.USER_STANDARD_KEY), purchase }}
		;
	}
}
