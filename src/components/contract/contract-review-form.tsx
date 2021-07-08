import React from 'react';

// Localization
import { FormattedMessage, IntlShape } from 'react-intl';

// Styles
import { Button, createStyles, Grid, Paper, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import { RootState } from 'store';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Contract } from 'model/contract';
import { StaticRoutes } from 'model/routes';
import ContractApi from 'service/contract';

import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';
import { FieldMapperFunc, localizeErrorCodes } from 'utils/error';
import { AxiosError } from 'axios';
import { SimpleResponse } from 'model/response';
import message from 'service/message';
import { convertFromRaw, EditorState, Editor } from 'draft-js';


const fieldMapper: FieldMapperFunc = (field: string): string | null => {
  switch (field) {
    case 'id':
      return 'contract.review.field.id';
  }
  return null;
};
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
  suboption: {
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
  },
});

interface RouteParams {
  id?: string | undefined;
}


interface ContractReviewFormComponentProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape;
}

interface ContractReviewFormComponentState {
  contract: Contract;
  confirm: boolean,
  confirmOnNavigate: boolean,
}

class ContractReviewFormComponent extends React.Component<ContractReviewFormComponentProps, ContractReviewFormComponentState> {

  private api: ContractApi;

  constructor(props: ContractReviewFormComponentProps) {
    super(props);
    this.api = new ContractApi();
    console.log(this.props);
    //var location = this.props.history.location as any
    //const contract = this.props.contract
    this.state = { contract: this.props.contract!, confirm: false, confirmOnNavigate: true, };

    // console.log(location.state.contract);
  }
  discardChanges(): void {
    this.setState({
      confirmOnNavigate: false,
    }, () => this.props.history.push(StaticRoutes.ContractManager));
  }

  saveContract(): void {
    const contract = this.state.contract;
    
    (contract.id === null || typeof (contract.id) === 'undefined' ? this.api.create(contract) :
       (contract.state ==='DRAFT' ? this.api.updateDraft(contract.id!, contract): this.api.updateContract(contract.id!, contract)))
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
  }

  render() {
    const contract = this.state.contract;
    const { classes } = this.props;
    const outline = contract.sections.map(section => {
      let type = '';
      if (section.optional) {
        type = '(Opt.)'
      }
      else if (section.dynamic) {
        type = '(Dyn.)'
      }
      if (section.title)
        var sectionTitle = 'Section ' + section.index + ' - ' + section.title + ' ' + type
      else
        sectionTitle = 'Section ' + section.index + ' ' + type
      return (<div key={section.id} className={classes.section} style={{ paddingLeft: section.indent }}>
        <FormattedMessage id={section.id! + 1} defaultMessage={sectionTitle} />
      </div>)
    });
    const structure = contract.sections.map(section => {
      let body, renderedOutput: any, icon: any;

      if (section.dynamic) {
        body = section.styledOptions.map((option, index) => {
          var suboptionsArray = section.suboptions[index];
          let suboptionBlock = [];
          if (suboptionsArray) {
            var length = suboptionsArray.length
          }
          else length = 0;
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              var storedSuboptionState = convertFromRaw(JSON.parse(suboptionsArray.find(o => o.id === i)!.body));
              var suboptionBody =
                <div className={classes.option} key={index}> <span>Suboption {String.fromCharCode(65 + i)}</span>
                  <Editor editorState={EditorState.createWithContent(storedSuboptionState)} readOnly={true} onChange={() => { }} />
                </div>;
              suboptionBlock.push(suboptionBody);
            }
            renderedOutput = suboptionBlock.map((item, index) => {
              return (
                <div className={classes.suboption}>
                  {item}
                </div>
              )
            });

          };
          if (section.icons![index])
            icon = <img className={classes.logoImage} src={"/icons/" + section.icons![index]} alt="" />

          return (
            <div key={index}> <span className={classes.option} >Option {String.fromCharCode(65 + index)}</span>

              {icon}
              <p>{section.summary![index]}</p>
              <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(option)))} readOnly={true} onChange={() => { }} />
              {renderedOutput}
            </div>
          )
        });

      }
      else {
        //for empty section body dont use Editor
        if (section.options[0] === "")
          body = '';
        else {
          let option = EditorState.createWithContent(convertFromRaw(JSON.parse(section.styledOptions[0])));
          if (section.icons![0])
            icon = <img className={classes.logoImage} src={"/icons/" + section.icons![0]} alt="" />
          body = <div>
            {icon}
            <p>{section.summary![0]}</p>
            <Editor editorState={option} readOnly={true} onChange={() => { }} /> </div>;
        }
      }
      return (<div>
        <div key={section.id} className={classes.section && classes.columnTitle}>
          <FormattedMessage id={section.id! + 1} defaultMessage={'Section ' + section.index + ' - ' + section.title} />
        </div>
        <div>{body}</div>
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
            <FormattedMessage id="document.outline.title" defaultMessage={this.state.contract!.title} />
          </div><div className={classes.documentSubtitle} >
            <FormattedMessage id="document.outline.subtitle" defaultMessage="{documentSubtitle}"
              values={{
                documentSubtitle: this.state.contract!.subtitle,
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
              <FormattedMessage id="document.outline.title" defaultMessage={this.state.contract!.title} />
            </div>
            <div className={classes.contractSubtitle} >
              <FormattedMessage id="document.outline.subtitle" defaultMessage="{documentSubtitle}"
                values={{
                  documentSubtitle: this.state.contract!.subtitle,
                }} />
            </div>
            {structure}
          </Grid>



        </Paper>
      </Grid>
      <Button
        className={classes.save}
        variant="contained"
        onClick={() =>
          this.saveContract()
        }
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
  contract: state.contract.contract,
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
//const localizedComponent = injectIntl(styledComponent);

// Inject routing 
const routedComponent = withRouter(styledComponent);

// Inject state
export default connector(routedComponent);