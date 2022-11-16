import React from 'react';

import { convertFromRaw, EditorState, Editor } from 'draft-js';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Styles
import { Button, createStyles, Grid, Paper, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Store
import { RootState } from 'store';
import { connect, ConnectedProps } from 'react-redux';

// Model
import { MasterContractViewModel } from 'model/contract';

// Services
import ContractApi from 'service/contract';


const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
  },
  paper: {
    paddingLeft: '30px',
    paddingRight: '30px',
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: 0,
    minHeight: '70vh',
    width: '100%',
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
    marginTop: '1.5vh',
    marginBottom: '1.5vh',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    //textAlign: 'center'
  },
  columnSubtitle: {
    color: '#6C6C6C',
    fontSize: '1rem',
    fontWeight: 'normal',
  },
  contractSubtitle: {
    color: '#6C6C6C',
    fontSize: '1rem',
    fontWeight: 'normal',
  },
  outline: {
    paddingLeft: '30px',
    width: '45vh',
    overflowY: 'auto',
    height: '80vh'
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
  subOption: {
    marginTop: '8px',
    paddingLeft: '12px',
    fontWeight: 400,
  },
  structure: {
    background: '#efefefc2',
    padding: '40px',
    paddingTop: '10px',
    height: '70vh',
    overflow: 'auto',
  },
  option: {
    display: 'block',
    fontWeight: 500,
    marginRight: '5px',
    marginBottom: '20px',
  },
  optionBlock: {
    marginBottom: '10px',
  },
  save: {
    borderRadius: 0,
    display: 'flex',
    width: '170px',
    height: '45px',
    marginTop: '115px',
  },
  previous: {
    borderRadius: 0,
    display: 'flex',
    width: '170px',
    height: '45px',
    marginTop: '50px',
  },
  controlButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '225px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  render: {

    backgroundColor: '#000',
    color: '#fff',
    position: 'absolute',
    right: '14vh',
    bottom: '16vh',
    width: '170px',
    height: '45px',
    marginTop: '115px',
    marginLeft: '50px',
    display: 'inline-block',
    borderRadius: '25px'
  },
  logoImage: {
    width: '30px',
    verticalAlign: 'middle',
    marginBottom: '10px',
  },
  shortDescription: {
    display: 'inline-block',
    marginLeft: '30px',
  },
});

interface ContractReviewFormComponentProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  contract: MasterContractViewModel;
  saveContract: () => void;
  setEdit: () => void;
}

interface ContractReviewFormComponentState {
  confirm: boolean,
  confirmOnNavigate: boolean,
}


class ContractReviewFormComponent extends React.Component<ContractReviewFormComponentProps, ContractReviewFormComponentState> {

  private api: ContractApi;

  constructor(props: ContractReviewFormComponentProps) {
    super(props);

    this.api = new ContractApi();
  }

  scrollToSection(id: string) {
    var section_to_scroll_to = document.getElementById(id);
    section_to_scroll_to!.scrollIntoView();
  }

  render() {
    const { classes, contract, config } = this.props;

    if (!contract) {
      return null;
    }

    const outline = contract.sections.map(section => {
      let type = '', sectionTitle = '';
      if (section.optional) {
        type = '(Opt.)'
      }
      else if (section.dynamic) {
        type = '(Dyn.)';
      }
      if (section.title) {
        sectionTitle = 'Section ' + section.index + ' - ' + section.title + ' ' + type
      } else {
        sectionTitle = 'Section ' + section.index + ' ' + type
      }

      return (<div key={section.id} className={classes.section} style={{ paddingLeft: section.indent }}
        onClick={() => this.scrollToSection(section.id!.toString())}>
        <FormattedMessage id={`${section.id! + 1}`} defaultMessage={sectionTitle} />
      </div>)
    });

    const structure = contract.sections.map((section) => {
      let body, renderedSuboptions: any, icon, shortDescription: any, length = 0, sectionTitle = '';

      if (section.dynamic) {
        body = section.options.map((option, index) => {
          icon = <div />
          shortDescription = <div />
          var subOptionsArray = section.options[index].subOptions!;
          let subOptionBlock = [];
          if (subOptionsArray) {
            length = subOptionsArray.length
          }
          else length = 0;
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              var storedSubOptionState = convertFromRaw(JSON.parse(subOptionsArray[i].body));
              var subOptionBody =
                <div className={classes.subOption} key={index}> <span>Suboption {String.fromCharCode(65 + i)}</span>
                  <Editor editorState={EditorState.createWithContent(storedSubOptionState)} readOnly={true} onChange={() => { }} />
                </div>;
              subOptionBlock.push(subOptionBody);
            }
            renderedSuboptions = subOptionBlock.map((item, index) => {
              return (
                <div className={classes.subOption}>
                  {item}
                </div>
              )
            });

          };
          if (section.options[index].icon) {
            const enumIcon = config.contractIcons!.find(c => c.icon === section.options[index].icon);
            icon = <img alt="" className={classes.logoImage} src={`data:image/svg+xml;base64,${enumIcon?.image}`} />
          }
          if (section.options[index].shortDescription) {
            shortDescription = <div className={classes.shortDescription} >{section.options[index].shortDescription}</div>
          }

          return (
            <div className={classes.optionBlock} key={index}> <span className={classes.option} >Option {String.fromCharCode(65 + index)}</span>
              {icon}
              {shortDescription}
              <p>{section.options[index].summary}</p>
              <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(option.body)))} readOnly={true} onChange={() => { }} />
              {renderedSuboptions}
            </div>
          )
        });

      }
      else {
        // For empty section body don't use Editor
        if (section.options[0].bodyHtml === '')
          body = '';
        else {
          let option = EditorState.createWithContent(convertFromRaw(JSON.parse(section.options[0].body)));
          var subOptionsArray = section.options[0].subOptions!;
          let subOptionBlock = [];
          if (subOptionsArray) {
            length = subOptionsArray.length
          }
          else length = 0;
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              var storedSubOptionState = convertFromRaw(JSON.parse(subOptionsArray[i].body));
              var subOptionBody =
                <div> <span>SubOption {String.fromCharCode(65 + i)}</span>
                  <Editor editorState={EditorState.createWithContent(storedSubOptionState)} readOnly={true} onChange={() => { }} />
                </div>;
              subOptionBlock.push(subOptionBody);
            }
            renderedSuboptions = subOptionBlock.map((item, index) => {
              return (
                <div className={classes.subOption}>
                  {item}
                </div>
              )
            });
          }
          if (section.options[0].icon) {
            const enumIcon = config.contractIcons!.find(c => c.icon === section.options[0].icon);
            icon = <img alt="" className={classes.logoImage} src={`data:image/svg+xml;base64,${enumIcon?.image}`} />
          }
          if (section.options[0].shortDescription) {
            shortDescription = <div className={classes.shortDescription} >{section.options[0].shortDescription}</div>
          }
          body = <div className={classes.optionBlock}>
            {icon}
            {shortDescription}
            <p>{section.options[0].summary}</p>
            <Editor editorState={option} readOnly={true} onChange={() => { }} />
            {renderedSuboptions} </div>;
        }
      }

      if (section.title) {
        sectionTitle = 'Section ' + section.index + ' - ' + section.title
      } else {
        sectionTitle = 'Section ' + section.index
      }
      return (<div>
        <div id={section.id!.toString()} key={section.id} className={classes.section && classes.columnTitle}>
          <FormattedMessage id={`${section.id! + 1}`} defaultMessage={sectionTitle} />
        </div>
        <div>
          {body}
        </div>
      </div>
      )
    });
    return (
      <div className={classes.container}>
        <Grid container>
          <Grid container item xs={3}>
            <Paper className={classes.paper && classes.outline} >
              <div className={classes.columnTitle} >
                <FormattedMessage id="document.outline" defaultMessage={'Document Outline'} />
              </div>
              <div className={classes.documentTitle} >
                <FormattedMessage id="document.outline.title" defaultMessage={contract.title} />
              </div><div className={classes.documentSubtitle} >
                <FormattedMessage id="document.outline.subtitle" defaultMessage="{documentSubtitle}"
                  values={{
                    documentSubtitle: contract.subtitle,
                  }} />
              </div>
              {outline}
            </Paper>
          </Grid>
          <Grid container item xs={9}>
            <Paper className={classes.paper}>
              <div className={classes.columnTitle} >
                <FormattedMessage id="document.review" defaultMessage={'Review'} />
                <div className={classes.columnSubtitle} >
                  {'Here you can review the master contract you created.'}
                </div>
              </div>
              <Grid id="renderedContract" className={classes.structure}>
                <div className={classes.columnTitle} >
                  <FormattedMessage id="document.outline.title" defaultMessage={contract!.title} />
                </div>
                <div className={classes.contractSubtitle} >
                  <FormattedMessage id="document.outline.subtitle" defaultMessage="{documentSubtitle}"
                    values={{
                      documentSubtitle: contract!.subtitle,
                    }} />
                </div>
                {structure}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <div className={classes.controlButtons}>
          <Button
            className={classes.save}
            variant="contained"
            color="primary"
            onClick={() => this.props.saveContract()}
          >
            Confirm and Save
          </Button>
          <Button className={classes.previous}
            variant="contained"
            color="primary"
            onClick={(e) => this.props.setEdit()}
          >
            Previous
          </Button>
        </div>
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  loading: state.contract.loading,
  lastUpdated: state.contract.lastUpdated,
});

const mapDispatch = {
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ContractReviewFormComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);