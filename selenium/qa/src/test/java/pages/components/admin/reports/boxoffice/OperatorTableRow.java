package pages.components.admin.reports.boxoffice;

import java.math.BigDecimal;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import data.holders.DataHolderProvider;
import data.holders.reports.boxoffice.OperatorTableRowData;
import pages.BaseComponent;

public class OperatorTableRow extends BaseComponent implements DataHolderProvider {

	public WebElement container;

	private String relativeTotalValueXpath = "./p[last()]";

	private String relativeBoxOfficeSoldValueXpath = "./p[5]";

	private String relativeRevShareXpath = "./p[4]";

	private String relativeFaceValueXpath = "./p[3]";

	private String relativeDateXpath = "./p[2]";

	private String relativeEventNameXpath = "./p[1]";

	public OperatorTableRow(WebDriver driver, WebElement container) {
		super(driver);
		this.container = container;
	}

	public String getEventName() {
		return getAccessUtils().getText(container, By.xpath(relativeEventNameXpath));

	}

	public BigDecimal getTotalValueMoneyAmount() {
		return getAccessUtils().getBigDecimalMoneyAmount(container, relativeTotalValueXpath);
	}

	public Integer getBoxOfficeQuantity() {
		return getAccessUtils().getIntAmount(container, relativeBoxOfficeSoldValueXpath);
	}

	public BigDecimal getRevShareMoneyAmount() {
		return getAccessUtils().getBigDecimalMoneyAmount(container, relativeRevShareXpath);
	}

	public BigDecimal getFaceValueMoneyAmount() {
		return getAccessUtils().getBigDecimalMoneyAmount(container, relativeFaceValueXpath);
	}
	
	public String getDate() {
		WebElement el = getAccessUtils().getChildElementFromParentLocatedBy(container, By.xpath(relativeDateXpath));
		return el != null ? el.getText() : null;
	}
	
	public OperatorTableRowData getDataHolder() {
		OperatorTableRowData data = new OperatorTableRowData();
		data.setEventName(getEventName());
		data.setStartDate(getDate());
		data.setBoxOfficeSold(getBoxOfficeQuantity());
		return data;
	}

}
