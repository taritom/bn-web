package pages.admin.boxoffice;

import java.util.List;
import java.util.Optional;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

import pages.BasePage;
import pages.components.boxoffice.sell.TicketTypeRowComponent;
import utils.Constants;

public class SellPage extends BasePage {
	
	@FindBy(xpath = "//main//div/button[@type='button' and not(@disabled='') and span[contains(text(),'Checkout')]]")
	private WebElement checkoutButton;

	public SellPage(WebDriver driver) {
		super(driver);
	}

	@Override
	public void presetUrl() {
		setUrl(Constants.getBoxOfficeSell());
	}

	public TicketTypeRowComponent findTicketTypeRowComponentWithAvailableTickets() {
		List<WebElement> rows = findTicketTypes("+");
		Optional<TicketTypeRowComponent> optional = rows.stream().map(e -> new TicketTypeRowComponent(driver, e))
				.filter(component -> component.getRemainingTickets() > 0).findFirst();
		return optional.get();
	}
	
	public TicketTypeRowComponent findTicketTypeRowCompForTicketTypeName(String ticketType) {
		List<WebElement> rows = findTicketTypes("+");
		Optional<TicketTypeRowComponent> optional = rows.stream().map(e-> new TicketTypeRowComponent(driver, e))
				.filter(component -> component.getTicketTypeName().equals(ticketType)).findFirst();
		return optional.isPresent() ? optional.get() : null;
	}
	
	public void clickOnCheckoutButton() {
		explicitWaitForVisibilityAndClickableWithClick(checkoutButton);
	}

	/**
	 * Valid values for operator are + or -
	 * 
	 * @param operator
	 * @return
	 */
	private List<WebElement> findTicketTypes(String operator) {
		List<WebElement> elements = explicitWait(15, ExpectedConditions.visibilityOfAllElementsLocatedBy(
				findXpathByOperator(operator)));
		return elements;
	}
	
	private By findXpathByOperator(String operator) {
		return By.xpath("//main//div[div[div[div[p[text()='" + operator + "']]]]]");
	}

}