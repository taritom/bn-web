package pages.components.dialogs;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class RefundOverrideDialog extends DialogContainerComponent {

	@FindBy(xpath = "//h1[contains(text(),'Refund Override')]")
	private WebElement title;
	
	@FindBy(xpath = "//p[b[contains(text(),'Are you sure you want to process the refund?')]]")
	private WebElement content;
	
	public RefundOverrideDialog(WebDriver driver) {
		super(driver);
	}
	
	public void clickOnCancelButton() {
		clickOnButtonWithLabel("Cancel");
	}
	
	public void clickOnConfirmButton() {
		clickOnButtonWithLabel("Confirm");
	}

}
