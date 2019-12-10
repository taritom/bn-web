package test;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import model.User;
import pages.LoginPage;
import pages.SignUpPage;
import pages.TicketTransferPage;
import pages.components.user.EventComponent;
import pages.mailinator.MailinatorHomePage;
import pages.mailinator.inbox.MailinatorInboxPage;
import pages.user.MyEventsPage;
import utils.DataConstants;
import utils.MsgConstants;

public class TransferTicketStepsIT extends BaseSteps {

//	@Test(dataProvider = "ticket_transfer_to_new_user_data", priority = 10)
	public void transferTicketToNewUserSteps(User sender, User receiver) {
		LoginPage login = new LoginPage(driver);
		maximizeWindow();
		login.confirmedLogin(sender.getEmailAddress(), sender.getPass());

		MyEventsPage myEventsPage = login.getHeader().clickOnMyEventsInProfileDropDown();
		myEventsPage.isAtPage();
		//goes through events on users myEvents page, and looks for event with tickets that are transferable 
		//(not in process of transfer)
		EventComponent selectedEvent = myEventsPage.findEventWithTransferableTickets();
		String eventName = selectedEvent.getEventName();
		String ticketNumber = selectedEvent.getTicketNumber();
		String orderNumber = selectedEvent.getOrderNumber();

		selectedEvent.clickOnTransfer();

		myEventsPage.enterReceiversMail(receiver);
		login.logOut();

		// TODO: do some kind of factory and template method combination for this
		// mailinator pages.
		MailinatorHomePage mailinatorHomePage = new MailinatorHomePage(driver);
		MailinatorInboxPage inboxPage = mailinatorHomePage.goToUserInbox(receiver.getEmailAddress());
		inboxPage.goToMail(sender.getFirstName() + " " + sender.getLastName() + " sent you tickets! Action Required!");
		inboxPage.clickOnClaimTicket();

		TicketTransferPage ticketTransferPage = new TicketTransferPage(driver);
		SignUpPage signUpPage = ticketTransferPage.clickOnContinueWithEmail();

		signUpPage.createAccount(receiver);
		Assert.assertTrue(ticketTransferPage.checkIfCorrectUser(receiver), "Wrong user registerd");

		ticketTransferPage.clickOnLetsDoIt();
		Assert.assertFalse(ticketTransferPage.isNotificationDisplayedWithMessage(MsgConstants.TICKET_TRANSFER_RECEIVING_TICKETS_FAILED,4),
				"Ticket claiming process failed");
		signUpPage.getHeader().clickOnMyEventsInProfileDropDown();
		myEventsPage.isAtPage();

		boolean isTicketTransfered = myEventsPage.checkIfTicketExists(ticketNumber, orderNumber, eventName);
		Assert.assertTrue(isTicketTransfered, "Ticket not transfered to receiver account");
		login.logOut();
	}

//	@Test(dataProvider = "ticket_transfer_to_old_user_data", priority = 9)
	public void transferTicketToExistingUserSteps(User sender, User receiver) {
		LoginPage login = new LoginPage(driver);
		maximizeWindow();
		login.confirmedLogin(sender.getEmailAddress(), sender.getPass());

		MyEventsPage myEventsPage = login.getHeader().clickOnMyEventsInProfileDropDown();
		myEventsPage.isAtPage();
		
		
		EventComponent selectedEvent = myEventsPage.findEventWithTransferableTickets();
		String eventName = selectedEvent.getEventName();
		// get ticket number and order number to retrieve later in receivers events
		String ticketNumber = selectedEvent.getTicketNumber();
		String orderNumber = selectedEvent.getOrderNumber();
		selectedEvent.clickOnTransfer();

		myEventsPage.enterReceiversMail(receiver);
		boolean retVal = myEventsPage
				.isNotificationDisplayedWithMessage(MsgConstants.TICKET_TRANSFER_EMAIL_LINK_SENT_SUCCESS);
		Assert.assertTrue(retVal, "Notification not displayed");
		login.logOut();

		// Log in with receiver
		Assert.assertTrue(login.confirmedLogin(receiver), "Login with receiver account failed: " + receiver);
		myEventsPage = login.getHeader().clickOnMyEventsInProfileDropDown();
		myEventsPage.isAtPage();
		boolean isTicketTransfered = myEventsPage.checkIfTicketExists(ticketNumber, orderNumber, eventName);
		Assert.assertTrue(isTicketTransfered, "Ticket not transfered to receiver account");
		login.logOut();

	}

	@DataProvider(name = "ticket_transfer_to_new_user_data")
	public static Object[][] data_new_user() {
		User sender = User.generateUserFromJson(DataConstants.USER_STANDARD_KEY);
		User receiver = User.generateRandomUser();

		return new Object[][] { { sender, receiver } };
	}

	@DataProvider(name = "ticket_transfer_to_old_user_data")
	public static Object[][] data_existing_user() {
		User sender = User.generateUserFromJson(DataConstants.USER_STANDARD_KEY);
		User receiver = new User();
		receiver.setEmailAddress("altbluetestneouser@mailinator.com");
		receiver.setFirstName("testalt");
		receiver.setLastName("testqa");
		receiver.setPass("test1111");
		receiver.setPassConfirm("test1111");

		return new Object[][] { { sender, receiver } };
	}

}
