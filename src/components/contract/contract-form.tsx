import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Styles
import { Button, createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
//import 'styles/node-renderer.scss';

// Material UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { connect, ConnectedProps } from 'react-redux';


// Custom components
import PageComponent from 'components/contract/form/page';

import EditAreaComponent, { EditFieldEnum } from 'components/contract/form/edit-area';

import { ContentState, convertToRaw } from 'draft-js';


import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Utilities
import { localizeErrorCodes } from 'utils/error';

// Services
import message from 'service/message';
import { Section } from 'model/section';
import { Contract } from 'model/contract';
import ContractApi from 'service/contract';

import { RootState } from 'store';
import { DynamicRoutes, StaticRoutes } from 'model/routes';
import { AxiosError } from 'axios';
import { AxiosObjectResponse, SimpleResponse } from 'model/response';
import { RouteComponentProps } from 'react-router-dom';

import { FieldMapperFunc } from 'utils/error';

import { setSelectedContract, setModifiedContract } from 'store/contract/actions';

const fieldMapper: FieldMapperFunc = (field: string): string | null => {
  switch (field) {
    case 'id':
      return 'contract.form.field.id';
  }
  return null;
};

const styles = (theme: Theme) => createStyles({
  paper: {
    paddingLeft: '30px',
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: 0,
    minHeight: '70vh',
    width: '100%',
  },
  toolbox: {
    padding: theme.spacing(2),
    flexBasis: '20%',
  },
  grid: {
    flexBasis: 'inherit',
  },
  body: {
    display: 'block',
  },
  outline: {
    paddingLeft: '30px',
    width: '45vh',
  },
  section: {
    color: '#6C6C6C',
    fontWeight: 'normal',
    fontSize: '1rem',
    textAlign: 'left',
  },
  documentTitle: {
    marginTop: '60px',
    marginBottom: '10px',
    fontWeight: 'normal',
    fontSize: '1rem',
    color: '#6C6C6C',
  },
  documentSubtitle: {
    marginBottom: '10px',
    fontWeight: 'normal',
    fontSize: '1rem',
    color: '#6C6C6C',
  },
  columnTitle: {
    marginTop: '3vh',
    marginBottom: '2vh',
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  columnSubtitle: {
    color: '#6C6C6C',
    fontSize: '0.8rem',
    fontWeight: 'normal',
  },
  contractGrid: {
    overflowY: 'auto',
    height: '80vh'
  },
  saveBtn: {
    position: 'absolute',
    right: '40px',
    marginTop: '50px',
    display: 'inline-block',
    width: '100px',
  },
  nextBtn: {
    position: 'absolute',
    right: '40px',
    marginTop: '120px',
    display: 'inline-block',
    width: '100px',
  },
});

const defaultSection: Section = {
  id: 0,
  index: '1',
  indent: 0,
  title: 'Title',
  variable: false,
  optional: false,
  dynamic: false,
  options: [],
  styledOptions: [],
  summary: [''],
  icons: [''],
  descriptionOfChange: ''
}

const defaultOptions = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenean facilisis egestas gravida.Integer porttitor consectetur"];

const defaultStyledOptions = [`{"blocks":[{"key":"5u8f1","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenean facilisis egestas gravida.Integer porttito consectetur","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`]

interface RouteParams {
  id?: string | undefined;
}

interface ContractFormComponentProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape;
}

interface ContractFormComponentState {
  confirm: boolean,
  confirmOnNavigate: boolean,
  contract: Contract;

  documentTitle: string;
  documentSubtitle?: string;
  sectionList: Section[];
  displayEditor: boolean;
  editField?: EditFieldEnum;
  displayToolbarActions: boolean;
  disableButtons: boolean;
  currentSection?: Section;
}

class ContractFormComponent extends React.Component<ContractFormComponentProps, ContractFormComponentState> {

  private api: ContractApi;


  constructor(props: ContractFormComponentProps) {
    super(props);
    this.api = new ContractApi();
    // var contract = null

    var contract = this.api.createNew();
    this.state = {
      sectionList: contract.sections, displayEditor: false, contract, displayToolbarActions: true, disableButtons: false,
      confirm: false, confirmOnNavigate: true, documentTitle: contract.title, documentSubtitle: contract.subtitle
    }
  }

  onNavigate(e: React.MouseEvent | null, url: string) {
    var contract = this.state.contract;
    contract.sections = this.state.sectionList;
    // convert to string for serialization
    //var modifiedAt = contract.modifiedAt?.toString();
    // var createdAt = contract.createdAt?.toString();\
    if (e) {
      e.preventDefault();
    }
    console.log('contract', contract);

    this.props.setModifiedContract(contract);
    this.props.history.push({
      pathname: url,
    })
  }

  get id(): number | null {
    const { id } = this.props.match.params;
    if (!id) {
      return null;
    }

    return Number.parseInt(id);
  }

  componentDidMount() {
    var contract = null;
    const contractId = this.props.contractId
    if (contractId) {
      //id = location!.state.id!
      console.log('id', contractId);
      this.api.findOne(contractId).then((response: AxiosObjectResponse<Contract>) => {
        if (response.data.success) {
          contract = response.data.result;
          console.log('contract', contract)
          this.setState({ contract: contract, sectionList: contract.sections, documentTitle: contract.title, documentSubtitle: contract.subtitle })
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, false);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));

          this.props.history.push(StaticRoutes.ContractManager);
        }
      });
    }
    return
  }

  deleteSubtitle(): void {
    this.setState({
      documentSubtitle: ''
    });
  }

  addSection(section: Partial<Section>): void {

    var lastSection = this.state.sectionList.slice(-1)[0];
    console.log('In add section id:', section.id)
    if (lastSection) {
      //var lastIndex = parseInt(lastSection.index.split('.')[0], 10) + 1;
      //section.index = '' + lastIndex;
      section.index = this.getCurrentIndex(section.id!, 0);
    }
    else {
      section.index = '1';
    }
    this.setState((state) => ({
      sectionList: [...state.sectionList, {
        ...defaultSection, options: [...defaultOptions], ...section, styledOptions: [...defaultStyledOptions], ...section,
        summary: [...[""]], ...section, icons: [...[""]], ...section
      },]
    }));
    console.log('section id ' + section.id)
    console.log('section list ' + this.state.sectionList)
  }

  removeSection(id: number): void {
    console.log('In remove id', id);

    if (!this.state.displayToolbarActions)
      return

    var sections = [...this.state.sectionList]

    sections = sections.filter((section) => {
      return (section.id !== id);

      //sectionList: this.state.sectionList.filter(section => section.index == id)
    });

    sections = this.sortSections(sections);
    this.setState({
      sectionList: sections
    });
    console.log('length:' + this.state.sectionList.length + ' index:' + id);
    console.log(this.state.sectionList)
  }

  editSection(section: Partial<Section>, body = "", summary = "", option = 0, raw = "", descriptionOfChange = "", icon = ""): void {
    console.log('In edit section:', section, summary, option);
    var sections = [...this.state.sectionList]
    const id = sections.findIndex((s) => s.id === section.id);
    if ('indent' in section) {
      if (!this.state.displayToolbarActions)
        return
      var lastSection = this.state.sectionList[id - 1];
      if (section.indent === lastSection.indent + 8) {
        // var lastIndex = lastSection.index.split('.')[lastSection.index.length - 1] + '.1'
        var lastIndex = lastSection.index + '.1'
        section.index = '' + lastIndex;
      }
      else if (section.indent === lastSection.indent) {
        lastIndex = lastSection.index.slice(lastSection.index.lastIndexOf('.') + 1);
        var currIndex = parseInt(lastIndex, 10) + 1
        section.index = lastSection.index.slice(0, -1) + '' + currIndex;
      }
      else if (section.indent === lastSection.indent - 8) {
        section.index = this.getCurrentIndex(section.id!, section.indent);
      }
      else {
        return
      }
      sections[id].indent = section.indent;
      sections = this.sortSections(sections);
    }
    sections[id] = { ...sections[id], ...section };
    if (body) {
      sections[id].options[option] = body
      sections[id].styledOptions[option] = raw
    }
    if (summary === ' ')
      sections[id].summary![option] = ''
    else if (summary) {
      console.log(sections[id].title)
      sections[id].summary![option] = summary
    }
    if (icon === 'empty')
      sections[id].icons![option] = ''
    else if (icon)
      sections[id].icons![option] = icon
    if (descriptionOfChange)
      sections[id].descriptionOfChange = descriptionOfChange;
    this.setState({
      sectionList: sections,
    });
  }

  getCurrentIndex(id: number, indent: number): string {
    var index = '1.1';
    for (let i = id - 1; i >= 0; i--) {
      var section = this.state.sectionList[i]
      console.log('get index section ' + section.id + ' i ' + i)
      if (section.indent === indent) {
        var lastIndex = section.index.slice(section.index.lastIndexOf('.') + 1);
        var currIndex = parseInt(lastIndex, 10) + 1
        index = section.index.slice(0, -1) + '' + currIndex;
        console.log('last ' + lastIndex + ' curr ' + currIndex, 'index', index)
        break;
      }
      else if (section.indent === indent - 8) {
        lastIndex = section.index.slice(section.index.lastIndexOf('.') + 1) + '.1';
        index = '' + lastIndex;
        break;
      }
    }
    return index
  }

  sortSections(sections: Section[]): Section[] {
    console.log('in sort')
    for (let i = 1; i < sections.length; i++) {
      var id = sections.findIndex((s) => s.id === i);
      console.log('sorting section:', sections[i].id, 'i:', i, 'id', id)
      sections[i].index = this.getCurrentIndex(i, sections[i].indent)
      console.log('index', sections[i].index)
    }
    return sections;
  }

  moveSectionUp(section: Section): void {
    if (!this.state.displayToolbarActions)
      return
    var sections = [...this.state.sectionList]
    const id = sections.findIndex((s) => s.id === section.id);
    if (id ===0 ){
      return
    }
    var prevSection = this.state.sectionList[id - 1];
    var tempIndex = prevSection.index;
    var tempIndent = prevSection.indent;
    prevSection.index = section.index;
    prevSection.indent = section.indent;
    section.index = tempIndex;
    section.indent = tempIndent;
    sections[id - 1] = section;
    sections[id] = prevSection;
    this.setState({
      sectionList: sections
    });
  }

  moveSectionDown(section: Section): void {
    if (!this.state.displayToolbarActions)
      return
    var sections = [...this.state.sectionList]
    const id = sections.findIndex((s) => s.id === section.id);
    if (id ===this.state.sectionList.length-1 ){
      return
    }
    var nextSection = this.state.sectionList[id + 1];
    var tempIndex = nextSection.index;
    var tempIndent = nextSection.indent;
    nextSection.index = section.index;
    nextSection.indent = section.indent;
    section.index = tempIndex;
    section.indent = tempIndent;
    sections[id + 1] = section;
    sections[id] = nextSection;
    this.setState({
      sectionList: sections
    });
  }

  openEdit(editField: EditFieldEnum, section?: Section): void {
    console.log('In open edit section:', section, editField);
    if (!this.state.displayToolbarActions){
      return
    }
    this.setState({
      displayEditor: true,
      displayToolbarActions: false,
      currentSection: section,
      editField: editField
    });
  }

  saveContent(id: number, contentState: ContentState, body: string, title: string, option: number, summary: string, descriptionOfChange: string, icon: string, editField: EditFieldEnum): void {
    var raw = JSON.stringify(convertToRaw(contentState));
    if (editField === EditFieldEnum.Section) {
      this.editSection({ id: id, title: title }, body, summary, option, raw, descriptionOfChange, icon);
    }
    else if (editField === EditFieldEnum.Title)
      this.setState({ documentTitle: title });
    else
      this.setState({ documentSubtitle: title });
    this.setState({ displayEditor: false, displayToolbarActions: true });

  }

  addOptions(sectionId: number, options: number): void {
    var sections = [...this.state.sectionList]
    const id = sections.findIndex((s) => s.id === sectionId);
    console.log('In create options: ', sectionId, options, sections)
    var section = sections[id];
    var length = section.styledOptions.length
    if (options < length) {
      for (let i = length; i > options; i--) {
        section.options.pop();
        section.styledOptions.pop();
      }
    }
    else
      for (let i = length; i < options; i++) {
        section.options.push('Additional option');
        section.styledOptions.push(`{"blocks":[{"key":"5u8f1","text":"Additional option","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`);
        section.summary!.push('');
        section.icons!.push('');
      }
    sections[id] = { ...sections[id], ...section };
    this.setState({
      sectionList: sections,
    });
  }

  editTitle(title: string): void {
    this.setState({ documentTitle: title });
  }

  discardChanges(): void {
    this.setState({
      confirmOnNavigate: false,
    }, () => this.props.history.push(StaticRoutes.ContractManager));
  }

  saveContract(): Contract {
    const id = this.state.contract.id;
    this.setState({
      contract: {
        ...this.state.contract, sections: this.state.sectionList
      },
    });
    var contract = { ...this.state.contract, sections: this.state.sectionList, title: this.state.documentTitle, subtitle: this.state.documentSubtitle };
    console.log('contract', contract);
    (id === null || typeof (id) === 'undefined' ? this.api.create(contract) : this.api.update(id!, contract))
      .then((response) => {
        if (response.data.success) {
          this.discardChanges();
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, true, fieldMapper);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true, fieldMapper);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      })
      .finally(() => {
      });
    return contract;
  }

  render() {

    const { sectionList } = this.state;
    const { classes } = this.props;
    const outline = this.state.sectionList.map(section => {
      let type = '';
      if (section.optional) {
        type = 'Opt. '
      }
      else if (section.dynamic) {
        type = 'Dyn. '
      }
      else if (section.variable) {
        type = 'Var. '
      }
      return (<div key={section.id} className={classes.section}>
        <FormattedMessage id={section.id! + 1} defaultMessage={type + 'Section ' + section.index + ' - ' + section.title} />
      </div>)
    });
    let editor;
    if (this.state.displayEditor) {
      editor = <EditAreaComponent sectionList={this.state.sectionList} section={this.state.currentSection} documentTitle={this.state.documentTitle}
        documentSubtitle={this.state.documentSubtitle} editField={this.state.editField!}
        saveContent={this.saveContent.bind(this)} editSection={this.editSection.bind(this)}
        addOptions={this.addOptions.bind(this)} />;
    }
    let toolbarActions;
    if (this.state.displayToolbarActions) {
      toolbarActions = <Grid container item xs={12} className={classes.toolbox}><button style={{ height: 50, marginRight: 20 }}
        onClick={() =>
          this.addSection({ variable: false, id: this.state.sectionList.length })
        }
      >
        Add Section
    </button>
        <button style={{ height: 50 }}
          onClick={() =>
            this.addSection({ variable: true, id: this.state.sectionList.length })
          }
        >
          Add Variable Section
    </button>
      </Grid>;
    }

    return (
      <Grid container >
        <Grid container item xs={2}>
          <Paper className={classes.paper && classes.outline} >
            <div className={classes.columnTitle} >
              <FormattedMessage id="document.outline" defaultMessage={'Document Outline'} />
            </div>
            <div className={classes.documentTitle} >
              <FormattedMessage id="document.outline.title" defaultMessage={this.state.documentTitle} />
            </div>
            <div className={classes.documentSubtitle} >
              <FormattedMessage id="document.outline.subtitle" defaultMessage="{documentSubtitle}"
                values={{
                  documentSubtitle: this.state.documentSubtitle,
                }} />
            </div>
            {outline}
          </Paper>
        </Grid>
        <Grid container item xs={5} className={classes.contractGrid}>
          <Paper className={classes.paper}>
            <div className={classes.columnTitle} >
              <FormattedMessage id="document.title" defaultMessage={'Contract structure'} />
              <div className={classes.columnSubtitle} >
                <FormattedMessage id="document.toolbar.subtitle" defaultMessage={`Here you can preview your master contract
                  as you build it and manage it's structure.`} />
              </div>
            </div>
            <PageComponent
              documentTitle={this.state.documentTitle}
              documentSubtitle={this.state.documentSubtitle}
              sectionList={sectionList}
              deleteSubtitle={this.deleteSubtitle.bind(this)}
              addSection={(item) => {
                console.log(item);
              }}
              editTitle={this.editTitle.bind(this)}
              removeSection={this.removeSection.bind(this)}
              editSection={this.editSection.bind(this)}
              openEdit={this.openEdit.bind(this)}
              moveSectionUp={this.moveSectionUp.bind(this)}
              moveSectionDown={this.moveSectionDown.bind(this)}
            />

          </Paper>
        </Grid>
        <Grid container item xs={4} className={classes.grid} >
          <Paper className={classes.paper}>
            <div className={classes.columnTitle} >
              <FormattedMessage id="document.toolbar" defaultMessage={'Toolbar'} />
              <div className={classes.columnSubtitle} >
                <FormattedMessage id="document.toolbar.subtitle" defaultMessage={'For selected elements, all available actions appear here'} />
              </div>
            </div>

            <div className={classes.columnTitle} >
              <FormattedMessage id="document.elements" defaultMessage={'Document elements'} />
            </div>
            {toolbarActions}
            <Grid container item xs={12}>
              {editor}
            </Grid>
          </Paper>
        </Grid>
        <div>
          <Button
            className={classes.saveBtn}
            variant="contained"
            onClick={() =>
              this.saveContract()
            }
          >
            Save
        </Button>
          <Button className={classes.nextBtn}
            style={{ height: 50 }}
            variant="contained"
            onClick={(e) =>
              this.onNavigate(e, DynamicRoutes.ContractReview)
            }
          >
            Next
            </Button>
        </div>
      </Grid >


    );

  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  loading: state.contract.loading,
  lastUpdated: state.contract.lastUpdated,
  contractId: state.contract.contractId,
  contract: state.contract.contract,
});

const mapDispatch = {
  setSelectedContract,
  setModifiedContract,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ContractFormComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Export localized component
export default connector(localizedComponent);
