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
    fontSize: '1.4rem',
    fontWeight: 'bold',
    //textAlign: 'center'
  },
  columnSubtitle: {
    color: '#6C6C6C',
    fontSize: '0.8rem',
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
  },
  section: {
    color: '#6C6C6C',
    fontWeight: 'normal',
    fontSize: '1rem',
    textAlign: 'left',
  },
  structure: {
    background: '#efefef',
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
    fontSize: '16px',
    marginTop: '115px',
    marginLeft: '50px',
    width: '80px',
    height: '50px'
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
    console.log('in save');
    (contract.id === null || typeof (contract.id) === 'undefined' ? this.api.create(contract) : this.api.update(contract.id!, contract))
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
      //console.log('section:',section);
      let type = '';
      if (section.optional) {
        type = 'Opt. '
      }
      else if (section.dynamic) {
        type = 'Dyn. '
      }
      return (<div key={section.id} className={classes.section}>
        <FormattedMessage id={section.id! + 1} defaultMessage={type + 'Section ' + section.index + ' - ' + section.title} />
      </div>)
    });
    const structure = contract.sections.map(section => {
      //console.log('section:',section);
      let body;
      if (section.dynamic) {
        body = section.styledOptions.map((option, index) =>
          <div key={index}> <span className={classes.option} >Option {String.fromCharCode(65 + index)}</span>
            <img className={classes.logoImage} src={"/icons/" + section.icons![index]} alt="" />
            <p>{section.summary![index]}</p>
            <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(option)))} readOnly={true} onChange={() => { }} />
          </div>);
      }
      else {
        let option = EditorState.createWithContent(convertFromRaw(JSON.parse(section.styledOptions[0])));
        body = <div>
          <img className={classes.logoImage} src={"/icons/" + section.icons![0]} alt="" />
          <p>{section.summary![0]}</p>
          <Editor editorState={option} readOnly={true} onChange={() => { }} /> </div>;
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
          <Grid className={classes.structure}>
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
        Save
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