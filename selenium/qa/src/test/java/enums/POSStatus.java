package enums;

public enum POSStatus {
	
	WEB("Web"),
	BOX_OFFICE("Box office");
	
	private String value;

	private POSStatus(String value) {
		this.value = value;
	}
	
	public static POSStatus getStatus(String value) {
		for(POSStatus st : values()) {
			if(st.getValue().equals(value)) {
				return st;
			}
		}
		return null;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}