package test.facade;

import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import org.testng.Assert;

import model.Event;
import model.Purchase;
import model.TicketType;
import model.User;
import pages.admin.boxoffice.GuestPage;
import pages.admin.boxoffice.SellPage;
import pages.components.admin.AdminBoxOfficeSideBar;
import pages.components.boxoffice.sell.TicketTypeRowComponent;
import utils.ProjectUtils;
import pages.components.dialogs.BoxOfficeSellCheckoutDialog;
import pages.components.dialogs.BoxOfficeSellOrderCompleteDialog;

public class AdminBoxOfficeFacade extends BaseFacadeSteps {

	private SellPage sellPage;
	private GuestPage guestPage;
	private AdminBoxOfficeSideBar boxOfficeSideBar;
	private BoxOfficeSellCheckoutDialog checkoutDialog;
	private Map<String, Object> dataMap;

	private final String SELL_ORDER_NUMBER_COMPLETE_KEY = "sell_order_number_complete_key";
	private final String ORDER_COMPLETE_DIALOG_KEY = "order_complete_dialog";

	public AdminBoxOfficeFacade(WebDriver driver) {
		super(driver);
		this.sellPage = new SellPage(driver);
		this.guestPage = new GuestPage(driver);
		this.boxOfficeSideBar = new AdminBoxOfficeSideBar(driver);
		this.checkoutDialog = new BoxOfficeSellCheckoutDialog(driver);
		this.dataMap = new HashMap<>();
	}

	public void givenUserIsOnBoxOfficePage() {
		sellPage.getHeader().clickOnBoxOfficeLink();
		thenUserIsAtSellPage();
	}

	public void givenUserIsOnSellPage() {
		boxOfficeSideBar.clickOnSellLink();
		sellPage.isAtPage();
	}

	public void givenUserIsOnGuestPage() {
		boxOfficeSideBar.clickOnGuestLink();
		guestPage.isAtPage();
	}

	public void givenEventIsSelected(String eventName) {
		guestPage.getHeader().selectEventFromAdminDropDown(eventName);
	}

	public void givenBoxOfficeEventIsSelected(String eventName) {
		sellPage.getHeader().selectEventFromBoxOfficeDropDown(eventName);
	}

	public void whenUserSellsTicketToCustomer(Purchase purchase, String paymentOption, User customer) {
		Event event = purchase.getEvent();
		
		givenEventIsSelected(purchase.getEvent().getEventName());
		TicketType ticketType = event.getTicketTypes().get(0);
		TicketTypeRowComponent ticketTypeRow = whenUserSelectsTicketType(
				ticketType.getTicketTypeName());
		
		whenUserAddsQuantityAndClicksCheckout(ticketTypeRow, purchase.getNumberOfTickets());
		if ("card".equalsIgnoreCase(paymentOption)) {
			whenUserPicksCardOption();
		} else {
			BigDecimal ticketPrice = new BigDecimal(ticketType.getPrice());
			BigDecimal numberOfTickets = new BigDecimal(purchase.getNumberOfTickets());
			BigDecimal tenderedAmount = ticketPrice.multiply(numberOfTickets);
			whenUserPicksCashOption();
			whenUserEntersTenderedAndChecksChangeDueIsCorrect(tenderedAmount.intValue());
		}
		whenUserEntersGuestInformationAndClicksOnCompleteOrder(customer, "Box office reports");
		thenUserShouldSeeOrderCompleteDialog();
		String orderNumber = getOrderNumberFromCompleteDialog();
		whenUserClickOnReturnToBoxOffice();
		//add customer and order number to purchase
		purchase.addBoxOfficeOrderLine(customer, orderNumber);
	}

	public boolean whenUserSearchesByUserName(User user) {
		String searchValue = user.getFirstName();
		return whenUserSearchesByUserParams(searchValue);
	}

	public boolean whenUserSearchesByLastName(User user) {
		String lastname = user.getLastName();
		return whenUserSearchesByUserParams(lastname);
	}
	
	public boolean whenUserSearchesByFirstNameAndTicketNumber(User user) {
		String firstname = user.getFirstName();
		boolean isNameSearchValid = whenUserSearchesByUserParams(firstname);
		String ticketNumber = guestPage.getTicketNumber(firstname);
 		guestPage.enterSearchParameters(ticketNumber);
 		
 		boolean isTicketInSearchResults = guestPage.isTicketNumberInGuestResults(ticketNumber);
 		return isTicketInSearchResults && isNameSearchValid;
		
	}
	
	public boolean whenUserSearchesByEmail(User user) {
		Integer allGuests = cleanSearchAndGetNumberOfResults();
		guestPage.enterSearchParameters(user.getEmailAddress());
		Integer searchResults = guestPage.getNumberOfResultsOfSearch(user.getFirstName());
		return searchResults.compareTo(allGuests) < 0;
	}
	
	private boolean whenUserSearchesByUserParams(String param) {
		Integer allGuests = cleanSearchAndGetNumberOfResults();
		guestPage.enterSearchParameters(param);
		Integer searchResults = guestPage.getNumberOfResultsOfSearch(param);
		return searchResults.compareTo(allGuests) < 0;
	}
	
	private Integer cleanSearchAndGetNumberOfResults() {
		guestPage.enterSearchParameters("");
		Integer numberOfAllGuests = guestPage.getNumberOfAllGuestOnPage();
		if (!ProjectUtils.isNumberGreaterThan(numberOfAllGuests, 0)) {
			throw new NoSuchElementException("No guests found on admin guest page");
		}
		return numberOfAllGuests;
	}

	public TicketTypeRowComponent whenUserSelectsTicketType() {
		return sellPage.findTicketTypeRowComponentWithAvailableTickets();
	}

	public TicketTypeRowComponent whenUserSelectsTicketType(String ticketTypeName) {
		return sellPage.findTicketTypeRowCompForTicketTypeName(ticketTypeName);
	}

	public void whenUserAddsQuantityAndClicksCheckout(TicketTypeRowComponent row, int addNumberOfTickets) {
		int qtyBefore = row.getCurrentQuantity();
		row.addTickets(addNumberOfTickets);
		int currentQty = row.getCurrentQuantity();
		Assert.assertTrue((qtyBefore + currentQty) == addNumberOfTickets);
		sellPage.clickOnCheckoutButton();
	}

	public void whenUserRemovesQuantityAndClicksCheckout(TicketTypeRowComponent row, int removeNumberOfTickets) {
		int qtyBefore = row.getCurrentQuantity();
		row.removeTickets(removeNumberOfTickets);
		int qtyAfter = row.getCurrentQuantity();
		Assert.assertTrue((qtyBefore - removeNumberOfTickets) == qtyAfter,
				"Tried to remove more tickets that was available");
		sellPage.clickOnCheckoutButton();
	}

	public boolean thenCheckoutDialogIsVisible() {
		return checkoutDialog.isVisible();
	}
	
	public void whenUserClicksOnChangeTicketOnCheckoutDialog() {
		checkoutDialog.clickOnChangeTicketLink();
	}

	public void whenUserPicksCashOption() {
		checkoutDialog.clickOnPayWithCash();
	}
	
	public void whenUserPicksCardOption() {
		checkoutDialog.clickOnPayWithCreditCard();
	}

	public boolean whenUserEntersTenderedAndChecksChangeDueIsCorrect(int tenderedAmount) {
		checkoutDialog.enterAmountToTenderedField(tenderedAmount);
		
		Double doubleCheckoutDue = checkoutDialog.getChangeDueAmount();
		Double doubleOrderTotal = checkoutDialog.getOrderTotal();
		
		BigDecimal doubleTendered = new BigDecimal(tenderedAmount);
		BigDecimal checkDue = new BigDecimal(doubleCheckoutDue != null ? doubleCheckoutDue : 0);
		BigDecimal orderTotal = new BigDecimal(doubleOrderTotal != null ? doubleOrderTotal : 0);
		if (orderTotal.compareTo(doubleTendered) < 0) {
			BigDecimal dueCalculated = doubleTendered.subtract(orderTotal);
			return dueCalculated.compareTo(checkDue) == 0;
		} else {
			return true;
		}
	}

	public Double whenUserChecksOrderTotal() {
		return checkoutDialog.getOrderTotal();
	}

	public void whenUserEntersGuestInformationAndClicksOnCompleteOrder(User guest, String orderNote) {
		checkoutDialog.enterFirstName(guest.getFirstName());
		checkoutDialog.enterLastName(guest.getLastName());
		checkoutDialog.enterEmailAddress(guest.getEmailAddress());
		checkoutDialog.enterPhoneNumber(guest.getPhoneNumber());
		checkoutDialog.enterOrderNote(orderNote);
		checkoutDialog.waitForTime(1000);
		checkoutDialog.clickOnCompleteOrderButton();
	}

	public boolean thenUserShouldSeeOrderCompleteDialog() {
		BoxOfficeSellOrderCompleteDialog orderCompleteDialog = new BoxOfficeSellOrderCompleteDialog(driver);
		if(orderCompleteDialog.isVisible()) {
			setData(ORDER_COMPLETE_DIALOG_KEY, orderCompleteDialog);
			return true;
		} else {
			return false;
		}
	}
	
	public String getOrderNumberFromCompleteDialog() {
		BoxOfficeSellOrderCompleteDialog orderCompleteDialog = new BoxOfficeSellOrderCompleteDialog(driver);
		return orderCompleteDialog.getOrderNumber();
	}
	
	public void whenUserClickOnReturnToBoxOffice() {
		BoxOfficeSellOrderCompleteDialog orderCompleteDialog = (BoxOfficeSellOrderCompleteDialog) getData(ORDER_COMPLETE_DIALOG_KEY);
		orderCompleteDialog.clickOnReturnTOBoxOfficeButton();
	}

	public void thenUserShouldSeeOrderCompleteDialogAndGetOrderNumber() {
		BoxOfficeSellOrderCompleteDialog orderComplete = new BoxOfficeSellOrderCompleteDialog(driver);
		Assert.assertTrue(orderComplete.isVisible());
		String orderNum = orderComplete.getOrderNumber();
		setData(SELL_ORDER_NUMBER_COMPLETE_KEY, orderNum);
	}

	public void thenUserIsAtSellPage() {
		this.sellPage.isAtPage();
	}

	protected void setData(String key, Object value) {
		dataMap.put(key, value);
	}

	protected Object getData(String key) {
		return dataMap.get(key);
	}

}
