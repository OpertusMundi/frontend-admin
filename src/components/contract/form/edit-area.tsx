import React from 'react';

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
    width: '100%',
    borderStyle: 'solid',
    borderWidth: '0.5px',
    padding: '10px',

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
  },
});

export enum EditFieldEnum {
  Section = 'section',
  Suboption = 'suboption',
  Title = 'title',
  Subtitle = 'subtitle',
};

interface EditAreaComponentProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  section?: Section;
  documentTitle?: string;
  documentSubtitle?: string;
  saveContent: (id: number, contentState: ContentState, body: string, title: string, option: number, suboption: number,
    summary: string, descriptionOfChange: string, icon: string, editField: EditFieldEnum) => void;
  editSection: (item: any) => void;
  addOptions: (sectionId: number, options: number) => void;
  addSuboptions: (sectionId: number, option: number, suboptions: number) => void;
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
  icon: string;
  option: number;
  suboption: number;
  editField: EditFieldEnum;
  // title for editing option or suboption
  editingOption: boolean;
  openAutoTextSelect: boolean;
  openIconSelect: boolean;
}

class EditAreaComponent extends React.Component<EditAreaComponentProps, EditAreaComponentState> {

  constructor(props: EditAreaComponentProps) {
    super(props);
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
      editorState, title, option: 0, suboption: 0, editingOption: true, showEditor: show, summary, descriptionOfChange, variable, optional, dynamic, icon, openAutoTextSelect: false, openIconSelect: false,
      editField: this.props.editField
      
    };
  }


  customBlockStyleFn = (contentBlock: ContentBlock) => {
    return ['public-DraftStyleDefault-block'];

    
  }

  onChangeValue(id: number, event: any) {
    var selection = event.target.value
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
      this.props.addOptions(id, selection);
    }
  }

  onChangeSuboptionValue(id: number, event: any) {
    var selection = event.target.value;
    this.props.addSuboptions(id, this.state.option, selection);
  }

  onOptionSelect = (event: any) => {
    
    var selection = event.target.value
    var editingOption = true
    this.setState({
      option: selection, editorState: EditorState.createWithContent(convertFromRaw(JSON.parse((this.props.section!.styledOptions[selection])))),
      summary: this.props.section!.summary![selection], icon: this.props.section!.icons![selection], editField: EditFieldEnum.Section, editingOption
    });
  }

  onSuboptionSelect = (event: any) => {
    var selection = event.target.value
    var editingOption = false;
    var body =this.props.section!.suboptions[this.state.option][selection].body;
    this.setState({
      suboption: selection, editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(body!))),
      summary: this.props.section!.summary![selection], icon: this.props.section!.icons![selection], editField: EditFieldEnum.Suboption ,editingOption, 
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
          this.state.title, this.state.option, this.state.suboption, this.state.summary, this.state.descriptionOfChange, this.state.icon, this.state.editField)
  }

  render() {
    const { editorState } = this.state;
    const { classes } = this.props;
    let editor, iconSelector, type_buttons, options, suboptions, editOption, editSuboption, summary, descriptionOfChange, editingOptionTitle='', suboptionsSize=0;
    
    if (this.state.dynamic){
      var type='Option ', currentOption =this.state.option ;
      if (!this.state.editingOption){
        type='Suboption ';
        currentOption = this.state.suboption;
      }
      editingOptionTitle = '(' + type + String.fromCharCode(65 + parseInt('' +currentOption)) + ')';
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
        options = <input className={classes.options} type="number" min="1" defaultValue={this.props.section!.options.length}></input>;
        editOption = <div style={{ 'marginLeft': '4vh' }} > <InputLabel >Option</InputLabel>
          <Select
            onChange={this.onOptionSelect}
          >
             <MenuItem disabled>Option</MenuItem>
            {optionAlphanumeric.map((option, index) =>
              <MenuItem  value={index}>{option}</MenuItem>)};
          </Select>
        </div>;
        var suboptionsArray = this.props.section!.suboptions[this.state.option];
        if (typeof(suboptionsArray)!=='undefined')
          suboptionsSize = suboptionsArray.length;
        else 
          suboptionsSize = 0
          console.log('suboptionsArray - option', suboptionsArray, this.state.option, suboptionsSize);
          suboptions = 
          <div  style={{'marginTop': '2vh' }} onChange={(e) => this.onChangeSuboptionValue(this.props.section!.id!, e)}>
            <label>Suboptions</label>
            <input className={classes.options} type="number" value={suboptionsSize}></input>
          </div>
          let suboptionAlphanumeric = [];
          for (let i = 0; i < suboptionsSize; i++) {
            suboptionAlphanumeric.push(String.fromCharCode(65 + i));
          }
        if (suboptionAlphanumeric.length>0)

          editSuboption = <div style={{ 'marginLeft': '4vh' }} > <InputLabel>Suboption</InputLabel>
            <Select

              onChange={this.onSuboptionSelect}
            >

              <MenuItem disabled>Suboption</MenuItem>
              {suboptionAlphanumeric.map((option, index) =>
                <MenuItem value={index}>{option}</MenuItem>)};
        </Select>
            {suboptions}
          </div>;
        else
          editSuboption = <div style={{ 'marginLeft': '4vh' }} > <InputLabel>Suboption</InputLabel>
            <Select

              onChange={this.onSuboptionSelect}
            >

              <MenuItem disabled>Suboption</MenuItem>
        </Select>
            {suboptions}
          </div>;
        

        
      }

      type_buttons =
      <div>
        <div onChange={(e) => this.onChangeValue(this.props.section!.id!, e)}>
          <label className={classes.radio}><input type="radio" value="optional" name="type" defaultChecked={this.state.optional} /> Optional Section</label>
          <label className={classes.radio}><input type="radio" value="dynamic" name="type" defaultChecked={this.state.dynamic} /> Dynamic Section
                        {options}
          </label>
          </div>
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
        {editSuboption}
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
