//Takes a state's full name and gives us the abbreviation
export default input => {
	const states = [
		["Arizona", "AZ"],
		["Alabama", "AL"],
		["Alaska", "AK"],
		["Arkansas", "AR"],
		["California", "CA"],
		["Colorado", "CO"],
		["Connecticut", "CT"],
		["Delaware", "DE"],
		["Florida", "FL"],
		["Georgia", "GA"],
		["Hawaii", "HI"],
		["Idaho", "ID"],
		["Illinois", "IL"],
		["Indiana", "IN"],
		["Iowa", "IA"],
		["Kansas", "KS"],
		["Kentucky", "KY"],
		["Louisiana", "LA"],
		["Maine", "ME"],
		["Maryland", "MD"],
		["Massachusetts", "MA"],
		["Michigan", "MI"],
		["Minnesota", "MN"],
		["Mississippi", "MS"],
		["Missouri", "MO"],
		["Montana", "MT"],
		["Nebraska", "NE"],
		["Nevada", "NV"],
		["New Hampshire", "NH"],
		["New Jersey", "NJ"],
		["New Mexico", "NM"],
		["New York", "NY"],
		["North Carolina", "NC"],
		["North Dakota", "ND"],
		["Ohio", "OH"],
		["Oklahoma", "OK"],
		["Oregon", "OR"],
		["Pennsylvania", "PA"],
		["Rhode Island", "RI"],
		["South Carolina", "SC"],
		["South Dakota", "SD"],
		["Tennessee", "TN"],
		["Texas", "TX"],
		["Utah", "UT"],
		["Vermont", "VT"],
		["Virginia", "VA"],
		["Washington", "WA"],
		["West Virginia", "WV"],
		["Wisconsin", "WI"],
		["Wyoming", "WY"]
	];

	input = input.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});

	let state = "";

	for (let i = 0; i < states.length; i++) {
		if (states[i][0] === input) {
			state = states[i][1];
			break;
		} else {
			if (input.length > 2) {
				state = input;
			} else {
				state = input.toUpperCase();
			}
		}
	}
	return state;
};
