package data.holders.reports.boxoffice;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import data.holders.DataHolder;

public class OperatorTableData implements Serializable, DataHolder, Comparable<OperatorTableData> {

	private static final long serialVersionUID = -8329010739550537892L;
	private String operatorName;
	private List<OperatorTableRowData> rows;
	private BigDecimal total;
	
	public String getOperatorName() {
		return operatorName;
	}
	public void setOperatorName(String operatorName) {
		this.operatorName = operatorName;
	}
	public List<OperatorTableRowData> getRows() {
		return rows;
	}
	public void setRows(List<OperatorTableRowData> rows) {
		this.rows = rows;
	}
	public BigDecimal getTotal() {
		return total;
	}
	public void setTotal(BigDecimal total) {
		this.total = total;
	}
	
	public void addRow(OperatorTableRowData row) {
		if (rows == null) {
			rows = new ArrayList<OperatorTableRowData>();
		}
		rows.add(row);
	}
	@Override
	public int compareTo(OperatorTableData o) {
		String thisNameLowerCase = this.getOperatorName().toLowerCase();
		String otherNameLowerCase = o.getOperatorName().toLowerCase();
		int cmp = thisNameLowerCase.compareTo(otherNameLowerCase);
		return cmp;
	}
	
}
