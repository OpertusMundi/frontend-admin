import React from 'react';

// Localization
import { injectIntl, IntlShape } from 'react-intl';

// Styles
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Material UI
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import FormatIndentDecreaseIcon from '@material-ui/icons/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';

// Components
import { Editor, EditorState, convertFromRaw, ContentState, ContentBlock } from 'draft-js';

// Model
import { Section } from 'model/contract';

const styles = (theme: Theme) => createStyles({
  card: {
    width: '100%',
    borderRadius: 0,
    borderStyle: 'dashed',
    borderWidth: '0.5px',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    background: '#F4F4F4 0% 0% no-repeat padding-box',
  },
  text: {
    textAlign: 'justify',
  },
  option: {
    borderWidth: '0.5px',
    borderStyle: 'dashed',
    padding: '8px',
  },
  subOption: {
    padding: '12px',
  }
});

interface SectionComponentProps extends WithStyles<typeof styles>, Section {
  intl: IntlShape;
  editSection: (item: any) => void;
}

interface SectionComponentState extends Section {
}

class SectionComponent extends React.Component<SectionComponentProps, SectionComponentState> {

  constructor(props: SectionComponentProps) {
    super(props);

    this.state = {
      id: this.props.id,
      index: this.props.index,
      indent: this.props.indent,
      title: this.props.title,
      summary: this.props.summary,
      options: this.props.options,
      styledOptions: this.props.styledOptions,
      subOptions: this.props.subOptions,
      variable: this.props.variable,
      optional: this.props.optional,
      dynamic: this.props.dynamic,
      descriptionOfChange: this.props.descriptionOfChange
    };
  }

  truncate(contentState: ContentState, charCount: number) {
    const blocks = contentState.getBlockMap();

    let count = 0;
    let isTruncated = false;
    const truncatedBlocks: ContentBlock[] = [];
    blocks.forEach((block) => {
      if (!isTruncated) {
        const length = block!.getLength();
        if (count + length > charCount) {
          isTruncated = true;
          const truncatedText = block!.getText().slice(0, charCount - count);
          const state = ContentState.createFromText(`${truncatedText}...`);
          truncatedBlocks.push(state.getFirstBlock());
        } else {
          truncatedBlocks.push(block!);
        }
        count += length + 1;
      }
    });

    if (isTruncated) {
      const state = ContentState.createFromBlockArray(truncatedBlocks);
      return state;
    }

    return contentState;
  }

  render() {
    const { classes } = this.props;

    const { id, index, indent, title, optional, variable, dynamic, options, styledOptions, subOptions } = this.props;

    let increaseIndent, decreaseIndent;
    if (id! > 0) {
      increaseIndent = (
        <IconButton onClick={() =>
          this.props.editSection({ id: id!, indent: indent < 64 ? indent + 8 : indent })
        }>
          <FormatIndentIncreaseIcon />
        </IconButton>
      );
      decreaseIndent = (
        <IconButton onClick={() =>
          this.props.editSection({ id: id!, indent: indent > 0 ? indent - 8 : indent })
        }>
          <FormatIndentDecreaseIcon />
        </IconButton>
      );
    }
    var type = 'Section ';
    if (index.includes('.')) {
      type = 'Sub-section ';
    }
    if (title) {
      var sectionTitle = type + index + ' - ' + title
    } else {
      sectionTitle = type + index;
    }
    let body, truncated = styledOptions[0];
    var defaultState = convertFromRaw(JSON.parse(truncated));
    defaultState = this.truncate(defaultState, 70)
    if (variable) {
      body = styledOptions.map((option, index) => {
        var storedState = convertFromRaw(JSON.parse(option));
        storedState = this.truncate(storedState, 70);

        var subOptionsArray = this.state.subOptions[index];
        let subOptionBlock = [];
        if (subOptionsArray) {
          var length = subOptionsArray.length
        }
        else {
          length = 0;
        }
        if (length > 0) {
          for (let i = 0; i < length; i++) {

            var storedSubOptionState = convertFromRaw(JSON.parse(subOptionsArray[i].body));
            storedSubOptionState = this.truncate(storedSubOptionState, 70);
            const subOptionBody = (
              <div className={classes.option} key={`editor-${index}-${i}`}>
                <span>
                  SubOption {String.fromCharCode(65 + i)}
                </span>
                <Editor editorState={EditorState.createWithContent(storedSubOptionState)} readOnly={true} onChange={() => { }} />
              </div>
            );
            subOptionBlock.push(subOptionBody);
          }
          var renderedOutput = subOptionBlock.map((item, index) => {
            return (
              <div key={`sub-option-block-${index}`} className={classes.subOption}>
                {item}
              </div>
            )
          });
        } else {
          renderedOutput = [];
        }
        let optionHeading;
        if (options.length > 1) {
          optionHeading = (
            <span>Option {String.fromCharCode(65 + index)}</span>
          );
        }

        return (
          <div key={`styled-options-${index}`}>
            <div className={classes.option} key={index}>
              {optionHeading}
              <Editor editorState={EditorState.createWithContent(storedState)} readOnly={true} onChange={() => { }} />
            </div>
            {renderedOutput}
          </div>
        );
      });
    } else {
      body = (
        <Editor editorState={EditorState.createWithContent(defaultState)} readOnly={true} onChange={() => { }} />
      );
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <div>
              {decreaseIndent}
              {increaseIndent}
            </div>
          }
          title={sectionTitle}
        />
        <CardContent className={classes.text}>
          <div style={{ paddingLeft: indent }}>
            {body}
          </div>
        </CardContent>
      </Card>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(SectionComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Export localized component
export default localizedComponent;
