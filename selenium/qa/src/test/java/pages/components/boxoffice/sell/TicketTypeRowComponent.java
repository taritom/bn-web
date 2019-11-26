package pages.components.boxoffice.sell;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import pages.BaseComponent;
import utils.SeleniumUtils;

public class TicketTypeRowComponent extends BaseComponent {

	private WebElement ticketTypeRow;

	public TicketTypeRowComponent(WebDriver driver, WebElement row) {
		super(driver);
		this.ticketTypeRow = row;
	}

	public void addTickets(int numberOfTickets) {
		WebElement plus = findOperatorElement("+");
		explicitWaitForVisiblity(plus);
		for (int i = 0; i < numberOfTickets; i++) {
			plus.click();
		}

	}

	public void removeTickets(int numberOfTickets) {
		WebElement minus = findOperatorElement("-");
		explicitWaitForVisiblity(minus);
		int currentQuantity = getCurrentQuantity();
		if (currentQuantity <= numberOfTickets && (currentQuantity - 1) > 0) {
			numberOfTickets = currentQuantity - 1;
		} else if (currentQuantity == 1 || currentQuantity == 0) {
			numberOfTickets = 0;
		}
		for (int k = 0; k < numberOfTickets; k++) {
			SeleniumUtils.refreshElement(minus, driver);
			waitVisibilityAndClick(minus);
		}
	}

	private WebElement findOperatorElement(String opertator) {
		WebElement operatorElement = SeleniumUtils.getChildElementFromParentLocatedBy(ticketTypeRow,
				By.xpath("//div[p[text()='" + opertator + "']]"), driver);
		return operatorElement;
	}

	public int getCurrentQuantity() {
		WebElement currentQuantity = SeleniumUtils.getChildElementFromParentLocatedBy(ticketTypeRow,
				By.xpath(".//div[p[text()='-']]/following-sibling::p"), driver);
		String text = currentQuantity.getText();
		Integer quantity = Integer.parseInt(text);
		return quantity;
	}

	public int getRemainingTickets() {
		WebElement remainingTicketParagraph = SeleniumUtils.getChildElementFromParentLocatedBy(ticketTypeRow,
				By.xpath("./div/p[2]"), driver);
		String text = remainingTicketParagraph.getText();
		String ticketNum = text.split(" ")[0];
		return Integer.parseInt(ticketNum);
	}

	public String getTicketTypeName() {
		WebElement ticketTypeName = SeleniumUtils.getChildElementFromParentLocatedBy(ticketTypeRow,
				By.xpath("./div/p[1]"), driver);
		String name = ticketTypeName.getText();
		return name.trim();
	}

	public Double getTicketPrice() {
		return SeleniumUtils.getDoubleAmount(ticketTypeRow, ".//p[contains(text(),'$')]", driver);
	}

}