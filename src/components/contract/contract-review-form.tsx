import React from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';
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
import { StaticRoutes } from 'model/routes';
import { MasterContractCommand } from 'model/contract';

// Services
import ContractApi from 'service/contract';

const styles = (theme: Theme) => createStyles({
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
    marginTop: '3vh',
    marginBottom: '2vh',
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
    fontWeight: 500,
    marginRight: '5px',
    marginBottom: '10px',
  },
  optionBlock: {
    marginBottom: '10px',
  },
  save: {
    backgroundColor: '#190AFF',
    color: '#fff',
    position: 'absolute',
    right: '14vh',
    bottom: '22vh',
    width: '170px',
    height: '45px',
    marginTop: '115px',
    marginLeft: '50px',
    display: 'inline-block',
    borderRadius: '25px'
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
});

interface ContractReviewFormComponentProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  contract: MasterContractCommand;
  saveContract: () => void;
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

  render() {
    const { classes, contract } = this.props;

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

      return (<div key={section.id} className={classes.section} style={{ paddingLeft: section.indent }}>
        <FormattedMessage id={section.id! + 1} defaultMessage={sectionTitle} />
      </div>)
    });

    const structure = contract.sections.map((section) => {
      let body, renderedSuboptions: any, icon: any, length = 0;

      if (section.dynamic) {
        body = section.styledOptions.map((option, index) => {
          var subOptionsArray = section.subOptions[index];
          let subOptionBlock = [];
          if (subOptionsArray) {
            length = subOptionsArray.length
          }
          else length = 0;
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              var storedSubOptionState = convertFromRaw(JSON.parse(subOptionsArray.find(o => o.id === i)!.body));
              var subOptionBody =
                <div className={classes.option} key={index}> <span>SubOption {String.fromCharCode(65 + i)}</span>
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
          if (section.icons![index])
            icon = <img className={classes.logoImage} src={"/icons/" + section.icons![index]} alt="" />

          return (
            <div className={classes.optionBlock} key={index}> <span className={classes.option} >Option {String.fromCharCode(65 + index)}</span>

              <p>{section.summary![index]}</p>
              <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(option)))} readOnly={true} onChange={() => { }} />
              {renderedSuboptions}
            </div>
          )
        });

      }
      else {
        // For empty section body don't use Editor
        if (section.options[0] === "")
          body = '';
        else {
          let option = EditorState.createWithContent(convertFromRaw(JSON.parse(section.styledOptions[0])));
          var subOptionsArray = section.subOptions[0];
          let subOptionBlock = [];
          if (subOptionsArray) {
            length = subOptionsArray.length
          }
          else length = 0;
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              var storedSubOptionState = convertFromRaw(JSON.parse(subOptionsArray.find(o => o.id === i)!.body));
              var subOptionBody =
                <div className={classes.option}> <span>SubOption {String.fromCharCode(65 + i)}</span>
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
          if (section.icons![0])
            icon = <img className={classes.logoImage} src={"/icons/" + section.icons![0]} alt="" />
          body = <div   className={classes.optionBlock}>
            <p>{section.summary![0]}</p>
            <Editor editorState={option} readOnly={true} onChange={() => { }} />
            {renderedSuboptions} </div>;
        }
      }
      return (<div>
        <div key={section.id} className={classes.section && classes.columnTitle}>
          <FormattedMessage id={section.id! + 1} defaultMessage={'Section ' + section.index + ' - ' + section.title} />
        </div>
        <div>
              {icon}
              {body}
        </div>
      </div>
      )
    });
    return (<Grid container >
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
      <Grid container item xs={6}>
        <Paper className={classes.paper}>
          <div className={classes.columnTitle} >
            <FormattedMessage id="document.review" defaultMessage={'Review'} />
            <div className={classes.columnSubtitle} >
              <FormattedMessage id="document.toolbar.subtitle" defaultMessage={`Here you can review the master contract
              you created.`} />
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
      <Button
        className={classes.save}
        variant="contained"
        onClick={() => this.props.saveContract()}
      >
        Confirm and Save
      </Button>
    </Grid>);
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