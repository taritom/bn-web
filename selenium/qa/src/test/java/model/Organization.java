package model;

import java.io.Serializable;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;

import model.organization.FeesSchedule;
import model.organization.OtherFees;
import model.organization.Team;
import utils.DataConstants;
import utils.DataReader;
import utils.ProjectUtils;

public class Organization implements Serializable {
	
	private static final long serialVersionUID = -2120443225758565920L;
	@JsonProperty("name")
	private String name;
	@JsonProperty("phone_number")
	private String phoneNumber;
	@JsonProperty("time_zone")
	private String timeZone;
	@JsonProperty("street_address")
	private String streetAddress;
	@JsonProperty("city")
	private String city;
	@JsonProperty("state")
	private String state;
	@JsonProperty("state_abbr")
	private String stateAbbr;
	@JsonProperty("postal_code")
	private String postalCode;
	@JsonProperty("fees_schedule")
	private FeesSchedule feesSchedule;
	@JsonProperty("other_fees")
	private OtherFees otherFees;
	@JsonProperty("team")
	private Team team;
		
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getTimeZone() {
		return timeZone;
	}
	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}
	public String getStreetAddress() {
		return streetAddress;
	}
	public void setStreetAddress(String streetAddress) {
		this.streetAddress = streetAddress;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getStateAbbr() {
		return stateAbbr;
	}
	public void setStateAbbr(String stateAbbr) {
		this.stateAbbr = stateAbbr;
	}
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
	public FeesSchedule getFeesSchedule() {
		return feesSchedule;
	}
	public void setFeesSchedule(FeesSchedule feesSchedule) {
		this.feesSchedule = feesSchedule;
	}
	public OtherFees getOtherFees() {
		return otherFees;
	}
	public void setOtherFees(OtherFees otherFees) {
		this.otherFees = otherFees;
	}
	public Team getTeam() {
		return team;
	}
	public void setTeam(Team team) {
		this.team = team;
	}
	private void randomizeName() {
		this.name = this.name + ProjectUtils.generateRandomInt(DataConstants.RANDOM_NUMBER_SIZE_10M);
	}
	
	public BigDecimal getTotalWithFees(BigDecimal orderTotal, int numberOfTickets) {
		BigDecimal total = getOtherFees().getTotalWithFees(orderTotal);
		BigDecimal perTicketFeeForAllTickets = getFeesSchedule() != null ? 
				getFeesSchedule().getTotalForNumberOfTickets(numberOfTickets) : new BigDecimal(0);
		total = total.add(perTicketFeeForAllTickets);
		return total;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		return sb.append(this.getName()).toString();
	}
	
	public static TypeReference<Organization> getTypeReference(){
		return new TypeReference<Organization>() {
		};
	}
	
	public static Organization generateOrganizationFromJson(String key) {
		return generateOrganizationFromJson(key, false);
	}
	
	public static Organization generateOrganizationFromJson(String key, boolean randomizeName) {
		Organization organization = (Organization) DataReader.getInstance().getObject(key, getTypeReference());
		if (randomizeName) {
			organization.randomizeName();
		}
		return organization;
	}
	
}
