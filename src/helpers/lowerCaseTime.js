export default dateTime => {
	if (!dateTime || typeof dateTime !== "string") {
		return null;
	}

	let output = "";
	const changeThese = ["AM", "PM"];
	let timePeriod = "";
	let dateTimeSansTimePeriod = "";
	changeThese.forEach(subStr => {
		if (output) return;
		if (dateTime.includes(subStr)) {
			timePeriod = dateTime
				.substring(dateTime.indexOf(subStr), dateTime.length)
				.toLowerCase();
			dateTimeSansTimePeriod = dateTime.substring(0, dateTime.indexOf(subStr));

			output = dateTimeSansTimePeriod + timePeriod;
		}
	});

	return output;
};
