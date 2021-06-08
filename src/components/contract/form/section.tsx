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

// Custom components
import FormatIndentDecreaseIcon from '@material-ui/icons/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';
import { Section } from 'model/section';
import {Editor, EditorState, convertFromRaw} from 'draft-js';

//import VariableSectionComponent from 'components/contract/form/variable-section'

const styles = (theme: Theme) => createStyles({
  card: {
    width: '100%',
    borderRadius: 0,
    borderStyle: 'dashed',
    borderWidth: '0.5px',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  text: {
    textAlign: 'justify',
  },
  option: {
    borderWidth: '0.5px',
    borderStyle: 'dashed',
    padding: '8px'
  },
  suboption: {
    //borderWidth: '0.5px',
    //borderStyle: 'dashed',
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
      id: this.props.id, index: this.props.index, indent: this.props.indent, title: this.props.title,
      summary: this.props.summary, options: this.props.options, styledOptions: this.props.styledOptions, 
      suboptions: this.props.suboptions, variable: this.props.variable,
      optional: this.props.optional, dynamic: this.props.dynamic, descriptionOfChange: this.props.descriptionOfChange
    };
  }

  render() {
    //const _t = this.props.intl.formatMessage;

    const { classes } = this.props;

    // eslint-disable-next-line
    const { id, index, indent, title, optional, dynamic, options, styledOptions, suboptions } = this.props;
    let increaseIndent, decreaseIndent;
    if (id! > 0) {
      increaseIndent = <IconButton onClick={() =>
        this.props.editSection({ id: id!, indent: indent < 64 ? indent + 8 : indent })
      }>
        <FormatIndentIncreaseIcon />
      </IconButton>
      decreaseIndent =
        <IconButton onClick={() =>
          this.props.editSection({ id: id!, indent: indent > 0 ? indent - 8 : indent })
        }>
          <FormatIndentDecreaseIcon />
        </IconButton>
    }
    var type = 'Section ';
    if (index.includes('.')) {
      type = 'Sub-section ';
    }
    let body, truncated = styledOptions[0];
    const defaultState = convertFromRaw(JSON.parse(truncated));
    if (dynamic) {
      console.log('SUBOPTIONS', this.state.suboptions)
      body = styledOptions.map((option, index) => {
        const storedState =  convertFromRaw(JSON.parse(option));
        /*if (storedState.getPlainText.length > 150)
          truncated = option.substring(0, 150) + '...';
        else
          truncated = option;*/
        var suboptionsArray = this.state.suboptions[index];
        let suboptionBlock=[];
        if (suboptionsArray){
          var length = suboptionsArray.length
        }
        else 
          length = 0;
        console.log('index - array', index, this.state.suboptions, length);
        if (length > 0) {
          for (let i = 0; i < length; i++) {
            console.log('i  suboptionsArray', i, suboptionsArray);
            var storedSuboptionState = convertFromRaw(JSON.parse(suboptionsArray[i].body));
            var suboptionBody =
              <div className={classes.option} key={index}> <span>Suboption {String.fromCharCode(65 + i)}</span>
                <Editor editorState={EditorState.createWithContent(storedSuboptionState)} readOnly={true} onChange={() => { }} />
              </div>;
            suboptionBlock.push(suboptionBody);
          }
          var renderedOutput = suboptionBlock.map((item, index) => {
            return (
              <div className={classes.suboption}>
                {item}
              </div>
            )
          });
        }
        else {
          renderedOutput = [];
        }

          
        return <div><div className={classes.option} key={index}> <span>Option {String.fromCharCode(65 + index)}</span>
        <Editor editorState= {EditorState.createWithContent(storedState)} readOnly={true} onChange={() => {}}/> 
        </div>
        {renderedOutput}
        </div>;
      });
    }
    else {
       body = <Editor editorState= {EditorState.createWithContent(defaultState)} readOnly={true} onChange={() => {}}/>
      /*if (options[0].length > 150)
        truncated = options[0].substring(0, 150) + '...';
        body = <div>{truncated}</div>*/
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
          title={type + index + ' - ' + title}
        />
        <CardContent className={classes.text}>
          <div style={{ paddingLeft: indent }}> {body}

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
