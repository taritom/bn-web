package utils.formatter;

import model.Venue;

/**
 * Requirement: Use "," as separator. Pattern rules: 
 * venue_name - "N" - Name which is given to venue when created;
 * address_name - "A" - Address name in real world - "Madison Square Garden" 
 * address_location - L - "Pennsilvania plaza" 
 * city - C - "New York" 
 * state - S - "NY" 
 * country - CT - "USA"
 * 
 * @author simpletask
 *
 */
public class VenueFormatter {

	public enum VenueParsePattern {
		VENUE_NAME("N"), ADDRESS_NAME("A"), ADDRESS_LOCACTION("L"), CITY("C"), STATE("S"), 
		STATE_ABBR("Sa"), COUNTRY("CT"), COUNTRY_ABBR("CTa");

		private String value;

		private VenueParsePattern(String value) {
			this.value = value;
		}

		public static VenueParsePattern[] getVenueParseValues(String text) {
			return null;
		}

		public static VenueParsePattern[] getVenueParseValues(String[] array) {
			VenueParsePattern[] arr = new VenueParsePattern[array.length];
			for (int i = 0; i < array.length; i++) {
				arr[i] = getVenueParseValue(array[i].trim());
			}
			return arr;
		}

		public static VenueParsePattern getVenueParseValue(String c) {
			VenueParsePattern[] values = values();
			for (VenueParsePattern v : values) {
				if (v.getValue().equals(c)) {
					return v;
				}
			}
			return null;
		}

		public String getValue() {
			return this.value;
		}

	}

	private String pattern;

	public VenueFormatter(String pattern) {
		this.pattern = pattern;
	}

	public Venue parse(String text) {
		text = text.trim();
		String separator = ",";
		VenueParsePattern[] patterns = VenueParsePattern.getVenueParseValues(pattern.split(separator));
		String[] values = text.split(",");
		if (patterns.length != values.length) {
			throw new IllegalArgumentException("Number of pattern elements is: " + patterns.length + " and number of text elements is: " + values.length);
		}
		return parse(patterns, values);
	}

	public String format(Venue venue) {
		String sp = ", ";
		VenueParsePattern[] patterns = VenueParsePattern.getVenueParseValues(pattern.split(sp));
		return format(patterns, venue);
	}

	private String format(VenueParsePattern[] patterns, Venue venue) {
		if (venue != null) {
			StringBuilder sb = new StringBuilder();
			for (VenueParsePattern pattern : patterns) {
				switch (pattern) {
				case VENUE_NAME:
					sb.append(venue.getName());
					break;
				case ADDRESS_NAME:
					sb.append(venue.getAddress());
					break;
				case CITY:
					sb.append(venue.getCity());
					break;
				case STATE:
					sb.append(venue.getState());
					break;
				case COUNTRY:
					sb.append(venue.getCountry());
					break;
				default:
					break;
				}
			}
			return sb.toString();
		} else {
			return null;
		}
	}

	private Venue parse(VenueParsePattern[] pattern, String[] values) {
		Venue venue = new Venue();
		int i = 0;
		for (VenueParsePattern value : pattern) {
			String val = values[i].trim();
			switch (value) {
			case VENUE_NAME:
				venue.setName(val);
				break;
			case ADDRESS_NAME:
				venue.setAddress(venue.getAddress() != null ? venue.getAddress() + ", " + val : val);
				break;
			case ADDRESS_LOCACTION:
				venue.setAddress(venue.getAddress() != null ? venue.getAddress() + ", " + val : val);
				break;
			case CITY:
				venue.setCity(val);
				break;
			case STATE:
				venue.setState(val);
				break;
			case STATE_ABBR:
				venue.setStateAbbr(val);
				break;
			case COUNTRY:
				venue.setState(val);
				break;
			case COUNTRY_ABBR:
				venue.setCountryAbbr(val);
				break;
			default:
				break;
			}
			i++;
		}
		return venue;
	}
}
