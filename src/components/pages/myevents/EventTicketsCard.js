import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles, IconButton } from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";

import Card from "../../elements/Card";
import StyledLink from "../../elements/StyledLink";
import { fontFamilyDemiBold, secondaryHex } from "../../../config/theme";
import EventTicketRow from "./EventTicketRow";
import CheckBox from "../../elements/form/CheckBox";
import DateFlag from "../../elements/event/DateFlag";
import SupportingArtistsLabel from "../events/SupportingArtistsLabel";
import nl2br from "../../../helpers/nl2br";
import ellipsis from "../../../helpers/ellipsis";
import Settings from "../../../config/settings";
import MobileEventTicketRow from "./MobileEventTicketRow";
import optimizedImageUrl from "../../../helpers/optimizedImageUrl";

const styles = theme => ({
	cardContent: {
		display: "flex",
		flexDirection: "row",
		height: 200
	},
	media: {
		flex: 4,
		height: "100%",
		width: "100%",

		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		backgroundPosition: "center",

		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",

		paddingLeft: theme.spacing.unit * 2
	},
	eventDetails: {
		flex: 7,
		padding: theme.spacing.unit * 2,
		paddingLeft: theme.spacing.unit * 3,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between"
	},
	row1: {
		display: "flex",
		alignItems: "flex-start",
		justifyContent: "space-between"
	},
	row2: {
		display: "flex",
		flexDirection: "column"
	},
	row3: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-end"
	},
	closeButtonRow: {
		display: "flex",
		justifyContent: "center",
		paddingBottom: theme.spacing.unit * 2
	},
	topLineInfo: {
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 0.9
	},
	eventName: {
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 1.9,
		lineHeight: 1
	},
	date: {
		fontSize: theme.typography.fontSize * 0.8,
		color: "#9da3b4"
	},
	venueName: {
		textTransform: "uppercase",
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 0.8
	},
	artists: {
		color: "#656D78"
	},
	ticketsSubheading: {
		fontSize: theme.typography.fontSize * 0.8,
		color: "#9da3b4",
		lineHeight: 1
	},
	ticketValue: {
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 1
	},
	ticketContainer: {
		padding: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 6,

		[theme.breakpoints.down("sm")]: {
			paddingTop: theme.spacing.unit
		}
	},
	ticketDetailsText: {
		fontFamily: fontFamilyDemiBold,
		fontSize: "inherit"
	},
	ticketDetailsDisabledText: {
		color: "#9da3b4",
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 0.9
	},
	bottomActionRow: {
		display: "flex",
		justifyContent: "flex-end",
		padding: theme.spacing.unit * 2
	},
	downloadAppText: {
		color: "#9da3b4",
		fontFamily: fontFamilyDemiBold,
		textAlign: "center",
		marginBottom: 20,
		paddingLeft: 20,
		paddingRight: 20
	},
	downloadAppLinkText: {
		color: secondaryHex,
		font: "inherit",
		cursor: "pointer"
	}
});

class EventTicketsCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			checkedTicketsIds: [],
			optionsAnchorEl: null
		};
	}

	toggleTicketCheckbox(id) {
		const { checkedTicketsIds } = this.state;
		const currentIndex = checkedTicketsIds.indexOf(id);
		const newChecked = [...checkedTicketsIds];

		if (currentIndex === -1) {
			newChecked.push(id);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			checkedTicketsIds: newChecked
		});
	}

	toggleAllTickets() {
		const { tickets } = this.props;
		const newChecked = []; //Default them all to unselected

		if (!this.allSelected()) {
			tickets.forEach(({ id, status }) => {
				const disabled = status && status !== "Purchased";

				if (!disabled) {
					newChecked.push(id);
				}
			});
		}

		this.setState({ checkedTicketsIds: newChecked });
	}

	allSelected() {
		const { tickets } = this.props;
		const { checkedTicketsIds } = this.state;

		let availableTickets = 0;
		tickets.forEach(({ status }) => {
			const disabled = status && status !== "Purchased";

			if (!disabled) {
				availableTickets++;
			}
		});

		return availableTickets === checkedTicketsIds.length;
	}

	handleMenuClick = event => {
		this.setState({ optionsAnchorEl: event.currentTarget });
	};

	handleOptionsClose = () => {
		this.setState({ optionsAnchorEl: null });
	};

	renderTicketList() {
		const {
			classes,
			event,
			tickets,
			expanded,
			onTicketSelect,
			onShowTransferQR,
			onCancelTransfer,
			showActions,
			slug
		} = this.props;
		const { checkedTicketsIds } = this.state;

		const RowComponent = props => (
			<React.Fragment>
				<Hidden smDown>
					<EventTicketRow {...props}/>
				</Hidden>
				<Hidden mdUp>
					<MobileEventTicketRow {...props}/>
				</Hidden>
			</React.Fragment>
		);

		return (
			<div className={classes.ticketContainer}>
				<RowComponent>
					{showActions ? <span/> : null}

					<Typography className={classes.ticketDetailsText}>
						Ticket #
					</Typography>
					<Typography className={classes.ticketDetailsText}>Order #</Typography>
					<Typography className={classes.ticketDetailsText}>
						Ticket type
					</Typography>
					<Typography className={classes.ticketDetailsText}>
						<Hidden smDown>Ticket price</Hidden>
						<Hidden mdUp>Price</Hidden>
					</Typography>
					{showActions ? (
						<Typography className={classes.ticketDetailsText}>
							Action
						</Typography>
					) : null}
				</RowComponent>

				{tickets.map((ticket, index) => {
					const {
						id,
						ticket_type_name,
						status,
						price_in_cents,
						order_id,
						pending_transfer,
						transfer_key
					} = ticket;

					const orderNumber = order_id.slice(-8); //TODO eventually this will also come in the API

					let actionCol = null;
					let disabled = false;

					switch (status) {
						case "Purchased":
							disabled = false;
							break;
						case "Redeemed":
							disabled = true;
							break;
						//TODO deal with the other statuses
					}

					//If an event is in the past, don't show any actions
					if (!showActions) {
						disabled = true;
						actionCol = null;
					} else {
						if (pending_transfer) {
							if (transfer_key) {
								actionCol = (
									<Typography className={classes.ticketDetailsText}>
										<StyledLink
											underlined
											onClick={() => onCancelTransfer(transfer_key)}
										>
											cancel transfer
										</StyledLink>
									</Typography>
								);
							} else {
								actionCol = (
									<Typography className={classes.ticketDetailsDisabledText}>
										Transferring
									</Typography>
								);
							}
						}

						//Default action buttons
						if (showActions && !actionCol && !disabled) {
							actionCol = (
								<Typography className={classes.ticketDetailsText}>
									<StyledLink underlined onClick={() => onTicketSelect(ticket)}>
										show qr
									</StyledLink>
									<span style={{ marginRight: 10 }}/>
									<StyledLink underlined onClick={() => onShowTransferQR([id])}>
										transfer
									</StyledLink>
								</Typography>
							);
						} else if (disabled && !actionCol) {
							actionCol = (
								<Typography className={classes.ticketDetailsDisabledText}>
									{status}
								</Typography>
							);
						}
					}

					return (
						<RowComponent key={id} item>
							{showActions ? (
								<CheckBox
									disabled={disabled}
									active={checkedTicketsIds.indexOf(id) !== -1}
									onClick={() => this.toggleTicketCheckbox(id)}
								/>
							) : null}
							<Typography className={classes.ticketDetailsText}>{`#${id.slice(
								-8
							)}`}</Typography>
							<Typography className={classes.ticketDetailsText}>
								<StyledLink underlined to={`/orders/${order_id}`}>
									{orderNumber}
								</StyledLink>
							</Typography>
							<Typography className={classes.ticketDetailsText}>
								{`${ticket_type_name} (${index + 1})`}
							</Typography>
							<Typography className={classes.ticketDetailsText}>
								$ {(price_in_cents / 100).toFixed(2)}
							</Typography>
							{actionCol}
						</RowComponent>
					);
				})}

				{checkedTicketsIds.length > 0 ? (
					<div className={classes.bottomActionRow}>
						<Typography className={classes.ticketDetailsText}>
							<StyledLink
								underlined
								onClick={() => onShowTransferQR(checkedTicketsIds)}
							>
								transfer{" "}
								{checkedTicketsIds.length > 1 ? checkedTicketsIds.length : ""}{" "}
								ticket
								{checkedTicketsIds.length > 1 ? "s" : ""}
							</StyledLink>
						</Typography>
					</div>
				) : null}
			</div>
		);
	}

	renderMenu() {
		const { event, slug } = this.props;
		const { optionsAnchorEl } = this.state;

		const options = [
			{
				text: "View my orders",
				onClick: () => this.props.history.push("/orders")
			},
			{
				text: "View event",
				onClick: () => this.props.history.push(`/tickets/${slug || event.id}`)
				// onClick: () => this.props.history.push(`/events/${event.id}`)
			}
		];
		return (
			<div>
				<IconButton
					onClick={e => {
						this.handleMenuClick(e);
					}}
				>
					<MoreHorizIcon fontSize={"large"}/>
				</IconButton>

				<Menu
					id="long-menu"
					anchorEl={optionsAnchorEl}
					open={Boolean(optionsAnchorEl)}
					onClose={this.handleOptionsClose}
				>
					{options.map(({ text, onClick, MenuOptionIcon }) => {
						return (
							<MenuItem
								key={text}
								onClick={() => {
									this.handleOptionsClose();
									onClick();
								}}
							>
								{/* <ListItemIcon>
									<MenuOptionIcon />
								</ListItemIcon> */}
								<ListItemText primary={text}/>
							</MenuItem>
						);
					})}
				</Menu>
			</div>
		);
	}

	render() {
		const {
			classes,
			event,
			tickets,
			expanded,
			onTicketSelect,
			onShowTransferQR,
			onExpand,
			onShowSMSLinkDialog
		} = this.props;
		const { checkedTicketsIds } = this.state;

		const {
			id,
			promo_image_url,
			formattedDate,
			name,
			top_line_info,
			venue,
			artists,
			eventDate,
			displayShowTime
		} = event;

		//TODO show artists when added to api
		//https://github.com/big-neon/bn-api/issues/572

		return (
			<Card variant="raisedLight">
				<div className={classes.cardContent}>
					<Hidden smDown>
						<div
							className={classes.media}
							style={{
								backgroundImage: `url(${
									promo_image_url
										? optimizedImageUrl(promo_image_url)
										: "/images/event-placeholder.png"
								})`
							}}
						>
							{displayShowTime ? <DateFlag date={displayShowTime}/> : null}
						</div>
					</Hidden>

					<div className={classes.eventDetails}>
						<div className={classes.row1}>
							<div>
								<Typography className={classes.topLineInfo}>
									{nl2br(top_line_info)}
								</Typography>
								<Typography className={classes.eventName}>
									{ellipsis(name, 36)}
								</Typography>
								<Typography className={classes.date}>
									{formattedDate}
								</Typography>
							</div>
							<div>{this.renderMenu()}</div>
						</div>

						<div className={classes.row2}>
							<Typography className={classes.venueName}>
								{venue.name}
							</Typography>
							<Typography className={classes.artists}>
								<SupportingArtistsLabel artists={artists}/>
							</Typography>
						</div>

						<div className={classes.row3}>
							<div>
								<Typography className={classes.ticketsSubheading}>
									Tickets
								</Typography>
								<Typography className={classes.ticketValue}>
									{tickets.length}
								</Typography>
							</div>

							<div>
								{!expanded ? (
									<Typography>
										<StyledLink onClick={onExpand} underlined>
											View my tickets
										</StyledLink>
									</Typography>
								) : null}
							</div>
						</div>
					</div>
				</div>
				<Collapse in={expanded}>
					{this.renderTicketList()}

					<Typography className={classes.downloadAppText}>
						To transfer your ticket{tickets.length === 1 ? "" : "s"} please
						download the{" "}
						<Hidden smDown>
							<span
								className={classes.downloadAppLinkText}
								onClick={onShowSMSLinkDialog}
							>
								Big&nbsp;Neon&nbsp;app.
							</span>
						</Hidden>
						<Hidden mdUp>
							<a
								target={"_blank"}
								href={Settings().genericAppDownloadLink}
								className={classes.downloadAppLinkText}
							>
								Big&nbsp;Neon&nbsp;app.
							</a>{" "}
						</Hidden>
					</Typography>

					<div className={classes.closeButtonRow}>
						{expanded ? (
							<Typography>
								<StyledLink onClick={onExpand} underlined>
									Close
								</StyledLink>
							</Typography>
						) : null}
					</div>
				</Collapse>
			</Card>
		);
	}
}

EventTicketsCard.propTypes = {
	id: PropTypes.string,
	classes: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	tickets: PropTypes.array.isRequired,
	onExpand: PropTypes.func.isRequired,
	expanded: PropTypes.bool.isRequired,
	onTicketSelect: PropTypes.func.isRequired,
	onShowTransferQR: PropTypes.func.isRequired,
	onCancelTransfer: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	showActions: PropTypes.bool.isRequired,
	onShowSMSLinkDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(EventTicketsCard);
