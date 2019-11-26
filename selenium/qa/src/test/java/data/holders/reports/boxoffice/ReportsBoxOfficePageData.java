package data.holders.reports.boxoffice;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import data.holders.DataHolder;

public class ReportsBoxOfficePageData implements Serializable, DataHolder {
	
	private static final long serialVersionUID = -3026470462402533916L;
	private List<OperatorTableData> tables;
	private Map<String,OperatorTableRowData> rows;
	private LocalDate fromDate;
	private LocalDate toDate;
	
	public List<OperatorTableData> getTables() {
		return tables;
	}
	public void setTables(List<OperatorTableData> tables) {
		this.tables = tables;
	}
	public LocalDate getFromDate() {
		return fromDate;
	}
	public void setFromDate(LocalDate fromDate) {
		this.fromDate = fromDate;
	}
	public LocalDate getToDate() {
		return toDate;
	}
	public void setToDate(LocalDate toDate) {
		this.toDate = toDate;
	}
	public Map<String, OperatorTableRowData> getRows() {
		return rows;
	}
	public void setRows(Map<String, OperatorTableRowData> rows) {
		this.rows = rows;
	}
	public void add(OperatorTableData table) {
		if (tables == null) {
			tables = new ArrayList<>();
		}
		tables.add(table);
				
		if (rows == null) {
			rows = new HashMap<String, OperatorTableRowData>();
		}
		for(OperatorTableRowData row : table.getRows()) {
			if(rows.get(row.getEventName()) == null) {
				rows.put(row.getEventName(), row);
			}
		}
	}
}