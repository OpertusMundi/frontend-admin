import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Styles
import { Button, createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Material UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { connect, ConnectedProps } from 'react-redux';


// Components
import PageComponent from 'components/contract/form/page';
import EditAreaComponent, { EditFieldEnum } from 'components/contract/form/edit-area';
import ContractReviewForm from './contract-review-form';

import { ContentState, convertToRaw } from 'draft-js';


import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Utilities
import { localizeErrorCodes } from 'utils/error';

// Services
import message from 'service/message';
import { EnumContractIcon, MasterContract, MasterContractCommand, Section, SubOption } from 'model/contract';
import ContractApi from 'service/contract';

import { RootState } from 'store';
import { StaticRoutes } from 'model/routes';
import { AxiosError } from 'axios';
import { AxiosObjectResponse, SimpleResponse } from 'model/response';
import { RouteComponentProps } from 'react-router-dom';

import { FieldMapperFunc } from 'utils/error';

import { setSelectedContract, setModifiedContract } from 'store/contract/actions';

import {stateToHTML} from 'draft-js-export-html';

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
  outerOutline: {
    height: '80vh',
    overflowY: 'auto',
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
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  columnSubtitle: {
    color: '#6C6C6C',
    fontSize: '1.1rem',
    fontWeight: 'normal',
  },
  contractGrid: {
    overflowY: 'auto',
    height: '80vh'
  },
  saveBtn: {
    backgroundColor: '#190AFF',
    color: '#fff',
    position: 'absolute',
    right: '2vh',
    marginTop: '50px',
    display: 'inline-block',
    width: '100px',
    height: '45px',
    borderRadius: '25px'
  },
  nextBtn: {
    backgroundColor: '#190AFF',
    color: '#fff',
    position: 'absolute',
    right: '2vh',
    marginTop: '120px',
    display: 'inline-block',
    width: '100px',
    height: '45px',
    borderRadius: '25px'
  },
  addBtn: {
    height: '50px',
    border: '1px dashed #6C6C6C',
  }
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
  descriptionOfChange: ''
}


const defaultOptions = {
  'body':`{"blocks":[{"key":"5u8f1","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenean facilisis egestas gravida.Integer porttito consectetur","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`
};

interface RouteParams {
  id?: string | undefined;
}

interface ContractFormComponentProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape;
}

interface ContractFormComponentState {
  confirm: boolean,
  confirmOnNavigate: boolean,
  contract: MasterContractCommand
  displayEditor: boolean;
  editField?: EditFieldEnum;
  displayToolbarActions: boolean;
  disableButtons: boolean;
  currentSection?: Section;
  review: boolean;
}

class ContractFormComponent extends React.Component<ContractFormComponentProps, ContractFormComponentState> {

  private api: ContractApi;

  constructor(props: ContractFormComponentProps) {
    super(props);

    this.api = new ContractApi();

    this.state = {
      confirm: false,
      confirmOnNavigate: true,
      contract: this.api.createNew(),
      disableButtons: false,
      displayEditor: false,
      displayToolbarActions: true,
      review: false,
    }
  }

  onNavigate(e: React.MouseEvent | null, url: string) {
    if (e) {
      e.preventDefault();
    }

    this.props.history.push(url);
  }

  get id(): number | null {
    const { id } = this.props.match.params;

    if (!id) {
      return null;
    }

    return Number.parseInt(id);
  }

  async loadData(): Promise<MasterContractCommand | null> {
    const id = this.id;

    if (id) {
      return this.api.findDraft(id).then((response: AxiosObjectResponse<MasterContract>) => {
        if (response.data.success) {
          const result = response.data.result!;
          const contract = this.api.contractToCommand(result)

          this.setState({
            contract,
          });

          return contract;
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, false);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));

          this.props.history.push(StaticRoutes.ContractManager);
        }
        return null;
      });
    } else {
      const contract = this.api.createNew();

      this.setState({
        confirm: false,
        contract,
        confirmOnNavigate: true,
      });

      return Promise.resolve(contract);
    }
  }

  componentDidMount() {
    this.loadData();
  }

  deleteSubtitle(): void {
    this.setState((state) => ({
      contract: {
        ...state.contract,
        subtitle: '',
      }
    }));
  }

  addSection(section: Partial<Section>): void {
    const { contract: { sections = [] } } = this.state;

    const lastSection = sections.slice(-1)[0];

    if (lastSection) {
      section.index = this.getCurrentIndex(sections, sections.length, 0);
    } else {
      section.index = '1';
    }
    this.setState((state) => ({
      contract: {
        ...state.contract,
        sections: [...state.contract.sections, {
          ...defaultSection, options: [{...defaultOptions}], ...section,
          subOptions: {}, ...section
        },]
      }
    }));
  }

  removeSection(id: number): void {
    const { contract } = this.state;

    if (!this.state.displayToolbarActions) {
      return;
    }

    var sections = [...contract.sections]
    sections = sections.filter((section) => {
      return (section.id !== id);
    });

    this.setState((state) => ({
      contract: {
        ...state.contract,
        sections: this.sortSections(sections),
      },
    }));
  }

  editSection(section: Partial<Section>, summary = "", option = 0, raw = "", descriptionOfChange = "", icon: EnumContractIcon | null, shortDescription = "", htmlContent= "", subOption = -1, ): void {
    const { contract } = this.state;
    let sections = [...contract.sections]
    const id = sections.findIndex((s) => s.id === section.id);
    if ('indent' in section) {
      if (!this.state.displayToolbarActions) {
        return;
      }
      var lastSection = sections[id - 1];
      if (section.indent === lastSection.indent + 8) {
        var lastIndex = lastSection.index + '.1'
        section.index = '' + lastIndex;
      } else if (section.indent === lastSection.indent) {
        section.index = this.getCurrentIndex(sections, id, section.indent!);
      } else if (section.indent === lastSection.indent - 8) {
        section.index = this.getCurrentIndex(sections, id, section.indent!);
      } else if ((section.indent!) <= lastSection.indent - 16) {
        section.index = this.getCurrentIndex(sections, id, section.indent!);
      } else {
        return;
      }
      sections[id].indent = section.indent!;
      sections = this.sortSections(sections);
      sections[id] = { ...sections[id], ...section };
      this.setState((state) => ({
        contract: {
          ...state.contract,
          sections,
        },
      }));
      return;
    }
    sections[id] = { ...sections[id], ...section };
    if (raw) {
      if (subOption < 0) {
        sections[id].options[option].body = raw
        sections[id].options[option].bodyHtml = htmlContent
      } else {
        // change sub option
        var subOptionArray = sections[id].options[option].subOptions!
        subOptionArray[subOption].body = raw;
        subOptionArray[subOption].bodyHtml = htmlContent;
      }
    }

    if (summary === ' ') {
      sections[id].options[option].summary! = ''
    } else if (summary) {
      sections[id].options[option].summary! = summary
    }
    if (icon === null) {
      sections[id].options[option].icon! = null!
    } else if (icon) {
      sections[id].options[option].icon! = icon
    }
    if (shortDescription) {
      sections[id].options[option].shortDescription = shortDescription;
    }
    if (descriptionOfChange) {
      sections[id].descriptionOfChange = descriptionOfChange;
    }
    this.setState((state) => ({
      contract: {
        ...state.contract,
        sections,
      }
    }));
  }

  getCurrentIndex(sections: Section[], id: number, indent: number): string {
    let index = '-1';
    for (let i = id - 1; i >= 0; i--) {
      let section = sections[i];
      if (section.indent === indent) {
        // increment by 1
        var lastIndex = section.index;
        var firstPart = '';
        if (section.index.includes('.')) {
          var sectionParts = section.index.split('.')
          lastIndex = sectionParts.pop()!
          firstPart = sectionParts.join('.') + '.'
        }
        var lastPart = parseInt(lastIndex, 10) + 1
        index = firstPart + '' + lastPart;
        break;
      }
      else if (section.indent <= indent - 8) {
        index = section.index + '.1'
        break;
      }
    }
    if (index === '-1') {
      var last = sections[id - 1].index
      lastIndex = last.slice(last.lastIndexOf('.') + 1) + '.1';
      index = '' + lastIndex;
    }
    return index
  }

  sortSections(sections: Section[]): Section[] {
    let sectionCopy = [...sections];
    for (let i = 1; i < sections.length; i++) {
      sections[i].index = this.getCurrentIndex(sectionCopy, i, sections[i].indent);
    }
    return sections;
  }

  moveSectionUp(section: Section): void {
    const { contract } = this.state;
    const sections = [...contract.sections]

    if (!this.state.displayToolbarActions) {
      return;
    }

    const id = sections.findIndex((s) => s.id === section.id);
    if (id === 0) {
      return;
    }
    const prevSection = sections[id - 1];
    const tempIndex = prevSection.index;
    const tempIndent = prevSection.indent;
    prevSection.index = section.index;
    prevSection.indent = section.indent;
    section.index = tempIndex;
    section.indent = tempIndent;
    sections[id - 1] = section;
    sections[id] = prevSection;
    this.setState((state) => ({
      contract: {
        ...state.contract,
        sections,
      }
    }));
  }

  moveSectionDown(section: Section): void {
    const { contract } = this.state;
    const sections = [...contract.sections];

    if (!this.state.displayToolbarActions) {
      return;
    }

    const id = sections.findIndex((s) => s.id === section.id);
    if (id === sections.length - 1) {
      return;
    }
    const nextSection = sections[id + 1];
    const tempIndex = nextSection.index;
    const tempIndent = nextSection.indent;
    nextSection.index = section.index;
    nextSection.indent = section.indent;
    section.index = tempIndex;
    section.indent = tempIndent;
    sections[id + 1] = section;
    sections[id] = nextSection;
    this.setState((state) => ({
      contract: {
        ...state.contract,
        sections,
      }
    }))
  }

  openEdit(editField: EditFieldEnum, section?: Section): void {
    if (!this.state.displayToolbarActions) {
      return
    }
    this.setState({
      displayEditor: true,
      displayToolbarActions: false,
      currentSection: section,
      editField: editField
    });
  }

  saveContent(id: number, contentState: ContentState, title: string, option: number, subOption: number,
    summary: string, descriptionOfChange: string, icon: EnumContractIcon | null, shortDescription: string, editField: EditFieldEnum): void {
    let raw, htmlContent='';
    raw = JSON.stringify(convertToRaw(contentState));
    if (contentState.getPlainText()){
      htmlContent = stateToHTML(contentState);
    }
    if (editField === EditFieldEnum.Section) {
      this.editSection({ id: id, title: title }, summary, option, raw, descriptionOfChange, icon, shortDescription, htmlContent);
    } else if (editField === EditFieldEnum.SubOption) {
      this.editSection({ id: id, title: title }, summary, option, raw, descriptionOfChange, icon, shortDescription, htmlContent, subOption);
    } else if (editField === EditFieldEnum.Title) {
      this.setState((state) => ({
        contract: {
          ...state.contract,
          title,
        }
      }));
    } else {
      this.setState((state) => ({
        contract: {
          ...state.contract,
          subtitle: title,
        }
      }));
    }
    this.setState({ displayEditor: false, displayToolbarActions: true });
  }

  addOptions(sectionId: number, options: number): void {
    const { contract } = this.state;
    const sections = [...contract.sections];

    const id = sections.findIndex((s) => s.id === sectionId);
    var section = sections[id];
    var length = section.options.length

    if (options < length) {
      for (let i = length; i > options; i--) {
        section.options.pop();
      }
    } else {
      for (let i = length; i < options; i++) {
        section.options.push({'body':`{"blocks":[{"key":"5u8f1","text":"Additional option","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`});
      }
    }
    sections[id] = { ...sections[id], ...section };
    this.setState((state) => ({
      contract: {
        ...state.contract,
        sections,
      }
    }));
  }

  addSubOptions(sectionId: number, option: number, subOptions: number): void {
    const { contract } = this.state;
    const sections = [...contract.sections];

    const id = sections.findIndex((s) => s.id === sectionId);
    var section = sections[id];
    let subOptionsArray = section.options[option].subOptions!;
    if (subOptionsArray)
      var length = subOptionsArray.length;
    else
      length = 0;
    if (length > 0) {
      for (let i = length; i < subOptions; i++)
        subOptionsArray.push({
          'body': `{"blocks":[{"key":"5u8f1","text":"Additional subOption","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
          'bodyHtml': '<p>Additional subOption</p>'
        });
    }
    else {
      length = 0
      subOptionsArray = new Array<SubOption>();
      subOptionsArray.push({
        'body': `{"blocks":[{"key":"5u8f1","text":"Additional subOption","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        'bodyHtml': '<p>Additional subOption</p>'
      });

      section.options[option].subOptions = subOptionsArray;
    }

    if (subOptions < length) {
      for (let i = length; i > subOptions; i--) {
        subOptionsArray.pop();
      }
    }
    sections[id] = { ...sections[id], ...section };
    this.setState((state) => ({
      contract: {
        ...state.contract,
        sections,
      },
    }));
  }

  editTitle(title: string): void {
    this.setState((state) => ({
      contract: {
        ...state.contract,
        title,
      }
    }));
  }

  discardChanges(): void {
    this.setState({
      confirmOnNavigate: false,
    }, () => this.props.history.push(StaticRoutes.ContractManager));
  }

  saveDraft(): void {
    const command: MasterContractCommand = {
      ...this.state.contract
    };
    const { id } = command;


    (id === null ? this.api.createDraft(command) : this.api.updateDraft(id, command))
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
      });
  }

  renderReview() {
    const { contract } = this.state;

    return (
      <ContractReviewForm
        contract={contract}
        saveContract={() => this.saveDraft()}
      />
    );
  }

  renderEdit() {
    const { contract } = this.state;
    const { classes } = this.props;
    const sections = contract?.sections || [];

    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    // sort by index
    sections.sort((a, b) => collator.compare(a.index, b.index))

    const outline = sections.map(section => {
      let type = '';
      if (section.optional) {
        type = '(Opt.)'
      }
      else if (section.dynamic) {
        type = '(Dyn.)'
      }
      else if (section.variable) {
        type = '(Var.)'
      }
      if (section.title)
        var sectionTitle = 'Section ' + section.index + ' - ' + section.title + ' ' + type
      else
        sectionTitle = 'Section ' + section.index + ' ' + type
      return (
        <div
          key={section.id}
          className={classes.section}
          style={{ paddingLeft: section.indent }}
        >
          <FormattedMessage id={section.id! + 1} defaultMessage={sectionTitle} />
        </div>
      );
    });
    let editor;
    if (this.state.displayEditor) {
      editor = <EditAreaComponent
        sectionList={sections}
        section={this.state.currentSection}
        documentTitle={contract.title}
        documentSubtitle={contract.subtitle}
        editField={this.state.editField!}
        saveContent={this.saveContent.bind(this)}
        editSection={this.editSection.bind(this)}
        addOptions={this.addOptions.bind(this)}
        addSubOptions={this.addSubOptions.bind(this)}
      />;
    }
    let toolbarActions;
    if (this.state.displayToolbarActions) {
      if (sections.length > 0) {
        // get max current id
        var newId = Math.max.apply(Math, sections.map((o) => o.id!)) + 1
      } else {
        newId = 0;
      }
      toolbarActions = (
        <Grid container item xs={12} className={classes.toolbox}>
          <button className={classes.addBtn} style={{ marginRight: 20 }}
            onClick={() =>
              this.addSection({ variable: false, id: newId })
            }
          >
            Add Section
          </button>
          <button className={classes.addBtn}
            onClick={() =>
              this.addSection({ variable: true, id: newId })
            }
          >
            Add Variable Section
          </button>
        </Grid>
      );
    }

    return (
      <Grid container>
        <Grid container item xs={2} className={classes.outerOutline}>
          <Paper className={classes.paper && classes.outline}>
            <div className={classes.columnTitle}>
              <FormattedMessage id="document.outline" defaultMessage={'Document Outline'} />
            </div>
            <div className={classes.documentTitle}>
              <FormattedMessage id="document.outline.title" defaultMessage={contract.title} />
            </div>
            <div className={classes.documentSubtitle}>
              <FormattedMessage id="document.outline.subtitle" defaultMessage="{documentSubtitle}"
                values={{
                  documentSubtitle: contract.subtitle,
                }} />
            </div>
            {outline}
          </Paper>
        </Grid>
        <Grid container item xs={5} className={classes.contractGrid}>
          <Paper className={classes.paper}>
            <div className={classes.columnTitle}>
              <FormattedMessage id="document.title" defaultMessage={'Contract structure'} />
              <div className={classes.columnSubtitle}>
                <FormattedMessage id="document.toolbar.subtitle" defaultMessage={`Here you can preview your master contract
                  as you build it and manage it's structure.`} />
              </div>
            </div>
            <PageComponent
              documentTitle={contract.title}
              documentSubtitle={contract.subtitle}
              sectionList={sections}
              deleteSubtitle={this.deleteSubtitle.bind(this)}
              editTitle={this.editTitle.bind(this)}
              removeSection={this.removeSection.bind(this)}
              editSection={this.editSection.bind(this)}
              openEdit={this.openEdit.bind(this)}
              moveSectionUp={this.moveSectionUp.bind(this)}
              moveSectionDown={this.moveSectionDown.bind(this)}
            />

          </Paper>
        </Grid>
        <Grid container item xs={4} className={classes.grid}>
          <Paper className={classes.paper}>
            <div className={classes.columnTitle}>
              <FormattedMessage id="document.toolbar" defaultMessage={'Toolbar'} />
              <div className={classes.columnSubtitle}>
                <FormattedMessage id="document.toolbar.subtitle" defaultMessage={'For selected elements, all available actions appear here'} />
              </div>
            </div>

            <div className={classes.columnTitle}>
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
              this.saveDraft()
            }
          >
            Save
          </Button>
          <Button className={classes.nextBtn}
            variant="contained"
            onClick={(e) => this.setState({ review: true })}
          >
            Next
          </Button>
        </div>
      </Grid>
    );
  }

  render() {
    const { review } = this.state;

    return review ? this.renderReview() : this.renderEdit();
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
