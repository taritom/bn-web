import React from "react";
import { Typography } from "@material-ui/core";

const VenueOrganizationList = ({ classes, organizationId }) => {
	return (
		<div>
			<Typography>
				{organizationId}
			</Typography>
		</div>
	);
};
export default VenueOrganizationList;
