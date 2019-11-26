package pages.components.admin.reports.boxoffice;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import data.holders.DataHolder;
import data.holders.DataHolderProvider;
import data.holders.reports.boxoffice.OperatorTableData;
import pages.BaseComponent;

public class OperatorTable extends BaseComponent implements DataHolderProvider {

	private WebElement container;

	private String relativeEventRowsXpath = "./div/div[" + "not(p[contains(text(),'Cash')]) and "
			+ "not(p[contains(text(),'Event name')]) and " + "not(p[contains(text(),'CreditCard')])]";

	private String relativeCreditCardPayRowXpath = "./div/div[p[contains(text(),'CreditCard')]]";

	private String relativeCashPayRowXpath = "./div/div[p[contains(text(),'Cash')]]";

	private String relativeOperatorTotalRowXpath = "./div[p[contains(text(),'Operator total')]]";

	public OperatorTable(WebDriver driver, WebElement container) {
		super(driver);
		this.container = container;
	}

	public BigDecimal getOperatorTableTotal() {
		// first check if sum and total are the same
		return getOrderTotalRow().getTotalValueMoneyAmount();
	}

	public boolean isTotalEqualToSums() {
		BigDecimal eventsSum = getTotalSumOfRowsByEvents();
		BigDecimal paymentMethodSum = getTotalSumOfRowsByPaymentMethods();
		BigDecimal total = sumTotal(new BigDecimal(0), getOrderTotalRow());
		return total.compareTo(paymentMethodSum) == 0 && total.compareTo(eventsSum) == 0;
	}

	public boolean isSumByPaymentMethodsAndSumEventsEqual() {
		return getTotalSumOfRowsByPaymentMethods().compareTo(getTotalSumOfRowsByEvents()) == 0;
	}

	public BigDecimal getTotalSumOfRowsByPaymentMethods() {
		BigDecimal total = new BigDecimal(0);
		OperatorTableRow creditCardRow = getCreditCardRow();
		OperatorTableRow cashRow = getCashRow();
		total = sumTotal(total, creditCardRow);
		total = sumTotal(total, cashRow);
		return total;
	}

	public BigDecimal getTotalSumOfRowsByEvents() {
		List<OperatorTableRow> eventRows = getAllEventRows();
		BigDecimal total = new BigDecimal(0);
		for (OperatorTableRow row : eventRows) {
			total = sumTotal(total, row);
		}
		return total;
	}

	public boolean isEventInBoxSales(String eventName) {
		return isOperatorRowPresent(row -> row.getEventName().contains(eventName));
	}

	public boolean isOperatorRowPresent(Predicate<OperatorTableRow> predicate) {
		List<OperatorTableRow> tableRows = getAllEventRows();
		if (tableRows != null) {
			boolean retVal = tableRows.stream().anyMatch(predicate);
			return retVal;
		}
		return false;
	}

	public OperatorTableRow findOperatorTableRow(Predicate<OperatorTableRow> predicate) {
		List<OperatorTableRow> tableRows = getAllEventRows();
		if (tableRows != null) {
			Optional<OperatorTableRow> optional = tableRows.stream().filter(predicate).findFirst();
			return optional.isPresent() ? optional.get() : null;
		}
		return null;
	}

	private BigDecimal sumTotal(BigDecimal total, OperatorTableRow row) {
		if (row != null && row.getTotalValueMoneyAmount() != null) {
			total = total.add(row.getTotalValueMoneyAmount());
		}
		return total;
	}

	private List<OperatorTableRow> getAllEventRows() {
		List<WebElement> eventRows = findAllEventRows();
		if (eventRows != null && !eventRows.isEmpty()) {
			return eventRows.stream().map(el -> new OperatorTableRow(driver, el)).collect(Collectors.toList());
		}
		return null;
	}

	private List<WebElement> findAllEventRows() {
		return getAccessUtils().getChildElementsFromParentLocatedBy(container, By.xpath(relativeEventRowsXpath));
	}

	private OperatorTableRow getCreditCardRow() {
		return getOperatorTableRow(By.xpath(relativeCreditCardPayRowXpath));
	}

	private OperatorTableRow getCashRow() {
		return getOperatorTableRow(By.xpath(relativeCashPayRowXpath));
	}

	private OperatorTableRow getOrderTotalRow() {
		return getOperatorTableRow(By.xpath(relativeOperatorTotalRowXpath));
	}

	private OperatorTableRow getOperatorTableRow(By by) {
		if (getAccessUtils().isChildElementVisibleFromParentLocatedBy(container, by)) {
			WebElement row = getAccessUtils().getChildElementFromParentLocatedBy(container, by);
			return new OperatorTableRow(driver, row);
		}
		return null;
	}

	@Override
	public OperatorTableData getDataHolder() {
		List<OperatorTableRow> rows = getAllEventRows();
		OperatorTableData tableData = new OperatorTableData();
		rows.stream().map(row->row.getDataHolder()).forEach(dataRow->tableData.addRow(dataRow));
		return tableData;
	}	

}
