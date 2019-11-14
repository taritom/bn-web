import React, { Component } from "react";
import { Grid, Hidden, Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

import LeftAlignedSubCard from "../../../../../elements/LeftAlignedSubCard";
import FormatInputLabel from "../../../../../elements/form/FormatInputLabel";
import RichTextInputField from "../../../../../elements/form/rich-editor/RichTextInputField";
import InputGroup from "../../../../../common/form/InputGroup";
import Button from "../../../../../elements/Button";

const styles = theme => ({
	root: {
		marginTop: 60,
		marginBottom: 60,

		[theme.breakpoints.down("sm")]: {
			marginTop: 20,
			marginBottom: 20
		}
	},
	content: {
		paddingLeft: theme.spacing.unit * 8 - 2,
		paddingRight: theme.spacing.unit * 8,
		paddingTop: 20,
		paddingBottom: 20,

		[theme.breakpoints.down("sm")]: {
			padding: 20
		}
	},
	buttonContainer: {
		marginTop: 30,
		display: "flex",
		justifyContent: "flex-end",

		[theme.breakpoints.down("sm")]: {
			flexDirection: "column"
		}
	}
});

const NewAnnouncementCard = ({
	classes,
	onChangeBody,
	errors,
	subject,
	htmlBodyString,
	onChangeSubject,
	onPreviewSend,
	onSend
}) => {
	return (
		<div className={classes.root}>
			<LeftAlignedSubCard active>
				<div className={classes.content}>
					<InputGroup
						error={errors.subject}
						value={subject}
						name="subject"
						label="Email subject line *"
						type="text"
						onChange={onChangeSubject}
						placeholder={
							"An important message regarding your tickets to [eventname] on [eventdate]"
						}
						multiline
					/>

					<br/>
					<br/>

					<FormatInputLabel>Email body *</FormatInputLabel>
					<RichTextInputField
						error={errors.htmlBodyString}
						value={htmlBodyString}
						onChange={onChangeBody}
					/>

					<div className={classes.buttonContainer}>
						<Hidden smDown>
							<Button
								variant={"pinkBorder"}
								style={{ marginRight: 10, width: 200 }}
								onClick={onPreviewSend}
							>
								Send a preview
							</Button>
							<Button
								variant={"secondary"}
								style={{ width: 200 }}
								onClick={onSend}
							>
								Send email
							</Button>
						</Hidden>
						<Hidden mdUp>
							<Button
								variant={"pinkBorder"}
								style={{ width: "100%", marginBottom: 10 }}
								onClick={onPreviewSend}
							>
								Send a preview
							</Button>
							<Button
								variant={"secondary"}
								style={{ width: "100%" }}
								onClick={onSend}
							>
								Send email
							</Button>
						</Hidden>
					</div>
				</div>
			</LeftAlignedSubCard>
		</div>
	);
};

NewAnnouncementCard.propTypes = {
	onChangeBody: PropTypes.func.isRequired,
	onChangeSubject: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	subject: PropTypes.string.isRequired,
	htmlBodyString: PropTypes.string.isRequired,
	onPreviewSend: PropTypes.func.isRequired,
	onSend: PropTypes.func.isRequired
};

export default withStyles(styles)(NewAnnouncementCard);
