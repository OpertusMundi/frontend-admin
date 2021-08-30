import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

// Localization
import { injectIntl, IntlShape } from 'react-intl';

// Styles
import { TextField, createStyles, WithStyles, MenuItem } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import './editor-styles.scss';


import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { EditorState, ContentBlock, ContentState, convertFromRaw, CompositeDecorator, Entity, Modifier } from 'draft-js';

import { OrderedSet } from 'immutable';

// Material UI
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

// Custom component
import { EnumContractIcon, Section } from 'model/contract';
import { RootState } from 'store';

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
    width: '100%',
    borderStyle: 'solid',
    borderWidth: '0.5px',
    padding: '10px',
    fontSize: '18px'
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
    float: 'right',
    display: 'inline-block'
  },
  outerIcon: {
    maxWidth: '35px',
    maxHeight: '35px',
    marginLeft: '20px',
    marginTop: '5px'
  },
  doneBtn: {
    backgroundColor: '#000',
    color: '#fff',
    //position: 'absolute',
    //right: '2vh',
    //marginTop: '50px',
    display: 'inline-block',
    width: '100px',
    height: '40px',
    borderRadius: '25px',
    borderColor: '#000',
    marginLeft: '50px',
  },
});

export enum EditFieldEnum {
  Section = 'section',
  SubOption = 'subOption',
  Title = 'title',
  Subtitle = 'subtitle',
};

interface EditAreaComponentProps extends WithStyles<typeof styles>, PropsFromRedux {
  intl: IntlShape;
  section?: Section;
  documentTitle?: string;
  documentSubtitle?: string;
  saveContent: (id: number, contentState: ContentState, title: string, option: number, subOption: number,
    summary: string, descriptionOfChange: string, icon: EnumContractIcon | null, shortDescription: string, editField: EditFieldEnum) => void;
  editSection: (...item:any) => void;
  addOptions: (sectionId: number, options: number) => void;
  addSubOptions: (sectionId: number, option: number, subOptions: number) => void;
  editField: EditFieldEnum;
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
  icon: EnumContractIcon | null;
  shortDescription: string;
  option: number;
  subOption: number;
  editField: EditFieldEnum;
  // title for editing option or subOption
  editingOption: boolean;
  openAutoTextSelect: boolean;
  openIconSelect: boolean;
}

class EditAreaComponent extends React.Component<EditAreaComponentProps, EditAreaComponentState> {

  constructor(props: EditAreaComponentProps) {
    super(props);
    let title, editorState, show, summary = '', descriptionOfChange = '', variable = false, optional = false, dynamic = false, icon = null, shortDescription = '', images={};
    // if editing section or titles
    if (this.props.editField === EditFieldEnum.Section) {
      title = this.props.section!.title;
      editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.section!.options[0].body)), this.decorator)
      show = true;
      summary = this.props.section!.options[0].summary!;
      variable = this.props.section!.variable;
      optional = this.props.section!.optional;
      dynamic = this.props.section!.dynamic;
      icon = this.props.section!.options[0].icon!;
      shortDescription = this.props.section!.options[0].shortDescription!;
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
      editorState, title, option: 0, subOption: 0, editingOption: true, showEditor: show, summary, descriptionOfChange, variable, optional,
      dynamic, icon, shortDescription, openAutoTextSelect: false, openIconSelect: false, editField: this.props.editField

    };
  }


  customBlockStyleFn = (contentBlock: ContentBlock) => {
    return ['public-DraftStyleDefault-block'];


  }

  onChangeValue(id: number, event: any) {
    var selection = event.target.value
    if (selection === 'optional') {
      this.props.editSection({ id: id, optional: true, dynamic: false, summary: '', })
      this.setState({ optional: true, dynamic: false });
    }
    else if (selection === 'dynamic') {
      this.props.addOptions(id, 2);
      this.props.editSection({ id: id, dynamic: true, optional: false })
      this.setState({ optional: false, dynamic: true });
    }
    else {
      this.props.addOptions(id, selection);
    }
  }

  onChangeSubOptionValue(id: number, event: any) {
    var selection = event.target.value;
    this.props.addSubOptions(id, this.state.option, selection);
  }

  onOptionSelect = (event: any) => {

    var selection = event.target.value
    var editingOption = true
    this.setState({
      option: selection, editorState: EditorState.createWithContent(convertFromRaw(JSON.parse((this.props.section!.options[selection].body)))), summary: this.props.section!.options[selection].summary!,
      icon: this.props.section!.options[selection].icon!, shortDescription: this.props.section!.options[selection].shortDescription!, editField: EditFieldEnum.Section, editingOption
    });
  }

  onSubOptionSelect = (event: any) => {
    var selection = event.target.value
    var editingOption = false;
    var body = this.props.section!.options[this.state.option].subOptions![selection].body;
    this.setState({
      subOption: selection, editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(body!))),
       editField: EditFieldEnum.SubOption, editingOption,
    });
  }


  onSummarySet = (event: any) => {
    var summary = event.target.value
    if (summary === '')
      summary = ' '
    this.setState({
      summary
    });

  }

  onShortDescriptionSet = (event: any) => {
    var shortDescription = event.target.value
    if (shortDescription === '')
      shortDescription = ' '
    this.setState({
      shortDescription
    });

  }

  onDescriptionOfChangeSet = (event: any) => {
    var descriptionOfChange = event.target.value
    if (descriptionOfChange === '')
      descriptionOfChange = ' '
    this.setState({
      descriptionOfChange
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
    label = '[' + label + ']';
    const editorState = this.state.editorState;
    const currentContent = this.state.editorState.getCurrentContent();
    const selection = this.state.editorState.getSelection();
    const entityKey = Entity.create('TokenSpan', 'IMMUTABLE', { meta });

    //var entityStyle = OrderedSet.of('bgcolor-rgb(192,192,192)')
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
    this.setState({
      editorState,
    });
  };

  Replacements = () => {
    //var open = false;

    const setOpen = (): void => {
      this.setState({
        openAutoTextSelect: !this.state.openAutoTextSelect,
      });
    }

    const { classes } = this.props;

    return (
      <div onClick={() => setOpen()} className="rdw-block-wrapper" aria-expanded={this.state.openAutoTextSelect} aria-label="rdw-block-control" role="button" tabIndex={0}>
        <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-expanded={this.state.openAutoTextSelect} aria-label="rdw-dropdown" style={{ width: 220 }}>
          <div className="rdw-dropdown-selectedtext" style={{ width: 220 }}>
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

  finishEdit = (editorState: EditorState): void => {
    this.props.saveContent(this.props.section?.id!, editorState.getCurrentContent(),
      this.state.title, this.state.option, this.state.subOption, this.state.summary, this.state.descriptionOfChange, this.state.icon, this.state.shortDescription, this.state.editField)
  }

  render() {
    const { editorState } = this.state;
    const { classes, config } = this.props;
    let editor, iconSelector, type_buttons, options, subOptions, editOption, editSubOption, summary, descriptionOfChange, 
              shortDescription, editingOptionTitle = '', subOptionSize = 0, selectedIcon;
    if (this.state.variable) {
      var type = 'Option ', currentOption = this.state.option;
      if (!this.state.editingOption) {
        type = 'SubOption ';
        currentOption = this.state.subOption;
      }
      editingOptionTitle = '(' + type + String.fromCharCode(65 + parseInt('' + currentOption)) + ')';
    }

    if (this.state.showEditor) {
      editor = <div >

        <InputLabel className={classes.title}>Text {editingOptionTitle}</InputLabel>
        <Editor
          toolbar={{
            options: ['inline', 'list'],
            inline: { inDropdown: false, options: ['bold', 'italic', 'underline'], },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
          }}
          toolbarCustomButtons={[this.Replacements()]}
          editorState={editorState}
          wrapperClassName={classes.wrapper}
          editorClassName={classes.editor}
          onEditorStateChange={this.onEditorStateChange.bind(this)}
          customBlockRenderFunc={this.customBlockStyleFn}
        />
      </div>;
      descriptionOfChange = <div className={classes.control}> <InputLabel className={classes.title}>Description of change (Optional)</InputLabel>
        <TextField className={classes.title} id="filled-label" variant="standard" value={this.state.descriptionOfChange || ''}
          suppressContentEditableWarning={true} contentEditable={true}
          onChange={(e) => this.onDescriptionOfChangeSet(e)} />

      </div>;
    }

    if (this.state.variable) {
      if (this.state.dynamic) {
        let optionAlphanumeric = [];
        for (let i = 0; i < this.props.section!.options.length; i++) {
          optionAlphanumeric.push(String.fromCharCode(65 + i));
        }
        options = <input className={classes.options} type="number" min="1" defaultValue={this.props.section!.options.length}></input>;
        editOption = <div style={{ 'marginLeft': '4vh' }} > <InputLabel >Option</InputLabel>
          <Select
            onChange={this.onOptionSelect}
          >
            <MenuItem disabled>Option</MenuItem>
            {optionAlphanumeric.map((option, index) =>
              <MenuItem value={index}>{option}</MenuItem>)};
          </Select>
        </div>;
      }
      var subOptionsArray = this.props.section!.options[this.state.option].subOptions!;
      if (typeof (subOptionsArray) !== 'undefined' && subOptionsArray!== null)
        subOptionSize = subOptionsArray.length;
      else
        subOptionSize = 0
      subOptions =
        <div style={{ 'marginTop': '2vh' }} onChange={(e) => this.onChangeSubOptionValue(this.props.section!.id!, e)}>
          <label>Subptions</label>
          <input className={classes.options} type="number" value={subOptionSize}></input>
        </div>
      let subOptionAlphanumeric = [];
      for (let i = 0; i < subOptionSize; i++) {
        subOptionAlphanumeric.push(String.fromCharCode(65 + i));
      }
      if (subOptionAlphanumeric.length > 0)

        editSubOption = <div style={{ 'marginLeft': '4vh' }} > <InputLabel>SubOption</InputLabel>
          <Select

            onChange={this.onSubOptionSelect}
          >

            <MenuItem disabled>SubOption</MenuItem>
            {subOptionAlphanumeric.map((option, index) =>
              <MenuItem value={index}>{option}</MenuItem>)};
          </Select>
          {subOptions}
        </div>;
      else
        editSubOption = <div style={{ 'marginLeft': '4vh' }} > <InputLabel>SubOption</InputLabel>
          <Select

            onChange={this.onSubOptionSelect}
          >

            <MenuItem disabled>SubOption</MenuItem>
          </Select>
          {subOptions}
        </div>;

      type_buttons =
        <div>
          <div onChange={(e) => this.onChangeValue(this.props.section!.id!, e)}>
            <label className={classes.radio}><input type="radio" value="optional" name="type" defaultChecked={this.state.optional} /> Optional Section</label>
            <label className={classes.radio}><input type="radio" value="dynamic" name="type" defaultChecked={this.state.dynamic} /> Dynamic Section
              {options}
            </label>
          </div>
        </div>;
    }


      const openIconSelector = (): void => {
        this.setState({
          openIconSelect: !this.state.openIconSelect,
        });
      }

      const selectIcon = (icon: EnumContractIcon | null): void => {
        this.setState({
          icon
        });
      }

    if (this.props.editField === EditFieldEnum.Section) {
      summary = <div className={classes.control}> <InputLabel className={classes.title}>Summary</InputLabel>
        <TextField className={classes.title} id="filled-label" variant="standard" value={this.state.summary}
          suppressContentEditableWarning={true} contentEditable={true} multiline={true}
          onChange={(e) => this.onSummarySet(e)} />
      </div>;

      shortDescription = <div className={classes.control}> <InputLabel className={classes.title}>Short description</InputLabel>
      <TextField className={classes.title} id="filled-label" variant="standard" value={this.state.shortDescription || ''}
        suppressContentEditableWarning={true} contentEditable={true}
        onChange={(e) => this.onShortDescriptionSet(e)} />
        </div>

      iconSelector =
        <div onClick={() => openIconSelector()} className="rdw-block-wrapper" aria-expanded={this.state.openIconSelect} aria-label="rdw-block-control" role="button" tabIndex={0}>
          <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-expanded={this.state.openIconSelect} aria-label="rdw-dropdown" style={{ width: 300 }}>
            <div className="rdw-dropdown-selectedtext">
              <span>Select icon</span>
              <div className={`rdw-dropdown-caretto${this.state.openIconSelect ? 'close' : 'open'}`} />
            </div>
            <ul className={`rdw-dropdown-optionwrapper ${this.state.openIconSelect ? classes.open : classes.close}`} >
              { config.contractIcons.map(icon => (
                <li
                  onClick={() => selectIcon(icon.icon)}
                  key={icon.icon}
                  className={`rdw-dropdownoption-default placeholder-li ${this.state.openIconSelect ? 'close' : 'open'}`}
                  style={{ display: 'block', padding: '5px' }}
                >
                  {icon.icon}
                  <img alt="" className={classes.icon}  src={`data:image/svg+xml;base64,${icon.image}`} />
                </li>
              ))}
              <li
                onClick={() => selectIcon(null)}
                className={`rdw-dropdownoption-default placeholder-li ${this.state.openIconSelect ? 'close' : 'open'}`}
                style={{ display: 'block', padding: '5px' }}
              >
                None
              </li>
            </ul>
          </div>
        </div>
        if (this.state.icon){
          const enumIcon = config.contractIcons.find(c => c.icon === this.state.icon);
          selectedIcon = <img className={classes.outerIcon} src={`data:image/svg+xml;base64,${enumIcon?.image}`} />
       }
    }
    return (
      <Grid container>
        {type_buttons}
        {editOption}
        {editSubOption}
        <TextField className={classes.title} id="filled-title" variant="standard" value={this.state.title} suppressContentEditableWarning={true} contentEditable={true} label='Title'
          onChange={(e) => this.setState({ title: e.target.value })}
        />

        {editor}

        {summary}

        {iconSelector}

        {selectedIcon}
        
        {shortDescription}

        <button className={classes.doneBtn}
          onClick={() => this.finishEdit(editorState)

          }>
          DONE
        </button>
      </Grid >
    );
  }

}


const mapState = (state: RootState) => ({
  config: state.config,
});

const mapDispatch = {
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(EditAreaComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Export localized component
export default connector(localizedComponent);

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

const placeholderOptions = [
  { key: "sellerID", value: "sellerID" },
  { key: "clientID", value: "clientID" },
  { key: "sellerName", value: "sellerName" },
  { key: "clientName", value: "clientName" },
  { key: "sellerVAT", value: "sellerVAT" },
  { key: "clientVAT", value: "clientVAT" },
  { key: "sellerAddress", value: "sellerAddress" },
  { key: "clientAddress", value: "clientAddress" },
  { key: "sellerEmail", value: "sellerEmail" },
  { key: "clientEmail", value: "clientEmail" },
  { key: "sellerContactPerson", value: "sellerContactPerson" },
  { key: "clientContactPerson", value: "clientContactPerson" },
  { key: "clientCompanyRegNumber", value: "clientCompanyRegNumber" },
  { key: "sellerCompanyRegNumber", value: "sellerCompanyRegNumber" },
  { key: "AssetPrice", value: "AssetPrice" },
  { key: "CurrentDate", value: "CurrentDate" },
  { key: "SellerLegalRep", value: "SellerLegalRep" },
  { key: "MTCId", value: "MTCId" },
  { key: "ContractId", value: "ContractId" },
  { key: "ProductId", value: "ProductId" },
  { key: "ProductName", value: "ProductName" },
  { key: "ProductDescription", value: "ProductDescription" },
  { key: "PastVersionsIncluded", value: "PastVersionsIncluded" },
  { key: "UpdatesIncluded", value: "UpdatesIncluded" },
  { key: "EstimatedDeliveryDate", value: "EstimatedDeliveryDate" },
  { key: "DeliveryMediaFormat", value: "DeliveryMediaFormat" },
  { key: "ApplicableFees", value: "ApplicableFees" },
  { key: "DomainList", value: "DomainList" },
  { key: "Date", value: "Date" },
  { key: "Years", value: "Years" },
  { key: "Period", value: "Period" },
  { key: "Number", value: "Number" },

]

