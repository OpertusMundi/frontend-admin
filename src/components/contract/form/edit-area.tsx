import React from 'react';

// Localization
import { injectIntl, IntlShape } from 'react-intl';

// Styles
import { TextField, createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { EditorState, ContentBlock, ContentState, convertFromRaw, CompositeDecorator, Entity, Modifier } from 'draft-js';

import { OrderedSet } from 'immutable';

// Material UI
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

// Custom component
import { Section } from 'model/section';

const styles = (theme: Theme) => createStyles({
  card: {
    width: '100%',
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: '0.5px',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  text: {
    textAlign: 'justify',
  },
  title: {
    width: '100%',
    margin: theme.spacing(1)
  },
  editor: {
    height: '20vh',
    overflowY: 'auto',
    //borderStyle: 'solid',
    //borderWidth: '0.5px',

  },
  options: {
    borderStyle: 'solid',
    borderWidth: '0.5px',
    marginLeft: '10px',
    width: '35px',
  },
  radio: {
    display: 'block',
    marginBottom: '10px',

  },
  wrapper: {
    height: 'auto'
  },
  placeholder: {
    color: 'blue',
    display: 'inlineBlock'
  },
  control: {
    width: '100%'
  },
  open: {
    display: 'block !important'
  },
  close: {
    display: 'none !important'
  },
  icon: {
    width: '20px',
  },
  outerIcon: {
    maxWidth: '35px',
    maxHeight: '35px',
    marginLeft: '20px',
    marginTop: '5px'
  }
});

export enum EditFieldEnum {
  Section = 'section',
  Title = 'title',
  Subtitle = 'subtitle',
};

interface EditAreaComponentProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  section?: Section;
  documentTitle?: string;
  documentSubtitle?: string;
  saveContent: (id: number, contentState: ContentState, body: string, title: string, option: number,
    summary: string, descriptionOfChange: string, icon: string, editField: EditFieldEnum) => void;
  editSection: (item: any) => void;
  addOptions: (sectionId: number, options: number) => void;
  editField: EditFieldEnum;
  //addIndent: (item: any) => void;
  //removeIndent: (item: any) => void;
  sectionList?: Section[];
}


interface EditAreaComponentState {
  editorState: EditorState;
  showEditor: boolean;
  title: string;
  summary: string;
  descriptionOfChange: string;
  variable: boolean;
  dynamic?: boolean;
  optional?: boolean;
  icon: string;
  option: number;
  openAutoTextSelect: boolean;
  openIconSelect: boolean;
}

class EditAreaComponent extends React.Component<EditAreaComponentProps, EditAreaComponentState> {

  constructor(props: EditAreaComponentProps) {
    super(props);
    console.log('PROPS: ', this.props)
    let title, editorState, show, summary = '', descriptionOfChange = '', variable = false, optional = false, dynamic = false, icon = '';
    // if editing section or titles
    if (this.props.editField === EditFieldEnum.Section) {
      title = this.props.section!.title;
      editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.section!.styledOptions[0])), this.decorator)
      show = true;
      summary = this.props.section!.summary![0];
      variable = this.props.section!.variable;
      optional = this.props.section!.optional;
      dynamic = this.props.section!.dynamic;
      icon = this.props.section!.icons![0];
      descriptionOfChange = this.props.section!.descriptionOfChange;
    }
    else {
      editorState = EditorState.createEmpty(this.decorator);
      show = false;
      if (this.props.editField === EditFieldEnum.Title) {
        title = this.props.documentTitle!;
      }
      else
        title = this.props.documentSubtitle!;
    }
    this.state = {
      editorState, title, option: 0, showEditor: show, summary, descriptionOfChange, variable, optional, dynamic, icon, openAutoTextSelect: false, openIconSelect: false
    };
  }

  //onEditorStateChange(editorState: EditorState): void {
  //console.log('in on editor state change state:' + editorState.getCurrentContent());
  //  this.setState({
  //    editorState,
  // });
  //};

  onChangeValue(id: number, event: any) {
    var selection = event.target.value
    console.log('change value', id, selection);
    if (selection === 'optional') {
      this.props.editSection({ id: id, optional: true, dynamic: false })
      this.setState({ optional: true, dynamic: false });
    }
    else if (selection === 'dynamic') {
      this.props.addOptions(id, 2);
      this.props.editSection({ id: id, dynamic: true, optional: false })
      this.setState({ optional: false, dynamic: true });
    }
    else {
      console.log('in number' + selection);
      this.props.addOptions(id, selection);
    }
  }

  onOptionSelect = (event: any) => {
    var selection = event.target.value
    console.log('in select', event.target.value);
    console.log('section ',this.props.section);
    console.log(this.props.section!.summary![selection])
    this.setState({
      option: selection, editorState: EditorState.createWithContent(convertFromRaw(JSON.parse((this.props.section!.styledOptions[selection])))),
      summary: this.props.section!.summary![selection], icon: this.props.section!.icons![selection]
    });
  }

  onSummarySet = (event: any) => {
    var summary = event.target.value
    if (summary==='')
      summary=' '
    this.setState({summary
    });

  }
  onDescriptionSet = (event: any) => {
    var descriptionOfChange = event.target.value
    if (descriptionOfChange==='')
    descriptionOfChange=' '
    this.setState({descriptionOfChange
    });

  }

  TokenSpan = (props: any) => {
    const tokenStyle = newStyle.immutable;
    return (
      <span id='sellerId' data-offset-key={props.offsetkey} style={tokenStyle}>
        {props.children}
      </span>
    );
  };
  decorator = new CompositeDecorator([{
    strategy: this.findPlaceholders,
    component: this.TokenSpan,
  }]);


  findPlaceholders(contentBlock: ContentBlock, callback: any) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'PLACEHOLDER'
      );
    }, callback);
  }

  insertPlaceholder(label: string, meta: any): EditorState {
    console.log('label meta: ', label, meta);
    const editorState = this.state.editorState;
    const currentContent = this.state.editorState.getCurrentContent();
    const selection = this.state.editorState.getSelection();
    const entityKey = Entity.create('TokenSpan', 'IMMUTABLE', { meta });

    var entityStyle = OrderedSet.of('BOLD')
    entityStyle = entityStyle.add('UNDERLINE')
    var textWithEntity = Modifier.insertText(currentContent, selection, label, entityStyle, entityKey);

    var newSelection = editorState.getSelection().merge({
      focusOffset: selection.getFocusOffset() + label.length,
      anchorOffset: selection.getAnchorOffset() + label.length
    })
    const spaceEntityKey = Entity.create('TokenSpan', 'IMMUTABLE', 'space');
    textWithEntity = Modifier.insertText(textWithEntity, newSelection, ' ', undefined, spaceEntityKey);

    newSelection = newSelection.merge({
      focusOffset: newSelection.getFocusOffset() + 1,
      anchorOffset: newSelection.getAnchorOffset() + 1
    })
    //const nextOffSet = editorState.getSelection().getFocusOffset() + 1

    var newState = EditorState.push(editorState, textWithEntity, 'insert-characters')
    this.setState({
      editorState: EditorState.forceSelection(newState, newSelection)

    });
    return newState
  }


  onEditorStateChange(editorState: EditorState): void {
    //console.log('in on editor state change state:' + editorState.getCurrentContent());
    this.setState({
      editorState,
    });
  };

  Replacements = () => {
    console.log('in replacement')
    //var open = false;

    const setOpen = (): void => {
      this.setState({
        openAutoTextSelect: !this.state.openAutoTextSelect,
      });
    }

    const { classes } = this.props;

    return (
      <div onClick={() => setOpen()} className="rdw-block-wrapper" aria-expanded={this.state.openAutoTextSelect} aria-label="rdw-block-control" role="button" tabIndex={0}>
        <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-expanded={this.state.openAutoTextSelect} aria-label="rdw-dropdown" style={{ width: 180 }}>
          <div className="rdw-dropdown-selectedtext">
            <span>automated text</span>
            <div className={`rdw-dropdown-caretto${this.state.openAutoTextSelect ? 'close' : 'open'}`} />
          </div>
          <ul className={`rdw-dropdown-optionwrapper ${this.state.openAutoTextSelect ? classes.open : classes.close}`} >
            {placeholderOptions.map(item => (
              <li
                onClick={() => this.insertPlaceholder(item.value, '')}
                key={item.value}
                className={`rdw-dropdownoption-default placeholder-li ${this.state.openAutoTextSelect ? 'close' : 'open'}`}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  finishEdit = (editorState: EditorState): void =>{
    this.props.saveContent(this.props.section?.id!, editorState.getCurrentContent(), editorState.getCurrentContent().getPlainText(),
          this.state.title, this.state.option, this.state.summary, this.state.descriptionOfChange, this.state.icon, this.props.editField)
  }

  render() {
    const { editorState } = this.state;
    const { classes } = this.props;
    let editor, iconSelector, type_buttons, options, editOption, summary, descriptionOfChange;
    if (this.state.showEditor) {
      editor = <div >

        <InputLabel className={classes.title}>Text</InputLabel>
        <Editor
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
          }}
          toolbarCustomButtons={[this.Replacements()]}
          //onChange={this.onContentChange(this.)}
          //onChange={this._handleChange}
          editorState={editorState}
          wrapperClassName={classes.wrapper}
          editorClassName={classes.editor}
          //placeholder={this.props.section!.text}
          onEditorStateChange={this.onEditorStateChange.bind(this)}
        />
      </div>;
      descriptionOfChange = <div className={classes.control}> <InputLabel className={classes.title}>Description of change (Optional)</InputLabel>
        <TextField className={classes.title} id="filled-label" variant="standard" value={this.state.descriptionOfChange}
          suppressContentEditableWarning={true} contentEditable={true}
          onChange={(e) => this.onDescriptionSet(e)} />

      </div>;

    }
    if (this.state.variable) {
      summary = <div className={classes.control}> <InputLabel className={classes.title}>Summary</InputLabel>
        <TextField className={classes.title} id="filled-label" variant="standard" value={this.state.summary}
          suppressContentEditableWarning={true} contentEditable={true} multiline={true}
          onChange={(e) => this.onSummarySet(e)} />

      </div>;

      if (this.state.dynamic) {
        let optionAlphanumeric = [];
        for (let i = 0; i < this.props.section!.styledOptions.length; i++) {
          optionAlphanumeric.push(String.fromCharCode(65 + i));
        }
        options = <input className={classes.options} type="number" defaultValue="2"></input>;
        editOption = <div style={{ 'marginLeft': '80px' }} > <InputLabel htmlFor="age-native-simple">Select option</InputLabel>
          <Select
            native
            //value={state.age}
            onChange={this.onOptionSelect}
          >
            {optionAlphanumeric.map((option, index) =>
              <option key={index} value={index}>{option}</option>)};
          </Select>
        </div>;
      }

      type_buttons =
        <div onChange={(e) => this.onChangeValue(this.props.section!.id!, e)}>
          <label className={classes.radio}><input type="radio" value="optional" name="type" defaultChecked={this.state.optional} /> Optional Section</label>
          <label className={classes.radio}><input type="radio" value="dynamic" name="type" defaultChecked={this.state.dynamic} /> Dynamic Section
                        {options}
          </label>

        </div>;

      const openIconSelector = (): void => {
        this.setState({
          openIconSelect: !this.state.openIconSelect,
        });
      }

      const selectIcon = (icon: string): void => {
        this.setState({
          icon
        });
      }
      iconSelector =
        <div onClick={() => openIconSelector()} className="rdw-block-wrapper" aria-expanded={this.state.openIconSelect} aria-label="rdw-block-control" role="button" tabIndex={0}>
          <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-expanded={this.state.openIconSelect} aria-label="rdw-dropdown" style={{ width: 180 }}>
            <div className="rdw-dropdown-selectedtext">
              <span>icon</span>
              <div className={`rdw-dropdown-caretto${this.state.openIconSelect ? 'close' : 'open'}`} />
            </div>
            <ul className={`rdw-dropdown-optionwrapper ${this.state.openIconSelect ? classes.open : classes.close}`} >
              {iconOptions.map(item => (
                <li
                  onClick={() => selectIcon(item.value)}
                  key={item.value}
                  className={`rdw-dropdownoption-default placeholder-li ${this.state.openIconSelect ? 'close' : 'open'}`}
                >
                  {item.value}
                  <img className={classes.icon} src={"/icons/" + item.value} alt="" />
                </li>
              ))}
              <li
                onClick={() => selectIcon('empty')}
                className={`rdw-dropdownoption-default placeholder-li ${this.state.openIconSelect ? 'close' : 'open'}`}
              >
                None
                </li>
            </ul>
          </div>
        </div>
    }

    return (
      <Grid container>
        {type_buttons}
        {editOption}
        <TextField className={classes.title} id="filled-title" variant="standard" value={this.state.title} suppressContentEditableWarning={true} contentEditable={true} label='Title'
          onChange={(e) => this.setState({ title: e.target.value })}
        />

        {editor}

        {summary}

        {iconSelector}

        <img className={classes.outerIcon} src={"/icons/" + this.state.icon} alt="" />

        {descriptionOfChange}

        <button style={{ height: 30, marginLeft: 50 }}
          onClick={() => this.finishEdit(editorState)
            
          }>
          Done
                </button>
      </Grid >
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(EditAreaComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Export localized component
export default localizedComponent;

const newStyle = {
  keyword: {
    color: '#3b5998',
    textDecoration: 'underline',
  },
  immutable: {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0',
  }
}

type ReplacementsProps = {
  onChange?: (editorState: EditorState) => void,
  editorState: EditorState,
}

const placeholderOptions = [
  { key: "sellerID", value: "sellerID" },
  { key: "clientID", value: "clientID" },
  { key: "sellerName", value: "sellerName" },
  { key: "clientName", value: "clientName" },
  { key: "sellerVAT", value: "sellerVAT" },
  { key: "clientVAT", value: "clientVAT" },
  { key: "sellerAddress", value: "sellerAddress" },
  { key: "clientAddress", value: "clientAddress" },
  { key: "AssetId", value: "AssetId" },
  { key: "AssetName", value: "AssetName" },
  { key: "AssetPrice", value: "AssetPrice" },
  { key: "CurrentDate", value: "CurrentDate" },
  { key: "SellerLegalRep", value: "SellerLegalRep" },
  { key: "MTCID", value: "MTCID" },
  { key: "ContractID", value: "ContractID" },
  
]

const iconOptions = [
  { key: "cc.png", value: "cc.png" },
  { key: "ccby.png", value: "ccby.png" },
  { key: "non-commercial.png", value: "non-commercial.png" },
  { key: "sa.png", value: "sa.png"}
]
