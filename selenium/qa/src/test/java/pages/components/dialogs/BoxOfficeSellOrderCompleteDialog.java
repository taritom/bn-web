package pages.components.dialogs;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import utils.ProjectUtils;

public class BoxOfficeSellOrderCompleteDialog extends DialogContainerComponent {
	
	@FindBy(xpath = "//div/h1[contains(text(),'Order complete')]")
	private WebElement dialogTitle;
	
	@FindBy(xpath = "//div[h1[contains(text(),'Order complete')]]/div[2]/div/p[1]")
	private WebElement orderNumber;
	
	@FindBy(xpath = "////div//input[@name='cellNumber' and @placeholder='Enter cellphone number']")
	private WebElement cellPhoneNumberField;
	
	@FindBy(xpath = "//div/button[span[contains(text(),'Check-in Guest')]]")
	private WebElement checkInGuestButton;

	@FindBy(xpath = "//div//a/button[span[contains(text(),'View order')]]")
	private WebElement viewOrder;
	
	@FindBy(xpath = "//div/button[span[contains(text(),'Return to Box Office')]]")
	private WebElement returnToBoxOfficeButton;

	public BoxOfficeSellOrderCompleteDialog(WebDriver driver) {
		super(driver);
	}
	
	public String getOrderNumber() {
		explicitWaitForVisiblity(orderNumber);
		String text = ProjectUtils.getTextForElementAndReplace(orderNumber, "#", "").trim();
		String orderNum = text.split(" ")[1];
		return orderNum;
	}
	
	public void clickOnReturnTOBoxOfficeButton() {
		explicitWaitForVisibilityAndClickableWithClick(returnToBoxOfficeButton);
	}

}
