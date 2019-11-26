package utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Stream;

public class DateRange implements Iterable<LocalDate> {

	private final LocalDate startDate;
	private final LocalDate endDate;

	public DateRange(LocalDate startDate, LocalDate endDate) {
		this.startDate = startDate;
		this.endDate = endDate;
	}

	@Override
	public Iterator<LocalDate> iterator() {
		return stream().iterator();
	}

	public Stream<LocalDate> stream() {
		return Stream.iterate(startDate, d -> d.plusDays(1)).limit(ChronoUnit.DAYS.between(startDate, endDate) + 1);
	}

	public List<LocalDate> toList() {
		List<LocalDate> dates = new ArrayList<>();
		for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
			dates.add(d);
		}
		return dates;
	}

	public List<String> toStringList(DateTimeFormatter formater) {
		List<String> dates = new ArrayList<>();
		for (LocalDate d = startDate; !d.isEqual(endDate); d = d.plusDays(1)) {
			String formatedDate = formater.format(d);
			dates.add(formatedDate);
		}
		return dates;
	}
	
	public boolean isDateInRange(LocalDate current) throws Exception {
		if(startDate.isAfter(endDate)) {
			throw new Exception("end date is before start date");
		}
		boolean q = current.equals(startDate) || current.equals(endDate);
		boolean b = current.isAfter(startDate);
		boolean d = current.isBefore(endDate);
		return (q || (b && d));
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}
}