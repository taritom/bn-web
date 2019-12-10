package test;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import config.MailinatorEnum;
import model.User;
import pages.LoginPage;
import pages.components.user.EventComponent;
import pages.mailinator.MailinatorFactory;
import pages.mailinator.inbox.TransferCancelMailinatorPage;
import pages.user.MyEventsPage;
import utils.DataConstants;
import utils.MsgConstants;
import utils.SeleniumUtils;

public class TransferTicketCancelStepsIT extends BaseSteps {
//  This is commented out due to removal of transfer functionality from application
//	@Test(dataProvider = "ticket_transfer_to_new_user_data")
	public void transferTicketCancelToNewUserSteps(User sender, User receiver) {
		maximizeWindow();
		LoginPage loginPage = new LoginPage(driver);
		loginPage.login(sender);
		MyEventsPage myEventsPage = loginPage.getHeader().clickOnMyEventsInProfileDropDown();
		myEventsPage.isAtPage();

		EventComponent selectedEvent = myEventsPage.findEventWithTransferableTickets();
		String eventName = selectedEvent.getEventName();
		String ticketNumber = selectedEvent.getTicketNumber();
		String orderNumber = selectedEvent.getOrderNumber();

		selectedEvent.clickOnTransfer();
		myEventsPage.enterReceiversMail(receiver);
		boolean isTransferNotificatinDisplayed = myEventsPage
				.isNotificationDisplayedWithMessage(MsgConstants.TICKET_TRANSFER_EMAIL_LINK_SENT_SUCCESS);
		Assert.assertTrue(isTransferNotificatinDisplayed);

		TransferCancelMailinatorPage inboxPage = (TransferCancelMailinatorPage) MailinatorFactory
				.getInboxPage(MailinatorEnum.TICKET_TRANSFER_CANCEL, driver, sender.getEmailAddress());
		String mailinatorWinHandle = inboxPage.clickOnCancelTransfer(receiver.getEmailAddress());

		myEventsPage.isAtSelectedEventsPage();

		selectedEvent.clickOnCancelTransfer(ticketNumber, orderNumber);
		myEventsPage.confirmTransferTicketCancelation();

		selectedEvent.checkIfSelectedRowTicketTransferCanceled();

		loginPage.logOut();

		SeleniumUtils.switchToParentWindow(mailinatorWinHandle, driver);
		driver.navigate().refresh();
		boolean didSenderReceivedConfirmationMail = inboxPage.checkCancelConfirmationMail(receiver.getEmailAddress());
		Assert.assertTrue(didSenderReceivedConfirmationMail);

		inboxPage = (TransferCancelMailinatorPage) MailinatorFactory.getInboxPage(MailinatorEnum.TICKET_TRANSFER_CANCEL,
				driver, receiver.getEmailAddress());
		inboxPage.checkReceiversTransferCancelationMail();

	}

	@DataProvider(name = "ticket_transfer_to_new_user_data")
	public static Object[][] data_new_user() {
		User sender = User.generateUserFromJson(DataConstants.USER_STANDARD_KEY);
		User receiver = User.generateRandomUser();

		return new Object[][] { { sender, receiver } };
	}
}
