import React from "react";
import { Typography } from "@material-ui/core";

const VenueOrganizationList = ({ organization }) => {
	return <Typography> {organization.name}</Typography>;
};
export default VenueOrganizationList;
