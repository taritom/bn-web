package test.facade;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Predicate;

import org.openqa.selenium.WebDriver;
import org.testng.Assert;

import model.Event;
import pages.admin.events.AdminEventsPage;
import pages.admin.events.CreateEventPage;
import pages.components.admin.AdminSideBar;
import pages.components.admin.events.EventSummaryComponent;
import pages.components.dialogs.DeleteEventDialog;
import utils.MsgConstants;
import utils.ProjectUtils;
import utils.SeleniumUtils;

public class AdminEventStepsFacade extends BaseFacadeSteps {

	private CreateEventPage createEventPage;
	private AdminEventsPage adminEvents;
	private AdminSideBar adminSideBar;
	
	private final String MANAGE_ORDER_FIRST_NAME_KEY = "mange_order_first_name";
	private final String MANAGE_ORDER_LAST_NAME_KEY = "manage_order_last_name";
	private final String MANAGE_ORDER_TICKET_NUMBER_KEY = "manage_order_ticket_number";
	
	private Map<String, Object> dataMap;

	public AdminEventStepsFacade(WebDriver driver) {
		super(driver);
		this.createEventPage = new CreateEventPage(driver);
		this.adminEvents = new AdminEventsPage(driver);
		this.adminSideBar = new AdminSideBar(driver);
		this.dataMap = new HashMap<>();
	}

	public void givenUserIsOnAdminEventsPage() {
		adminSideBar.clickOnEvents();
		adminEvents.isAtPage();
	}
	
	public EventSummaryComponent givenEventExistAndIsNotCanceled(Event event) throws URISyntaxException {
		return givenEventWithNameAndPredicateExists(event, comp -> !comp.isEventCanceled());
	}
	
	public EventSummaryComponent findEventWithName(Event event) {
		return adminEvents.findEventByName(event.getEventName());
	}

	public EventSummaryComponent findEventIsOpenedAndHasSoldItem(Event event) {
		EventSummaryComponent selectedEvent =  adminEvents.findEvent(event.getEventName(),
				comp -> comp.isEventPublished() && comp.isEventOnSale() && comp.isSoldToAmountGreaterThan(0));
		return selectedEvent;
	}

	public EventSummaryComponent givenAnyEventWithPredicateExists(Event event, Predicate<EventSummaryComponent> predicate)
			throws URISyntaxException {
		EventSummaryComponent selectedEvent = adminEvents.findEvent(predicate);
		if (selectedEvent == null) {
			createNewRandomEvent(event);
			selectedEvent = adminEvents.findEvent(predicate);
		}
		return selectedEvent;
	}

	public EventSummaryComponent givenEventWithNameAndPredicateExists(Event event,
			Predicate<EventSummaryComponent> predicate) throws URISyntaxException {
		EventSummaryComponent selectedEvent = adminEvents.findEvent(event.getEventName(), predicate);
		if (selectedEvent == null) {
			createNewRandomEvent(event);
			selectedEvent = adminEvents.findEvent(event.getEventName(), predicate);
		}
		return selectedEvent;
	}

	
	private Event createNewRandomEvent(Event event) throws URISyntaxException {
		event.setEventName(event.getEventName() + ProjectUtils.generateRandomInt(10000000));
		boolean retVal = createEvent(event);

		Assert.assertTrue(retVal,
				"Event with name: " + event.getEventName() + " does not exist and could not be created");
		String path = SeleniumUtils.getUrlPath(driver);
		retVal = retVal && path.contains("edit");
		Assert.assertTrue(retVal);
		adminSideBar.clickOnEvents();
		adminEvents.isAtPage();
		return event;
	}

	
	public boolean whenUserDeletesEvent(Event event) {
		EventSummaryComponent component = adminEvents.findEventByName(event.getEventName());
		DeleteEventDialog deleteDialog = component.deleteEvent(event);
		if (adminEvents.isNotificationDisplayedWithMessage(MsgConstants.EVENT_DELETION_FAILED, 4)) {
			deleteDialog.clickOnKeepEvent();
			return false;
		}
		return true;
	}
	
	public void whenUserUpdatesDataOfEvent(Event event) {
		createEventPage.enterEventName(event.getEventName());
		createEventPage.enterDatesAndTimes(event.getStartDate(), event.getEndDate(), null, null, null);
		createEventPage.waitForTime(1000);
	}

	public void whenUserClicksOnUpdateEvent() {
		createEventPage.clickOnUpdateButton();
	}

	public boolean whenUserEntesDataAndClicksOnSaveDraft(Event event) {
		adminEvents.clickCreateEvent();
		createEventPage.isAtPage();
		createEventFillData(event);
		createEventPage.clickOnSaveDraft();
		boolean retVal = createEventPage.checkSaveDraftMessage();
		return retVal;

	}
	
	public void whenUserClicksOnViewEventOfSelecteEvent(Event event) {
		EventSummaryComponent eventComp = findEventWithName(event);
		eventComp.viewEvent();
	}

	public boolean thenEventShouldBeCanceled(Event event) {
		EventSummaryComponent componentEvent = adminEvents.findEventByName(event.getEventName());
		if (componentEvent != null) {
			return componentEvent.isEventCanceled();
		} else {
			return false;
		}
	}

	public boolean thenUpdatedEventShoudExist(Event event) {
		EventSummaryComponent component = this.adminEvents.findEventByName(event.getEventName());
		if (component != null) {
			return component.checkIfDatesMatch(event.getStartDate());
		} else {
			return false;
		}
	}
	
	public boolean thenUserIsAtEventsPage() {
		return adminEvents.isAtPage();
	}
	
	public void whenUserRefreshesThePage() {
		driver.navigate().refresh();
		adminEvents.waitForTime(3000);
	}

	public boolean thenMessageNotificationShouldAppear(String msg) {
		return createEventPage.isNotificationDisplayedWithMessage(msg);
	}

	public boolean thenEventShouldBeDrafted(Event event) {
		EventSummaryComponent component = adminEvents.findEventByName(event.getEventName());
		return component.isEventDrafted();
	}

	public boolean createEvent(Event event) {
		adminEvents.clickCreateEvent();
		createEventPage.isAtPage();
		createEventFillData(event);
		createEventPage.clickOnPublish();
		boolean retVal = createEventPage.checkMessage();
		return retVal;
	}

	private void createEventFillData(Event event) {
		createEventPage.enterArtistName(event.getArtistName());
		createEventPage.enterEventName(event.getEventName());
		createEventPage.selectVenue(event.getVenueName());
		createEventPage.enterDatesAndTimes(event.getStartDate(), event.getEndDate(), event.getStartTime(),
				event.getEndTime(), event.getDoorTime());
		createEventPage.addTicketTypes(event.getTicketTypes());
	}

	
	protected void setData(String key, Object value) {
		dataMap.put(key, value);
	}

	protected Object getData(String key) {
		return dataMap.get(key);
	}
}
