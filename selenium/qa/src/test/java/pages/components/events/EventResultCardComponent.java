package pages.components.events;

import java.time.LocalDateTime;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import data.holders.DataHolder;
import data.holders.DataHolderProvider;
import data.holders.events.results.EventResultCardData;
import model.Event;
import model.Venue;
import pages.BaseComponent;
import utils.ProjectUtils;
import utils.formatter.VenueFormatter;

public class EventResultCardComponent extends BaseComponent implements DataHolderProvider {

	private WebElement container;
	
	private String relativeImageXpath = ".//div[contains(@style,'background-image')]";
	
	private String relativeStartDateTimeXpath = "./div/div[2]/div/p[1]";
	private String relativeEventNameXpath = "./div/div[2]/div/p[2]";
	private String relativeVenueXpath = "./div/div[3]/p";
	
	public EventResultCardComponent(WebDriver driver, WebElement container) {
		super(driver);
		this.container = container;
	}
	
	@Override
	public DataHolder getDataHolder() {
		EventResultCardData data = new EventResultCardData();
		data.setEvent(getEventInfo());
		data.setVenue(getVenueInfo());
		data.setImageUrl(getImageUrl());
		return data;
	}
	
	public Venue getVenueInfo() {
		String venueText = getAccessUtils().getTextOfElement(getVenueElement());
		Venue venue = new VenueFormatter("N, C, S").parse(venueText);
		return venue;
	}

	public Event getEventInfo() {
//		extracted format: "Nov 15 · Fri, 9:30pm"
		String dateTimeUnformated = getAccessUtils().getTextOfElement(getStartDateTimeElement());

//		formating to achieve is for example: "Nov 15 Fri, 9:30 PM", "MMM dd EEE, h:mm a"
		String[] dateTimeTokens = dateTimeUnformated.split("\u00B7");
		String dayAndTime = dateTimeTokens[1].replace("pm", " PM").replace("am", " AM");
		StringBuilder sb = new StringBuilder();
		sb.append(dateTimeTokens[0].trim() + " ").append(dayAndTime.trim());
		LocalDateTime date = ProjectUtils.parseDateTimeWithoutYear(ProjectUtils.EVENT_RESULT_SUMMARY_DATE_TIME_FORMAT, sb.toString());
		
		Event event = new Event();
		event.setDate(date);
		String eventName = getAccessUtils().getTextOfElement(getEventNameElement());
		event.setEventName(eventName);
		return event;
	}

	private String getImageUrl() {
		return ProjectUtils.getImageUrlFromStyleAttribute(getImageElement());
	}
	
	private WebElement getImageElement() {
		return getAccessUtils().getChildElementFromParentLocatedBy(container, By.xpath(relativeImageXpath));
	}
	
	private WebElement getStartDateTimeElement() {
		return getAccessUtils().getChildElementFromParentLocatedBy(container, By.xpath(relativeStartDateTimeXpath));
	}
	
	private WebElement getEventNameElement() {
		return getAccessUtils().getChildElementFromParentLocatedBy(container, By.xpath(relativeEventNameXpath));
	}
	private WebElement getVenueElement() {
		return getAccessUtils().getChildElementFromParentLocatedBy(container, By.xpath(relativeVenueXpath));
	}

}
