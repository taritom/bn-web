package test.facade;

import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.WebDriver;

import model.User;
import pages.admin.events.DashboardEventPage;
import pages.admin.orders.manage.OrdersManageAdminPage;
import pages.components.admin.orders.manage.ManageOrderRow;
import test.facade.orders.order.OrderManageFacade;

public class AdminEventDashboardFacade extends BaseFacadeSteps {

	private DashboardEventPage dashboardEventPage;
	private OrdersManageAdminPage ordersManagePage;

	private Map<String, Object> dataMap;

	public AdminEventDashboardFacade(WebDriver driver) {
		super(driver);
		this.dashboardEventPage = new DashboardEventPage(driver);
		this.ordersManagePage = new OrdersManageAdminPage(driver);
		this.dataMap = new HashMap<String, Object>();
	}

	/**
	 * Start assuming that user selected some event
	 */
	public void givenUserIsOnManageOrdersPage() {
		thenUserIsOnEventDashboardPage();
		whenUserSelectsManageOrdersFromOrdersDropDown();
		thenUserIsOnOrderManagePage();
	}

	public void whenUserSelectsManageOrdersFromOrdersDropDown() {
		dashboardEventPage.selectManageOrdersFromOrdersTab();
	}

	public ManageOrderRow getManageOrdersFirstOrder() {
		return ordersManagePage.getFirstRow();
	}

	public ManageOrderRow getManageOrderByName(User user) {
		return ordersManagePage.findOrderRowWithUserName(user.getFirstName());
	}
	
	public ManageOrderRow getOrderRowByOrderId(String orderId) {
		return ordersManagePage.findRowWithOrderId(orderId);
	}
	
	public boolean whenUserDoesSearchCheckByFirstname(User user) {
		return ordersManagePage.searchCheck(user.getFirstName(),
				p -> ordersManagePage.getNumberOfAllVisibleOrdersWithName(p));
	}

	public boolean whenUserDoesSearchCheckByLastName(User user) {
		return ordersManagePage.searchCheck(user.getLastName(),
				p -> ordersManagePage.getNumberOfAllVisibleOrdersWithName(p));
	}

	public boolean whenUserDoesSearchCheckByEmail(User user) {
		return ordersManagePage.seachCheckByEmail(user);
	}

	public boolean whenUserDoesSearchCheckByOrderNumber(String ordernumber) {
		return ordersManagePage.searchCheck(ordernumber,
				p -> ordersManagePage.getNumberOfAllVisibleOrdersWithOrderNumber(p));
	}

	public boolean whenUserChecksOrderQuantityForSpecificUser(User user, Integer purchaseQuantity) {
		ordersManagePage.clearSearchFilter();
		ManageOrderRow order = ordersManagePage
				.findOrderRowWithUserName(user.getFirstName() + " " + user.getLastName());
		Integer orderQty = order.getQuantity();
		return orderQty.compareTo(purchaseQuantity) == 0;
	}

	public void whenUserClickOnOrderLinkOfFirstOrder(OrderManageFacade orderManageFacade) {
		ManageOrderRow orderRow = ordersManagePage.getFirstRow();
		navigateToSelectedOrderPage(orderRow, orderManageFacade);
	}

	public void whenUserClicksOnOrderLinkOfGivenUser(User owner, OrderManageFacade orderManageFacade) {
		ManageOrderRow orderRow = ordersManagePage.findOrderRowWithUserName(owner.getFirstName() + " ");
		navigateToSelectedOrderPage(orderRow, orderManageFacade);
	}

	private void navigateToSelectedOrderPage(ManageOrderRow orderRow, OrderManageFacade orderFacade) {
		String orderId = orderRow.getOrderId();
		orderRow.clickOnOrderNumberLink();
		orderFacade.setSelectedOrderPage(orderId);
	}

	public void thenUserIsOnEventDashboardPage() {
		dashboardEventPage.isAtPage();
	}

	public void thenUserIsOnOrderManagePage() {
		ordersManagePage.isAtPage();
	}

	protected void setData(String key, Object value) {
		dataMap.put(key, value);
	}

	protected Object getData(String key) {
		return dataMap.get(key);
	}

}