import React from 'react';
import clsx from 'clsx';

import { AxiosError } from 'axios';

// Localization, Routing
import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, useParams, NavigateFunction, Location } from 'react-router-dom';

// Styles
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connect, ConnectedProps } from 'react-redux';

// Components
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ContentState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import Icon from '@mdi/react';
import { mdiCheckOutline, mdiCloseOutline, mdiCommentAlertOutline, mdiDomain, mdiEraser } from '@mdi/js';

import AsyncCustomerAutoComplete from 'components/common/customer-auto-complete';
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';
import ContractReviewForm from './contract-review-form';
import EditAreaComponent, { EditFieldEnum } from 'components/contract/form/edit-area';
import PageComponent from 'components/contract/form/page';

// Store
import { RootState } from 'store';
import { createDraft, modifyContract, toggleProviderDialog, setProvider } from 'store/contract/actions';
import { findProviders, getDraft } from 'store/contract/thunks';

// Utilities
import { localizeErrorCodes } from 'utils/error';
import { FieldMapperFunc } from 'utils/error';

// Services
import message from 'service/message';
import ContractApi from 'service/contract';

// Model
import { StaticRoutes } from 'model/routes';
import { ObjectResponse, SimpleResponse } from 'model/response';
import { ClientContact } from 'model/chat';
import { EnumContractIcon, MasterContract, MasterContractCommand, Section, SubOption } from 'model/contract';


const fieldMapper: FieldMapperFunc = (field: string): string | null => {
  switch (field) {
    case 'id':
      return 'contract.form.field.id';
  }
  return null;
};

const styles = (theme: Theme) => createStyles({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  contractContainer: {
    height: 'calc(100vh - 115px)',
    display: 'flex',
    flexWrap: 'nowrap',
  },
  inline: {
    display: 'inline',
    marginRight: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    borderRadius: 0,
  },
  contentPaper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: 0,
    minHeight: '70vh',
    width: '100%',
  },
  toolbox: {
    flexBasis: '20%',
  },
  toolbarOuter: {
    height: '100%',
    overflowY: 'hidden',
  },
  toolbarInner: {
    height: '100%',
    padding: '0px 5px',
  },
  body: {
    display: 'block',
  },
  outlineInner: {
    height: '100%',
    padding: '0px 5px 0px 30px',
  },
  outlineOuter: {
    height: '100%',
    overflowY: 'hidden',
  },
  outlineContent: {
    height: 'calc(100% - 60px)',
    overflowY: 'hidden',
  },
  section: {
    color: '#6C6C6C',
    fontWeight: 'normal',
    fontSize: '1rem',
    textAlign: 'left',
    "&:hover": {
      opacity: '50%',
      cursor: 'all-scroll'
    }
  },
  documentTitle: {
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
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    flex: '110px',
    alignItems: 'center',
  },
  sectionListOuter: {
    height: '100%',
    overflow: 'hidden',
  },
  sectionListInner: {
    height: '100%',
    padding: '0px 5px 0px 15px',
  },
  sectionListContent: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: 'calc(100% - 60px)',
    width: '100%',
    overflow: 'hidden',
  },
  saveBtn: {
    borderRadius: 0,
    marginTop: '50px',
    display: 'flex',
    width: '100px',
    height: '45px',
  },
  nextBtn: {
    borderRadius: 0,
    marginTop: '25px',
    display: 'flex',
    width: '100px',
    height: '45px',
  },
  addBtn: {
    borderRadius: 0,
    height: '50px',
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

const defaultText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenean facilisis egestas gravida.Integer porttito consectetur";

const defaultOptions = {
  body: `{"blocks":[{"key":"5u8f1","text":"${defaultText}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
  mutexSuboptions: true
};

interface RouteParams {
  id?: string | undefined;
}

interface ContractFormComponentProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

interface ContractFormComponentState {
  confirm: boolean;
  confirmOnNavigate: boolean;
  currentSection?: Section;
  disableButtons: boolean;
  displayEditor: boolean;
  displayToolbarActions: boolean;
  editField?: EditFieldEnum;
  review: boolean;
  selectedProvider: ClientContact | null;
}

class ContractFormComponent extends React.Component<ContractFormComponentProps, ContractFormComponentState> {

  private api: ContractApi;

  private saveDraftInterval: number | null = null;

  constructor(props: ContractFormComponentProps) {
    super(props);

    this.api = new ContractApi();

    this.state = {
      confirm: false,
      confirmOnNavigate: true,
      disableButtons: false,
      displayEditor: false,
      displayToolbarActions: true,
      review: false,
      selectedProvider: null,
    }
  }

  onNavigate(e: React.MouseEvent | null, url: string) {
    if (e) {
      e.preventDefault();
    }

    this.props.navigate(url);
  }

  get id(): number | null {
    const { id } = this.props.params;

    if (!id) {
      return null;
    }

    return Number.parseInt(id);
  }

  async loadData(): Promise<SimpleResponse | null> {
    const id = this.id;

    if (id) {
      return this.props.getDraft(id).then((response: ObjectResponse<MasterContract>) => {
        if (response.success) {
          return response;
        } else {
          const messages = localizeErrorCodes(this.props.intl, response, false);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));

          this.props.navigate(StaticRoutes.ContractManager);
        }
        return null;
      });
    } else {
      this.props.createDraft();

      this.setState({
        confirm: false,
        confirmOnNavigate: true,
      });

      return Promise.resolve(null);
    }
  }

  createCommandFromModel(): MasterContractCommand | null {
    const { contract } = this.props;
    if (!contract) {
      return null;
    }
    const command: MasterContractCommand = {
      id: contract.id,
      providerKey: contract.provider?.id || null,
      title: contract.title,
      subtitle: contract.subtitle || '',
      sections: [...(contract.sections || [])],
    };
    return command;
  }

  componentDidMount() {
    this.loadData();

    this.saveDraftInterval = window.setInterval(() => {
      const command = this.createCommandFromModel();
      if (command) {
        (command.id === null ? this.api.createDraft(command) : this.api.updateDraft(command.id, command))
      }
    }, 30 * 1000);
  }

  componentWillUnmount() {
    if (this.saveDraftInterval != null) {
      clearInterval(this.saveDraftInterval);
    }
  }

  deleteSubtitle(): void {
    this.props.modifyContract({
      subtitle: '',
    });
  }

  addSection(section: Partial<Section>): void {
    const { contract } = this.props;
    if (!contract) {
      return;
    }
    const { sections = [] } = contract;

    const lastSection = sections.slice(-1)[0];

    if (lastSection) {
      section.index = this.getCurrentIndex(sections, sections.length, 0);
    } else {
      section.index = '1';
    }
    this.props.modifyContract({
      sections: [...contract.sections, {
        ...defaultSection,
        options: [{ ...defaultOptions }],
        ...section
      }],
    });

    this.scrollToSection('endAnchor');
  }

  addMiddleSection(prevSectionIndex: string, prevSectionIndent: number, variable: boolean): void {
    const { contract } = this.props;
    if (!contract) {
      return;
    }
    const { sections = [] } = contract;
    const prevArrayIndex = sections.findIndex((s) => s.index === prevSectionIndex);


    const newId = Math.max.apply(Math, sections.map((o) => o.id!)) + 1

    var firstPart = ""
    if (prevSectionIndex.includes('.')) {
      var sectionParts = prevSectionIndex.split('.')
      prevSectionIndex = sectionParts.pop()!
      firstPart = sectionParts.join('.') + '.'
    }
    var lastPart = parseInt(prevSectionIndex, 10) + 1
    var sectionIndex = firstPart + '' + lastPart;

    var section = { variable: variable, id: newId, index: sectionIndex, indent: prevSectionIndent }

    var newSection = {
      ...defaultSection, options: [{ ...defaultOptions }], ...section,
      subOptions: {}, ...section
    }

    sections.splice(prevArrayIndex + 1, 0, newSection);

    this.sortSections(sections)

    this.props.modifyContract({
      sections,
    });
  }


  removeSection(id: number): void {
    const { contract } = this.props;
    if (!contract) {
      return;
    }

    if (!this.state.displayToolbarActions) {
      return;
    }

    var sections = [...contract.sections]
    sections = sections.filter((section) => {
      return (section.id !== id);
    });

    this.props.modifyContract({
      sections: this.sortSections(sections),
    });
  }

  editSection(
    section: Partial<Section>,
    summary = "",
    option = 0,
    raw = "",
    descriptionOfChange = "",
    icon: EnumContractIcon | null,
    shortDescription = "",
    htmlContent = "",
    subOption = -1,
    mutexSuboptions = false
  ): void {
    const { contract } = this.props;
    if (!contract) {
      return;
    }

    let sections = [...contract.sections]
    const id = sections.findIndex((s) => s.id === section.id);
    if ('indent' in section) {
      // skip first section
      if (id === 0) {
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
      this.props.modifyContract({
        sections,
      });
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
      sections[id].options[option].mutexSuboptions = mutexSuboptions
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
    this.props.modifyContract({
      sections,
    });
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
    const { contract } = this.props;
    if (!contract) {
      return;
    }
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
    this.props.modifyContract({
      sections,
    });
  }

  moveSectionDown(section: Section): void {
    const { contract } = this.props;
    if (!contract) {
      return;
    }
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
    this.props.modifyContract({
      sections,
    });
  }

  openEdit(editField: EditFieldEnum, section?: Section): void {
    this.setState({
      displayEditor: true,
      displayToolbarActions: false,
      currentSection: section,
      editField: editField
    });
  }

  saveContent(id: number, contentState: ContentState, title: string, option: number, subOption: number,
    summary: string, descriptionOfChange: string, icon: EnumContractIcon | null, shortDescription: string,
    editField: EditFieldEnum, mutexSuboptions: boolean, closeEditor = true): void {
    let raw, htmlContent = '';
    raw = JSON.stringify(convertToRaw(contentState));
    if (contentState.getPlainText()) {
      htmlContent = stateToHTML(contentState);
    }
    if (editField === EditFieldEnum.Section) {
      this.editSection({ id: id, title: title }, summary, option, raw, descriptionOfChange, icon, shortDescription, htmlContent, -1, mutexSuboptions);
    } else if (editField === EditFieldEnum.SubOption) {
      this.editSection({ id: id, title: title }, summary, option, raw, descriptionOfChange, icon, shortDescription, htmlContent, subOption);
    } else if (editField === EditFieldEnum.Title) {
      this.props.modifyContract({
        title,
      });
    } else {
      this.props.modifyContract({
        subtitle: title,
      });
    }
    if (closeEditor) {
      this.setState({ displayEditor: false, displayToolbarActions: true });
    }
  }

  addOptions(sectionId: number, options: number): void {
    const { contract } = this.props;
    if (!contract) {
      return;
    }
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
        section.options.push({ 'body': `{"blocks":[{"key":"5u8f1","text":"Additional option","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}` });
      }
    }
    sections[id] = { ...sections[id], ...section };
    this.props.modifyContract({
      sections,
    });
  }

  addSubOptions(sectionId: number, option: number, subOptions: number): void {
    const { contract } = this.props;
    if (!contract) {
      return;
    }
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
          'body': `{"blocks":[{"key":"5u8f1","text":"Additional suboption","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
          'bodyHtml': '<p>Additional suboption</p>'
        });
    }
    else {
      length = 0
      subOptionsArray = new Array<SubOption>();
      subOptionsArray.push({
        'body': `{"blocks":[{"key":"5u8f1","text":"Additional suboption","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        'bodyHtml': '<p>Additional suboption</p>'
      });

      section.options[option].subOptions = subOptionsArray;
    }

    if (subOptions < length) {
      for (let i = length; i > subOptions; i--) {
        subOptionsArray.pop();
      }
    }
    sections[id] = { ...sections[id], ...section };
    this.props.modifyContract({
      sections,
    });
  }

  editTitle(title: string): void {
    this.props.modifyContract({
      title,
    });
  }

  discardChanges(): void {
    this.setState({
      confirmOnNavigate: false,
    }, () => this.props.navigate(StaticRoutes.ContractManager));
  }

  saveDraft(): void {
    const command = this.createCommandFromModel();
    if (!command) {
      return;
    }
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

  setEdit() {
    this.setState({ review: false })
  }


  scrollToSection(id: string) {
    var section_to_scroll_to = document.getElementById(id);
    section_to_scroll_to!.scrollIntoView();
  }

  renderReview() {
    const { contract } = this.props;
    if (!contract) {
      return null;
    }

    return (
      <ContractReviewForm
        contract={contract}
        saveContract={() => this.saveDraft()}
        setEdit={() => this.setEdit()}
      />
    );
  }

  renderEdit() {
    const { contract } = this.props;
    if (!contract) {
      return;
    }
    const { classes } = this.props;
    const sections = contract?.sections || [];

    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    // sort by index
    sections.sort((a: Section, b: Section) => collator.compare(a.index, b.index))

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
          onClick={() => this.scrollToSection(section.id!.toString())}
          key={section.id}
          className={classes.section}
          style={{ paddingLeft: section.indent }}
        >
          {sectionTitle}
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
          <Button className={classes.addBtn} style={{ marginRight: 20 }}
            variant="contained"
            onClick={() =>
              this.addSection({ variable: false, id: newId })
            }
          >
            Add Section
          </Button>
          <Button className={classes.addBtn}
            variant="contained"
            onClick={() =>
              this.addSection({ variable: true, id: newId })
            }
          >
            Add Variable Section
          </Button>
        </Grid>
      );
    }

    return (
      <Paper className={classes.paper}>
        <Grid container className={classes.contractContainer}>
          <Grid container item xs={2} className={classes.outlineOuter}>
            <Grid item className={clsx(classes.contentPaper, classes.outlineInner)}>
              <div className={classes.columnTitle}>
                {'Document Outline'}
              </div>
              <div className={classes.outlineContent}>
                <PerfectScrollbar>
                  <div className={classes.documentTitle}>
                    {contract.title}
                  </div>
                  <div className={classes.documentSubtitle}>
                    {contract.subtitle}
                  </div>
                  {outline}
                </PerfectScrollbar>
              </div>
            </Grid>
          </Grid>
          <Grid container item xs={5} className={classes.sectionListOuter}>
            <Grid item className={clsx(classes.contentPaper, classes.sectionListInner)}>
              <div className={classes.columnTitle}>
                {'Contract structure'}
                <div className={classes.columnSubtitle}>
                  {`Here you can preview your master contract as you build it and manage it's structure.`}
                </div>
              </div>
              <PageComponent
                className={classes.sectionListContent}
                documentTitle={contract.title}
                documentSubtitle={contract.subtitle}
                sectionList={sections}
                deleteSubtitle={this.deleteSubtitle.bind(this)}
                editTitle={this.editTitle.bind(this)}
                addMiddleSection={this.addMiddleSection.bind(this)}
                removeSection={this.removeSection.bind(this)}
                editSection={this.editSection.bind(this)}
                openEdit={this.openEdit.bind(this)}
                moveSectionUp={this.moveSectionUp.bind(this)}
                moveSectionDown={this.moveSectionDown.bind(this)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={4} className={classes.toolbarOuter}>
            <Grid item className={clsx(classes.contentPaper, classes.toolbarInner)}>
              <div className={classes.columnTitle}>
                {'Toolbar'}
                <div className={classes.columnSubtitle}>
                  {'For selected elements, all available actions appear here'}
                </div>
              </div>

              <div className={classes.columnTitle}>
                {'Document elements'}
              </div>
              {toolbarActions}
              <Grid container item xs={12}>
                {editor}
              </Grid>
            </Grid>
          </Grid>
          <div className={classes.buttons}>
            <Button
              className={classes.saveBtn}
              variant="contained"
              color="primary"
              disabled={this.state.displayEditor}
              onClick={() =>
                this.saveDraft()
              }
            >
              Save
            </Button>
            <Button className={classes.nextBtn}
              variant="contained"
              color="primary"
              disabled={this.state.displayEditor}
              onClick={(e) => this.setState({ review: true })}
            >
              Next
            </Button>
          </div>
        </Grid>
      </Paper>
    );
  }

  hideProviderDialog(): void {
    this.props.toggleProviderDialog();
  }

  providerDialogHandler(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Accept:
        this.props.setProvider(this.state.selectedProvider);
        break;
      case EnumDialogAction.Reset:
        this.props.setProvider(null);
        break;
    }

    this.hideProviderDialog();
  }

  renderProviderDialog() {
    const { contract } = this.props;
    if (!contract) {
      return;
    }
    const _t = this.props.intl.formatMessage;
    const { classes, contractProviderDialog, providers, findProviders } = this.props;

    const actions: DialogAction[] = [
      {
        key: EnumDialogAction.Accept,
        label: _t({ id: 'view.shared.action.accept' }),
        iconClass: () => (<Icon path={mdiCheckOutline} size="1.5rem" />),
        color: 'primary',
      }, {
        key: EnumDialogAction.Cancel,
        label: _t({ id: 'view.shared.action.cancel' }),
        iconClass: () => (<Icon path={mdiCloseOutline} size="1.5rem" />),
      }
    ];
    if (contract.provider) {
      actions.push({
        key: EnumDialogAction.Reset,
        label: _t({ id: 'view.shared.action.reset' }),
        iconClass: () => (<Icon path={mdiEraser} size="1.5rem" />),
        color: 'secondary',
      });
    }

    return (
      <Dialog
        actions={actions}
        handleClose={() => this.hideProviderDialog()}
        handleAction={(action) => this.providerDialogHandler(action)}
        header={
          <div style={{ display: 'flex' }}>
            <div style={{ paddingTop: 4, paddingRight: 4 }}>
              <Icon path={mdiDomain} size="1.5rem" />
            </div>
            <FormattedMessage id="contract.provider-dialog.title" />
          </div>
        }
        open={contractProviderDialog}
      >
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <FormattedMessage id="contract.provider-dialog.message" values={{ name: (<b>{contract.title}</b>) }} />
          </Grid>

          <Grid item sm={12}>
            <AsyncCustomerAutoComplete
              error={false}
              label={'Provider'}
              loadingText={'Searching ...'}
              noOptionsText={'No data found'}
              options={providers.result}
              promptText={'Type 3 characters ...'}
              getOptionKey={(option: ClientContact) => {
                return option.id;
              }}
              getOptionLabel={(option: ClientContact) => {
                return option.email;
              }}
              loadOptions={(value: string) => findProviders(value)}
              onChange={(value: ClientContact | null) => {
                this.setState({
                  selectedProvider: value,
                });
              }}
              value={providers.query || null}
              renderOption={(provider) => {
                const avatar = provider.logoImage && provider.logoImageMimeType
                  ? `data:${provider.logoImageMimeType};base64,${provider.logoImage}`
                  : '';

                return (
                  <Grid container>
                    <Grid item xs={2}>
                      <Avatar alt={provider.name} src={avatar} variant="circular" className={classes.avatar} />
                    </Grid>
                    <Grid container item xs={10} direction={'column'}>
                      <Typography className={classes.inline}>{provider.name}</Typography>
                      <Typography className={classes.inline} variant="caption">{provider.email}</Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  render() {
    const { review } = this.state;
    const { contractProviderDialog } = this.props;

    return (
      <>
        {review ? this.renderReview() : this.renderEdit()}

        {contractProviderDialog &&
          this.renderProviderDialog()
        }
      </>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  loading: state.contract.loading,
  lastUpdated: state.contract.lastUpdated,
  contract: state.contract.contractViewModel,
  contractProviderDialog: state.contract.contractProviderDialog,
  providers: state.contract.providers,
});

const mapDispatch = {
  createDraft,
  findProviders: (email: string) => findProviders(email),
  getDraft: (id: number) => getDraft(id),
  modifyContract,
  setProvider,
  toggleProviderDialog,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ContractFormComponent);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params: RouteParams = useParams();

  return (
    <ConnectedComponent navigate={navigate} location={location} params={params} />
  );
}

export default RoutedComponent;
