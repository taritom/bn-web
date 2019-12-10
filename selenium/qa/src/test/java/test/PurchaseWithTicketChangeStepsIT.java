package test;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import model.Event;
import model.Purchase;
import model.User;
import pages.LoginPage;
import pages.mailinator.MailinatorHomePage;
import pages.mailinator.inbox.MailinatorInboxPage;
import test.facade.EventStepsFacade;
import test.facade.LoginStepsFacade;
import utils.DataConstants;

public class PurchaseWithTicketChangeStepsIT extends BaseSteps {

	@Test(dataProvider = "purchase_data", priority = 8, retryAnalyzer = utils.RetryAnalizer.class)
	private void purchaseStepsWithTicketChange(User user, Purchase purchase) throws Exception {
		LoginStepsFacade loginFacade = new LoginStepsFacade(driver);
		EventStepsFacade eventFacade = new EventStepsFacade(driver);
		
		maximizeWindow();

		LoginPage loginPage =loginFacade.givenUserIsLogedIn(user);
		if(!eventFacade.whenShoppingBasketIsPresentAndClickOnBasket()) {
			eventFacade.givenThatEventExist(purchase.getEvent(), user);
			eventFacade.whenUserExecutesEventPagesSteps(purchase.getEvent());
			eventFacade.whenUserSelectsNumberOfTicketsAndClicksOnContinue(purchase);
		}
		eventFacade.thenUserIsAtConfirmationPage();
		eventFacade.whenUserChangesTicketOptions(purchase);
		int ticketNumber = eventFacade.thenTicketQuantityIs();
		eventFacade.whenUserEntersCreditCardDetailsAndClicksOnPurchase(purchase.getCreditCard());
		
		//then
		Assert.assertTrue(eventFacade.thenUserIsAtTicketPurchaseSuccessPage());
		loginPage.logOut();

		MailinatorHomePage mailinatorHomePage = new MailinatorHomePage(driver);
		MailinatorInboxPage inboxPage = mailinatorHomePage.goToUserInbox(user.getEmailAddress());
		boolean retVal = inboxPage.openMailAndCheckValidity("Next Step - Get Your Tickets", ticketNumber,
				purchase.getEvent().getEventName());
		
		//then
		Assert.assertTrue(retVal);

	}

	@DataProvider(name = "purchase_data")
	public static Object[][] data() {
		Purchase purchase = Purchase.generatePurchaseFromJson(DataConstants.REGULAR_USER_PURCHASE_KEY);
		Event event = Event.generateEventFromJson(DataConstants.EVENT_DATA_STANARD_KEY,"TestPurchaseNameEvent", false, 2, 15);
		purchase.setEvent(event);
		purchase.setNumberOfTickets(2);
		purchase.setRemoveNumberOfTickets(1);
		
		return new Object[][] { 
			{ User.generateUserFromJson(DataConstants.USER_STANDARD_KEY), purchase } };
	}
	
	

}
