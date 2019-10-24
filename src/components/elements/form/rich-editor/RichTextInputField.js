import React, { Component } from "react";
import {
	Editor,
	EditorState,
	RichUtils,
	getDefaultKeyBinding,
	ContentState
} from "draft-js";
import { convertToHTML, convertFromHTML } from "draft-convert";
import { withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

import "./editor.css";
import Divider from "../../../common/Divider";
import "../../../pages/events/rich-event-description.css";
import { styleMap } from "./EditorSettings";
import BlockStyleControls from "./BlockStyleControls";
import LinkFieldDialog from "./LinkFieldDialog";
import InlineStyleControls from "./InlineStyleControls";

const convertHtmlPropToEditorState = html => {
	if (!html || html === "<p></p>") {
		return EditorState.createEmpty();
	}

	let newLineReplacedHtml = "";
	html.split("\n").forEach((item) => {
		newLineReplacedHtml = `${newLineReplacedHtml}${item}<br/>`;
	});

	const contentStateFromHtml = convertFromHTML({
		htmlToStyle: (nodeName, node, currentStyle) => {
			if (nodeName === "a") {
				return currentStyle.add("LINK");
			} else {
				return currentStyle;
			}
		},
		htmlToEntity: (nodeName, node, createEntity) => {
			if (nodeName === "a") {
				return createEntity("LINK", "MUTABLE", { url: node.href });
			}
		},
		htmlToBlock: (nodeName, node) => {
			if (nodeName === "blockquote") {
				return {
					type: "blockquote",
					data: {}
				};
			}
		}
	})(newLineReplacedHtml);

	return EditorState.createWithContent(contentStateFromHtml);
};

const getBlockStyle = block => {
	switch (block.getType()) {
		case "blockquote":
			return "RichEditor-blockquote";
		default:
			return null;
	}
};

const styles = theme => ({
	root: {
		borderStyle: "solid",
		borderWidth: 0.5,
		borderColor: "#777777",
		minHeight: 100,
		padding: 10
	},
	styleContainer: {
		display: "flex"
		//padding: 10
	}
});

class RichTextInputField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editorState: EditorState.createEmpty(),
			showLinkField: false,
			existingUrlForPrompt: ""
		};

		this.onChange = this.onChange.bind(this);
		this.onSetUrl = this.onSetUrl.bind(this);
	}

	hidePromptForLink() {
		this.setState({ showLinkField: false });
	}

	promptForLink() {
		const { editorState } = this.state;
		const selection = editorState.getSelection();
		if (!selection.isCollapsed()) {
			const contentState = editorState.getCurrentContent();
			const startKey = editorState.getSelection().getStartKey();
			const startOffset = editorState.getSelection().getStartOffset();
			const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
			const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
			let url = "";
			if (linkKey) {
				const linkInstance = contentState.getEntity(linkKey);
				url = linkInstance.getData().url;
				this.setState({ existingUrlForPrompt: url });
			}

			this.setState({ showLinkField: true });
		}
	}

	onSetUrl(url) {
		const { editorState } = this.state;
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(
			"LINK",
			"MUTABLE",
			{ url }
		);
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const newEditorState = EditorState.set(editorState, {
			currentContent: contentStateWithEntity
		});

		this.onChange(
			RichUtils.toggleLink(
				newEditorState,
				newEditorState.getSelection(),
				entityKey
			)
		);

		this.applyLinkStyle();
	}

	applyLinkStyle() {
		setTimeout(() => {
			this.onChange(
				RichUtils.toggleInlineStyle(this.state.editorState, "LINK")
			);
		}, 200);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const currentHtml = this.props.value;
		if (
			!this.htmlHasBeenSet &&
			currentHtml &&
			prevProps.value !== currentHtml
		) {
			const editorState = convertHtmlPropToEditorState(currentHtml);
			this.htmlHasBeenSet = true;
			this.setState({ editorState });
			this.applyLinkStyle();
		}
	}

	onChange(editorState) {
		this.setState({ editorState }, () => {
			const currentContent = this.state.editorState.getCurrentContent();
			//const html = convertToHTML(currentContent);

			const html = convertToHTML({
				styleToHTML: style => {},
				blockToHTML: block => {},
				entityToHTML: (entity, originalText) => {
					if (entity.type === "LINK") {
						return (
							<a target="_blank" href={entity.data.url}>
								{originalText}
							</a>
						);
					}
					return originalText;
				}
			})(currentContent);

			this.props.onChange(html);
		});
	}

	mapKeyToEditorCommand(e) {
		switch (e.keyCode) {
			case 9: {
				// TAB
				const newEditorState = RichUtils.onTab(
					e,
					this.state.editorState,
					4 /* maxDepth */
				);
				if (newEditorState !== this.state.editorState) {
					this.onChange(newEditorState);
				}
				break;
			}
			default: {
				return getDefaultKeyBinding(e);
			}
		}
	}

	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	}

	toggleBlockType(blockType) {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
	}

	toggleInlineStyle(inlineStyle) {
		if (inlineStyle === "LINK") {
			this.promptForLink();
			return;
		}

		this.onChange(
			RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
		);
	}

	render() {
		const { editorState, showLinkField, existingUrlForPrompt } = this.state;
		const { classes, placeholder } = this.props;

		return (
			<React.Fragment>
				<LinkFieldDialog
					open={showLinkField}
					onClose={() => this.hidePromptForLink()}
					onSetUrl={this.onSetUrl}
					existingUrl={existingUrlForPrompt}
				/>
				<div className={classes.root} onClick={() => this.editor.focus()}>
					<div className={classes.styleContainer}>
						<BlockStyleControls
							editorState={editorState}
							onToggle={this.toggleBlockType.bind(this)}
						/>
						<InlineStyleControls
							editorState={editorState}
							onToggle={this.toggleInlineStyle.bind(this)}
						/>
					</div>

					<Divider style={{ marginBottom: 10 }}/>

					<div className={"rich-edit-content"}>
						<Editor
							editorState={this.state.editorState}
							onChange={this.onChange}
							blockStyleFn={getBlockStyle}
							customStyleMap={styleMap}
							editorState={editorState}
							handleKeyCommand={this.handleKeyCommand.bind(this)}
							keyBindingFn={this.mapKeyToEditorCommand.bind(this)}
							onChange={this.onChange}
							placeholder={placeholder}
							ref={ref => (this.editor = ref)}
							spellCheck={true}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

RichTextInputField.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(RichTextInputField);