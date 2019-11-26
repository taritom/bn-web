package test.facade.reports;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.openqa.selenium.WebDriver;
import org.testng.asserts.SoftAssert;

import data.holders.DataHolder;
import data.holders.reports.boxoffice.OperatorTableRowData;
import data.holders.reports.boxoffice.ReportsBoxOfficePageData;
import enums.POSStatus;
import model.Purchase;
import pages.admin.events.AdminEventsPage;
import pages.components.admin.AdminSideBar;
import pages.components.admin.events.EventSummaryComponent;
import pages.components.admin.orders.manage.ManageOrderRow;
import test.facade.AdminEventDashboardFacade;
import test.facade.BaseFacadeSteps;
import utils.DateRange;

public class AdminEventReportsFacade extends BaseFacadeSteps {

	private AdminEventsPage adminEvents;
	private AdminSideBar adminSideBar;
	private Map<String, Object> dataMap;

	public AdminEventReportsFacade(WebDriver driver) {
		super(driver);
		this.dataMap = new HashMap<String, Object>();
	}
	
	public boolean whenUserVerifiesOrdersForFoundEvents(DataHolder dataHolder, List<Purchase> purchases,
			DateRange range) throws Exception {
		AdminEventDashboardFacade dashboard = new AdminEventDashboardFacade(driver);
		Map<String, Purchase> mapPurchases = getMapOfPurhcasesForGivenList(purchases);
		SoftAssert sf = new SoftAssert();
		Map<String, OperatorTableRowData> data = ((ReportsBoxOfficePageData) dataHolder).getRows();
		for (Entry<String, OperatorTableRowData> e : data.entrySet()) {
			EventSummaryComponent event = getAdminEvents().findEventByName(e.getKey());
			String eventName = event.getEventName();

			Purchase purchase = mapPurchases.get(eventName);
			if(purchase == null)continue;
			event.clickOnEvent();
			dashboard.givenUserIsOnManageOrdersPage();
			
			for (Purchase.OrderLine pair : purchase.getBoxOfficeCustomers()) {
				ManageOrderRow row = dashboard.getOrderRowByOrderId(pair.getOrderNumber());
				if (row != null) {
					if (row.getStatus().equals(POSStatus.BOX_OFFICE) && !row.isDateBetweenDateRange(range)) {
						sf.fail("Date in row for user: " + pair.getCustomer().getFullNameFL() + "not in date range"
								+ range.getStartDate() + " - " + range.getEndDate());
					} 
				} else {
					sf.fail("No row found for customer: " + pair.getCustomer().getFullNameFL());
				}
			}
			givenUserIsOnAdminEventsPage();
		}
		sf.assertAll();
		return true;
	}

	private Map<String, Purchase> getMapOfPurhcasesForGivenList(List<Purchase> purchases) {
		if (purchases != null) {
			Map<String, Purchase> map = new HashMap<>();
			for (Purchase p : purchases) {
				map.put(p.getEvent().getEventName(), p);
			}
			return map;
		} else {
			return null;
		}
	}

	public void givenUserIsOnAdminEventsPage() {
		getAdminSideBar().clickOnEvents();
		getAdminEvents().isAtPage();
	}

	private AdminEventsPage getAdminEvents() {
		return this.adminEvents != null ? this.adminEvents : (this.adminEvents = new AdminEventsPage(driver));
	}

	private AdminSideBar getAdminSideBar() {
		return this.adminSideBar != null ? this.adminSideBar : (this.adminSideBar = new AdminSideBar(driver));
	}

	@Override
	protected void setData(String key, Object value) {
		this.dataMap.put(key, value);
	}

	@Override
	protected Object getData(String key) {
		return this.dataMap.get(key);
	}

}
