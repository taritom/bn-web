package pages.tickets;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

import model.CreditCard;
import pages.BasePage;
import pages.components.CreditCardDetailsFrame;
import pages.components.user.TicketConfirmationDetails;
import utils.SeleniumUtils;

public class TicketsConfirmationPage extends BasePage {

	@FindBy(xpath = "//main//a[contains(@href,'tickets')]")
	private WebElement changeTicketLink;

	@FindBy(xpath = "//main//button[span[contains(text(),'Purchase tickets')]]")
	private WebElement purchaseTicketButton;

	@FindBy(xpath = "//header//span/a[contains(@href,'tickets/confirmation')]/button/span[1]")
	private WebElement shoppingBasket;

	@FindBy(xpath = "//header//span/a[contains(@href,'tickets/confirmation')]/button/span[1]//span")
	private WebElement shoppingBasketTime;

	@FindBy(xpath = "//main//form//iframe")
	private WebElement iframe;

	@FindBy(xpath = "//form//div//img[contains(@src,'credit-card-gray.svg')]/..")
	private WebElement paymentMethodCard;
	
	
	public static final String partialPath = "tickets/confirmation";

	public TicketsConfirmationPage(WebDriver driver) {
		super(driver);
	}

	@Override
	public void presetUrl() {
	}

	public void ticketsConfirmationPageSteps(CreditCard card) {
		isAtPage();
		confirmPaymentMethod("card");
		enterCreditCardDetails(card.getCardNumber(), card.getExpirationDate(), card.getCvc(), card.getZipCode());
		clickOnPurchaseTicketButton();
	}
	@Override
	public boolean isAtPage() {
		return explicitWait(15, ExpectedConditions.urlContains("tickets/confirmation"));
	}

	public boolean isCreditCardMethod() {
		return isExplicitlyWaitVisible(paymentMethodCard);
	}

	public void clickOnChangeTicketLink() {
		explicitWaitForVisiblity(changeTicketLink);
		SeleniumUtils.clickOnElement(changeTicketLink, driver);
	}

	public void enterCreditCardDetails(String creditNumber, String expDate, String cvc, String zip) {
		explicitWait(15, ExpectedConditions.frameToBeAvailableAndSwitchToIt(iframe));
		CreditCardDetailsFrame creditCardDetailsFrame = new CreditCardDetailsFrame(driver);
		creditCardDetailsFrame.enterCreditCardNumber(creditNumber);
		creditCardDetailsFrame.enterExpirationDate(expDate);
		creditCardDetailsFrame.enterCvc(cvc);
		creditCardDetailsFrame.enterZip(zip);
		driver.switchTo().parentFrame();
	}

	private void clickOnPurchaseTicketButton() {
		waitVisibilityAndClick(purchaseTicketButton);
		waitForTime(400);
	}

	private void confirmPaymentMethod(String method) {
		if (method.equals("card")) {
			if (isExplicitlyWaitVisible(3, paymentMethodCard)) {
				paymentMethodCard.click();
			}
		}
	}
	
	public Integer getTicketQuantity() {
		TicketConfirmationDetails details = new TicketConfirmationDetails(driver);
		String quantity =  details.getTicketQuantity();
		Integer intQuantity = Integer.parseInt(quantity);
		return intQuantity;
	}
}
