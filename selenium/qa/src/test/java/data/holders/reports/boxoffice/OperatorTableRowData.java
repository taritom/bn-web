package data.holders.reports.boxoffice;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

import data.holders.DataHolder;
import utils.ProjectUtils;

public class OperatorTableRowData implements Serializable, DataHolder, Comparable<OperatorTableRowData>{

	private static final long serialVersionUID = 3239908963716333681L;
	private String eventName;
	private String startDate;
	private BigDecimal faceValue;
	private BigDecimal revShare;
	private int boxOfficeSold;
	private BigDecimal totalValue;
	
	public String getEventName() {
		return eventName;
	}
	public void setEventName(String eventName) {
		this.eventName = eventName;
	}
	public ZonedDateTime getZonedStartDate() {
		return ProjectUtils.parseZonedDateTime(ProjectUtils.REPORTS_BOX_OFFICE_OPERATOR_TABLE_DATE, this.startDate);
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public BigDecimal getFaceValue() {
		return faceValue;
	}
	public void setFaceValue(BigDecimal faceValue) {
		this.faceValue = faceValue;
	}
	public BigDecimal getRevShare() {
		return revShare;
	}
	public void setRevShare(BigDecimal revShare) {
		this.revShare = revShare;
	}
	public int getBoxOfficeSold() {
		return boxOfficeSold;
	}
	public void setBoxOfficeSold(int boxOfficeSold) {
		this.boxOfficeSold = boxOfficeSold;
	}
	public BigDecimal getTotalValue() {
		return totalValue;
	}
	public void setTotalValue(BigDecimal totalValue) {
		this.totalValue = totalValue;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((eventName == null) ? 0 : eventName.hashCode());
		result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
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
		OperatorTableRowData other = (OperatorTableRowData) obj;
		if (eventName == null) {
			if (other.eventName != null)
				return false;
		} else if (!eventName.equals(other.eventName))
			return false;
		if (startDate == null) {
			if (other.startDate != null)
				return false;
		} else if (!startDate.equals(other.startDate))
			return false;
		return true;
	}
	
	@Override
	public int compareTo(OperatorTableRowData o) {
		int cmp = this.getZonedStartDate().compareTo(o.getZonedStartDate()); 
		if (cmp == 0) {
			cmp =this.getEventName().compareTo(o.getEventName());
		}
		return cmp;
	}
	
}
