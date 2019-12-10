package data.holders.events.results;

import data.holders.DataHolder;
import model.Event;
import model.Venue;

public class EventResultCardData implements DataHolder {
	
	private String imageUrl;
	private Event event;
	private Venue venue;
	
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public Event getEvent() {
		return event;
	}
	public void setEvent(Event event) {
		this.event = event;
	}
	public Venue getVenue() {
		return venue;
	}
	public void setVenue(Venue venue) {
		this.venue = venue;
	}
	
}
