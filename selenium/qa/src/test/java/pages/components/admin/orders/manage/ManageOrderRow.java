package pages.components.admin.orders.manage;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import enums.POSStatus;
import model.User;
import pages.BaseComponent;
import utils.DateRange;
import utils.ProjectUtils;
import utils.SeleniumUtils;

public class ManageOrderRow extends BaseComponent{
	
	private WebElement row;

	public ManageOrderRow(WebDriver driver, WebElement row) {
		super(driver);
		this.row = row;
	}

	public void clickOnOrderNumberLink() {
		WebElement el = getOrderNumberLinkElement();
		explicitWaitForClickable(el);
		el.click();
	}
	
	public String getOrderId() {
		WebElement el = getOrderNumberLinkElement();
		String text = el.getAttribute("href");
		String searchForExpression = "/manage/";
		int indexOfExpression = text.indexOf(searchForExpression);
		String id = text.substring(indexOfExpression + searchForExpression.length());
		return id;
	}

	public void clickOnCustomerLink() {
		WebElement el = getCustomerElement();
		explicitWaitForClickable(el);
		el.click();
	}
	
	public String getOrderNumber() {
		return getOrderNumberLinkElement().getText();
	}
	
	public boolean isDateBetweenDateRange(DateRange range) throws Exception {
		LocalDate current = getDate();
		return range.isDateInRange(current);
	}
	
	public LocalDate getDate() {
		String text = getDateTimeElement().getText();
		LocalDateTime dateTime = ProjectUtils.parseDateTime(ProjectUtils.ADMIN_EVENT_MANAGE_ORDERS_ORDER_ROW, text);
		return dateTime.toLocalDate();
	}

	public String getCustomerName() {
		WebElement customer = getCustomerElement();
		String name = customer.findElement(By.xpath("./p/span[1]")).getText();
		return name;
	}
	
	public Integer getQuantity() {
		WebElement qtyElement = getQuantityElement();
		String text = qtyElement.getText();
		Integer retVal = Integer.parseInt(text);
		return retVal;
	}
	
	public User getUserCustomer() {
		String name = getCustomerName();
		String[] nameTokens = name.split(" ");
		User user = new User();
		user.setFirstName(nameTokens[0]);
		user.setLastName(nameTokens[1]);
		return user;
	}
	
	public POSStatus getStatus() {
		String text = getPOSElement().getText();
		POSStatus status = POSStatus.getStatus(text);
		return status;
	}

	private WebElement getOrderNumberLinkElement() {
		return SeleniumUtils.getChildElementFromParentLocatedBy(row, By.xpath("./div/a[1]"), driver);
	}

	private WebElement getDateTimeElement() {
		return SeleniumUtils.getChildElementFromParentLocatedBy(row, By.xpath("./div/p[1]"), driver);
	}

	private WebElement getCustomerElement() {
		return SeleniumUtils.getChildElementFromParentLocatedBy(row, By.xpath("./div/a[2]"), driver);
	}

	private WebElement getQuantityElement() {
		return SeleniumUtils.getChildElementFromParentLocatedBy(row, By.xpath("./div/p[2]"), driver);
	}

	private WebElement getOrderValueElement() {
		return SeleniumUtils.getChildElementFromParentLocatedBy(row, By.xpath("./div/p[3]"), driver);
	}

	private WebElement getPOSElement() {
		return SeleniumUtils.getChildElementFromParentLocatedBy(row, By.xpath("./div/p[4]"), driver);
	}

}
