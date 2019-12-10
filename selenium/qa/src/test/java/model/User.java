package model;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;

import utils.DataConstants;
import utils.DataReader;
import utils.ProjectUtils;

public class User extends Model implements Serializable {

	private static final long serialVersionUID = 8184904779942132639L;
	@JsonProperty("email_address")
	private String emailAddress;
	@JsonProperty("password")
	private String pass;
	@JsonProperty("confirm_password")
	private String passConfirm;
	@JsonProperty("first_name")
	private String firstName;
	@JsonProperty("last_name")
	private String lastName;
	@JsonProperty("phone_number")
	private String phoneNumber;
	
	public User() {
		super();
	}
	
	public User(String fullName) {
		String[] tokens = fullName.split(" ");
		this.firstName = tokens[0];
		this.lastName = tokens[1];
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}

	public String getPassConfirm() {
		return passConfirm;
	}

	public void setPassConfirm(String passConfirm) {
		this.passConfirm = passConfirm;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((emailAddress == null) ? 0 : emailAddress.hashCode());
		result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
		result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		if (emailAddress == null) {
			if (other.emailAddress != null)
				return false;
		} else if (!emailAddress.equals(other.emailAddress))
			return false;
		if (firstName == null) {
			if (other.firstName != null)
				return false;
		} else if (!firstName.equals(other.firstName))
			return false;
		if (lastName == null) {
			if (other.lastName != null)
				return false;
		} else if (!lastName.equals(other.lastName))
			return false;
		return true;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		String[] fields = { this.emailAddress, this.firstName, this.lastName, this.pass, this.passConfirm };
		ProjectUtils.appendFields(fields, sb);
		return sb.toString();
	}
	
	public String getFullNameFL() {
		return getFirstName() + " " + getLastName();
	}

	public static TypeReference<List<User>> getListTypeReference() {
		return new TypeReference<List<User>>() {
		};
	}
	
	public static TypeReference<User> getTypeReference() {
		return new TypeReference<User>() {
		};
	}

	public static User generateSuperUser() {
		return generateUserFromJson(DataConstants.SUPERUSER_DATA_KEY);
	}
	
	public static User generateUserFromJson(String key) {
		return (User) DataReader.getInstance().getObject(key, User.getTypeReference());
	}
	
	public static Object[] generateUsersFromJson(String key) {
		Object[] users = DataReader.getInstance().getObjects(key, User.getListTypeReference());
		return users;
	}

	public static User generateRandomUser() {
		User user = generateUserFromJson(DataConstants.GENERATE_NEW_USER_KEY);
		user.setEmailAddress(user.getFirstName() + ProjectUtils.generateRandomInt(DataConstants.RANDOM_NUMBER_SIZE_10M) + "@" + DataConstants.MAILINATOR_MAIL_DOMAIN);
		return user;
	}

	public static User generateUser(String firstName, String lastName) {
		User retVal = new User();
		String email = firstName + "." + lastName + "@" + DataConstants.MAILINATOR_MAIL_DOMAIN;
		retVal.setEmailAddress(email);
		retVal.setFirstName(firstName);
		retVal.setLastName(lastName);
		retVal.setPass(DataConstants.USER_PASS);
		retVal.setPassConfirm(DataConstants.USER_PASS);
		return retVal;
	}
	
}
