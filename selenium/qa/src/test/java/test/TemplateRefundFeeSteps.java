package test;

import org.testng.Assert;

import model.Event;
import model.Organization;
import model.Purchase;
import model.User;
import pages.components.admin.events.EventSummaryComponent;
import pages.components.dialogs.IssueRefundDialog.RefundReason;
import test.facade.AdminEventDashboardFacade;
import test.facade.AdminEventStepsFacade;
import test.facade.EventStepsFacade;
import test.facade.FacadeProvider;
import test.facade.LoginStepsFacade;
import test.facade.OrganizationStepsFacade;
import test.facade.orders.order.OrderManageFacade;

public abstract class TemplateRefundFeeSteps extends BaseSteps {

	private FacadeProvider facadeProvider;

	public abstract void customSteps();

	public void templateSteps(Purchase purchase, User user) throws Exception {
		maximizeWindow();

		login(user);
		emptyShoppingBasketIfFull();
		createEvent(user, purchase.getEvent());
		purchaseTickets(purchase);
		selectOrganization(purchase.getEvent().getOrganization());
		navigateToOrderManage(purchase.getEvent());
		//this method is abstract and must be implemented with custom logic in child classes
		customSteps();
		
		cancelEvent(purchase.getEvent());
		logOut();
	}

	public void login(User user) {
		getLoginFacade().givenAdminUserIsLogedIn(user);
	}

	public void createEvent(User superuser, Event event) throws Exception {
		selectOrganization(event.getOrganization());
		getAdminEventsFacade().createEvent(event);
		getAdminEventsFacade().givenUserIsOnAdminEventsPage();
	}

	public void selectOrganization(Organization org) throws Exception {
		getOrganizationFacade().givenOrganizationExist(org);
	}
	
	public void emptyShoppingBasketIfFull() {
		getEventFacade().whenShoppingBasketFullEmptyIt();
		getLoginFacade().whenUserClickOnHeaderLogo();
	}

	public void purchaseTickets(Purchase purchase) throws Exception {
		getAdminEventsFacade().whenUserClicksOnViewEventOfSelecteEvent(purchase.getEvent());
		getEventFacade().whenUserClicksOnPurchaseTicketLink();
		getEventFacade().whenUserSelectsNumberOfTicketsForEachTicketTypeAndClicksOnContinue(purchase);
		getEventFacade().thenUserIsAtConfirmationPage();
		getEventFacade().whenUserEntersCreditCardDetailsAndClicksOnPurchase(purchase.getCreditCard());
		getEventFacade().thenUserIsAtTicketPurchaseSuccessPage();
		getLoginFacade().whenUserClickOnHeaderLogo();
	}

	public void navigateToOrderManage(Event event) {
		getAdminEventsFacade().thenUserIsAtEventsPage();
		EventSummaryComponent eventCardComp = getAdminEventsFacade().findEventIsOpenedAndHasSoldItem(event);
		eventCardComp.clickOnEvent();
		getEventDashboardFacade().givenUserIsOnManageOrdersPage();
		getEventDashboardFacade().whenUserClickOnOrderLinkOfFirstOrder(getOrderManageFacade());
		getOrderManageFacade().whenUserExpandOrderDetailsAndCheckIfExpanded();
	}

	public void refundSteps(RefundReason refundReason) {
		getOrderManageFacade().whenUserClicksOnRefundButton();
		boolean isRefundDialogVisible = getOrderManageFacade().thenRefundDialogShouldBeVisible();
		Assert.assertTrue(isRefundDialogVisible, "Refund dialog not visible");
		boolean isRefundDialogAmountCorrect = getOrderManageFacade().thenRefundTotalOnRefundDialogShouldBeCorrect();
		Assert.assertTrue(isRefundDialogAmountCorrect);
		getOrderManageFacade().whenUserSelectRefundReasonAndClicksOnConfirmButton(refundReason);
		getOrderManageFacade().whenUserClicksOnGotItButtonOnRefundSuccessDialog();

	}

	public void cancelEvent(Event event) {
		try {
			getLoginFacade().whenUserClickOnHeaderLogo();
			getAdminEventsFacade().thenUserIsAtEventsPage();
			getAdminEventsFacade().whenUserRefreshesThePage();
			getAdminEventsFacade().thenUserIsAtEventsPage();
			EventSummaryComponent eventComponent = getAdminEventsFacade().findEventWithName(event);
			eventComponent.cancelEvent();
		} catch (Exception e) {
			// log it once logger is added
		}
	}

	public void logOut() {
		try {
			getLoginFacade().logOut();
		}catch (Exception e) {
			// log it once logger is added
		}
	}
	private FacadeProvider getFacadeProvider() {
		return this.facadeProvider != null ? this.facadeProvider : 
			(this.facadeProvider = new FacadeProvider(driver));
	}

	public LoginStepsFacade getLoginFacade() {
		return getFacadeProvider().getLoginFacade();
	}

	public OrganizationStepsFacade getOrganizationFacade() {
		return getFacadeProvider().getOrganizationFacade();
	}

	public AdminEventStepsFacade getAdminEventsFacade() {
		return getFacadeProvider().getAdminEventStepsFacade();
	}

	public EventStepsFacade getEventFacade() {
		return getFacadeProvider().getEventFacade();
	}

	public AdminEventDashboardFacade getEventDashboardFacade() {
		return getFacadeProvider().getEventDashboardFacade();
	}
	
	public OrderManageFacade getOrderManageFacade() {
		return getFacadeProvider().getOrderManageFacade();
	}
	
}