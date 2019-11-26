package pages.admin.reports;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

import data.holders.DataHolder;
import data.holders.DataHolderProvider;
import data.holders.reports.boxoffice.OperatorTableData;
import data.holders.reports.boxoffice.ReportsBoxOfficePageData;
import model.User;
import pages.BasePage;
import pages.components.admin.reports.boxoffice.OperatorTable;
import utils.Constants;
import utils.ProjectUtils;

public class ReportsBoxOfficeSalesPage extends BasePage implements DataHolderProvider{

	@FindBy(xpath = "//p[contains(text(),'Grand total')]/following-sibling::div[1]/div/div[p[contains(text(),'Cash')]]/p[2]")
	private WebElement grandTotalCashValue;

	@FindBy(xpath = "//p[contains(text(),'Grand total')]/following-sibling::div[1]/div/div[p[contains(text(),'CreditCard')]]/p[2]")
	private WebElement grandTotalCreditCardValue;

	@FindBy(xpath = "//p[contains(text(),'Grand total')]/following-sibling::div[1]/div[p[contains(text(),'Grand total box office sales')]]/p[2]")
	private WebElement gradTotalValue;

	@FindBy(xpath = "//p[contains(text(),'Operator:')]")
	private List<WebElement> listOfOperators;

	@FindBy(xpath = "//p[contains(text(),'Operator:')]/following-sibling::div")
	private List<WebElement> listOfTablesForEachOperator;

	@FindBy(id = "startDate")
	private WebElement startDate;

	@FindBy(id = "endDate")
	private WebElement endDate;
	// this is path to element that displayes selected date range
	private String parentTitleDateXpath = "//p[contains(text(),'Transactions from')]";

	private String titleDateFromXpath = parentTitleDateXpath + "/span[1]";
	private String titleDateToXpath = parentTitleDateXpath + "/span[2]";

	public ReportsBoxOfficeSalesPage(WebDriver driver) {
		super(driver);
	}

	@Override
	public void presetUrl() {
	}

	@Override
	public boolean isAtPage() {
		return explicitWait(15, ExpectedConditions.urlContains(Constants.getAdminReportsBoxOfficeSale()));
	}

	public BigDecimal getGrandTotalCashMoneyAmount() {
		return getAccessUtils().getBigDecimalMoneyAmount(grandTotalCashValue);
	}

	public BigDecimal getGrandTotalCreditCardMoneyAmount() {
		return getAccessUtils().getBigDecimalMoneyAmount(grandTotalCreditCardValue);
	}

	public BigDecimal getGrandTotalMoneyAmount() {
		return getAccessUtils().getBigDecimalMoneyAmount(gradTotalValue);
	}

	public BigDecimal getTotalOfAllOperatorTables() {
		BigDecimal total = new BigDecimal(0);
		List<OperatorTable> tables = getAllOperatorTables();
		for (OperatorTable table : tables) {
			total = total.add(table.getOperatorTableTotal());
		}
		return total;
	}

	public boolean isEventInOperatorBoxOfficeSales(String eventName) {
		List<OperatorTable> allOperatorTables = getAllOperatorTables();
		return allOperatorTables.stream().anyMatch(table -> table.isEventInBoxSales(eventName));
	}

	public List<OperatorTable> getAllOperatorTables() {
		List<OperatorTable> retList = listOfTablesForEachOperator.stream().map(el -> new OperatorTable(driver, el))
				.collect(Collectors.toList());
		return retList;
	}
	
	public List<User> getAllOperators(){
		return listOfOperators.stream().map(el -> new User(el.getText().trim())).collect(Collectors.toList());
	}
	
	public void enterDateRanges(String from, String to) {
		enterDate(startDate, from);
		waitForTime(700);
		enterDate(endDate, to);
		waitForTime(1500);
	}

	public boolean checkIfDatesAreCorrect(String inputFromDate, String inputToDate) {
		LocalDate fromDate = getTitleFromDate();
		LocalDate toDate = getTitleToDate();
		LocalDate inputedFrom = ProjectUtils.parseDate(ProjectUtils.DATE_FORMAT, inputFromDate);
		LocalDate inputedTo = ProjectUtils.parseDate(ProjectUtils.DATE_FORMAT, inputToDate);
		return (inputedFrom.equals(fromDate) && inputedTo.equals(toDate));
	}

	public LocalDate getTitleToDate() {
		return getTitleDate(titleDateToXpath);
	}

	public LocalDate getTitleFromDate() {
		return getTitleDate(titleDateFromXpath);
	}

	private LocalDate getTitleDate(String xpath) {
		WebElement el = explicitWaitForVisibilityBy(By.xpath(xpath));
		return ProjectUtils.parseDate(ProjectUtils.REPORTS_BOX_OFFICE_TITLE_DATE_FORMAT, el.getText());
	}

	@Override
	public ReportsBoxOfficePageData getDataHolder() {
		List<User> operators = getAllOperators();
		List<OperatorTable> operatorTables = getAllOperatorTables();
		if (operators.size() == operatorTables.size()) {
			ReportsBoxOfficePageData pageData = new ReportsBoxOfficePageData();
			
			for(int i=0;i<operatorTables.size();i++) {
				OperatorTableData tableDataHolder= operatorTables.get(0).getDataHolder();
				tableDataHolder.setOperatorName(operators.get(i).getFullNameFL());
				pageData.add(tableDataHolder);
			}
			return pageData;
		} else {
			return null;
		}
	}
	
	
}