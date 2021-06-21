import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import Button from '@material-ui/core/Button';

// Styles
import { createStyles, Grid, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// State, routing and localization
import { RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

// Store
import { RootState } from 'store';

// Model
import { DynamicRoutes, StaticRoutes } from 'model/routes';
import ContractApi from 'service/contract';
import message from 'service/message';
import { Contract } from 'model/contract';
import { localizeErrorCodes } from 'utils/error';

import Icon from '@mdi/react';
import { mdiTrashCan, mdiUndoVariant, mdiCommentAlertOutline } from '@mdi/js';
import { AxiosError } from 'axios';
import { SimpleResponse } from 'model/response';

import { setSelectedContract } from 'store/contract/actions';

import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';


const styles = (theme: Theme) => createStyles({
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: 0,
    margin: theme.spacing(2),
    minHeight: '70vh',
    width: '100%',
  },
  toolbox: {
    padding: theme.spacing(2),
  },
  li: {
    display: 'flex'
  },
  createBtn: {
    display: 'inline-block',
    marginLeft: 60,
    fontSize: '0.9rem',
  },
  editBtn: {
    marginLeft: '10px',
  },
  btnControl: {
    float: 'right',
    marginRight: '20px',
    marginBottom: '20px'
  },
  heading: {
    fontSize: '2.1rem',
    display: 'inline-block',
  },
  contractTitle: {
    width: '95%',
    display: 'inline-block',
    fontSize: '1.2rem',
    paddingLeft: '25px'
  },
  contract: {
    background: '#F4F4F4',
    borderRadius: '5px',
    marginBottom: '30px'
  },
  contractInner: {
    overflow: 'auto'
  },
  state: {
    display: 'inline-block',
    float: 'right',
    marginRight: '20px',
    marginTop: '20px',
    fontSize: '1.2rem',
    fontWeight: 500,
    color: '#3f51b5',
  },
  date: {
    display: 'inline-block',
    marginTop: '20px',
    marginLeft: '10px',
  }
});

interface ContractListComponentProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps {
  intl: IntlShape;
}

interface ContractListComponentState {
  confirm: boolean,
  confirmOnNavigate: boolean,
  contracts: Contract[] | null;
  contractForDelete?: number;
}


class ContractListComponent extends React.Component<ContractListComponentProps, ContractListComponentState> {

  private api: ContractApi;

  constructor(props: ContractListComponentProps) {
    super(props);
    //var contracts = null
    this.api = new ContractApi();

    //console.log('contracts', contracts);
    this.state = { contracts: [], confirm: false, confirmOnNavigate: true };


  }

  componentDidMount() {
    this.api.findContracts()
      .then((response) => {
        if (response.data.success) {
          //this.discardChanges();
          console.log('Response', response.data);
          const contracts = response.data.result!;
          console.log('contracts', contracts);
          this.setState({ contracts: contracts, confirm: false, confirmOnNavigate: true });
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, true);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      })
      .finally(() => {
      });
  }

  discardChanges(): void {
    this.setState({
      confirmOnNavigate: false,
    }, () => this.props.history.push(StaticRoutes.ContractManager));
  }

  updateState(contractId: number, state: string) {
    var contracts = this.state.contracts!;
    this.api.updateState(contractId, state).then((response) => {
      if (response.data.success) {
        const id = contracts.findIndex((c) => c.id === contractId);
        contracts[id].state = state;
        this.setState({ contracts: contracts, confirm: false, confirmOnNavigate: true });
      } else {
        const messages = localizeErrorCodes(this.props.intl, response.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      }
    })
    .catch((err: AxiosError<SimpleResponse>) => {
      const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
      message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
    })
    .finally(() => {
    });
  }

  deleteContract() {
    var contracts = this.state.contracts!;
    const contractId = this.state.contractForDelete!;
    this.api.remove(contractId)
      .then((response) => {
        if (response.data.success) {
          //this.discardChanges();
          console.log('Response', response.data);
          contracts = contracts.filter((contract) => {
            return (contract.id !== contractId);
          });
          this.setState({ contracts: contracts, confirm: false, confirmOnNavigate: true });
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, true);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      })
      .finally(() => {
      });
  }

  onNavigate(e: React.MouseEvent | null, url: string, contractId: number | null) {
    if (e) {
      e.preventDefault();
    }

    if (contractId) {
      console.log('contract: ', contractId)
      this.props.setSelectedContract(contractId);
    }
    else {
      this.props.setSelectedContract(null);
    }
    //state = { id: id }
    this.props.history.push({
      pathname: url,
    })
    //this.props.history.push(url);
  }

  showConfirmDialog(contractId: number): void {
    this.setState({
      confirm: true,
      contractForDelete: contractId
    });
  }

  hideConfirmDialog(): void {
    this.setState({
      confirm: false,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Yes:
        this.deleteContract();
        break;
      default:
        this.hideConfirmDialog();
        break;
    }
  }
  renderConfirm() {
    const _t = this.props.intl.formatMessage;

    const { confirm } = this.state;

    if (!confirm) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Yes,
            label: _t({ id: 'view.shared.action.yes' }),
            iconClass: () => (<Icon path={mdiTrashCan} size="1.5rem" />),
            color: 'primary',
          }, {
            key: EnumDialogAction.No,
            label: _t({ id: 'view.shared.action.no' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideConfirmDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirm}
      >
        <FormattedMessage id="view.shared.message.delete-contract" defaultMessage='Are you sure you want to delete this contract?' />
      </Dialog>
    );
  }
  render() {
    const { classes } = this.props;
    const contracts = this.state.contracts;
    let list;
    if (contracts) {
      list = contracts.map((contract, index) => {
        let publish;
        if (contract.state === 'DRAFT') {
          publish =
            <Button
              type="submit"
              variant="contained"
              className={classes.editBtn}
              onClick={() => this.updateState(contract.id!, 'PUBLISHED')}
            >
              <FormattedMessage id="view.shared.action.delete" defaultMessage="Publish" />
            </Button>;
        }
        else {
          publish =
            <Button
              type="submit"
              variant="contained"
              className={classes.editBtn}
              onClick={() => this.updateState(contract.id!, 'DRAFT')}
            >
              <FormattedMessage id="view.shared.action.delete" defaultMessage="Unpublish" />
            </Button>;
        }
        return (
          <Grid className={classes.contract}>
            <div className={classes.contractInner} ><h3 className={classes.contractTitle}>{contract.title}</h3>
              <div className={classes.state}>
                <FormattedMessage id="view.shared.state" defaultMessage={capitalize(contract.state)} />
              </div>
              <div className={classes.date}>
                <FormattedMessage id="view.shared.modified_at" defaultMessage={"Last modified: " + contract.modifiedAt?.format('DD-MM-YYYY')} />
              </div>
              <div className={classes.btnControl}>
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.editBtn}
                  onClick={(e) => this.onNavigate(e, DynamicRoutes.ContractCreate, contract.id!)}
                >
                  <FormattedMessage id="view.shared.action.edit" defaultMessage="Edit" />
                </Button>

                {publish}

                <Button
                  type="submit"
                  variant="contained"
                  className={classes.editBtn}
                  //onClick={(e) => this.deleteContract(contract.id!)}
                  onClick={() => this.showConfirmDialog(contract.id!)}
                >
                  <FormattedMessage id="view.shared.action.delete" defaultMessage="Delete" />
                </Button>
              </div>
            </div>
          </Grid>)
      })

    }
    return (
      <div >
        <h2 className={classes.heading}> Master contracts </h2>
        <Button className={classes.createBtn}
          type="submit"
          variant="contained" onClick={(e) => this.onNavigate(e, DynamicRoutes.ContractCreate, null)}>
          New Master Contract</Button>
        {list}
        { this.renderConfirm()}
      </div>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  loading: state.contract.loading,
  lastUpdated: state.contract.lastUpdated,
  contractId: state.contract.contractId,
});

const mapDispatch = {
  setSelectedContract,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>


// Apply styles
const styledComponent = withStyles(styles)(ContractListComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);


// Export localized component
export default connector(localizedComponent);

/*function customizer(value:any) {
  if (moment.isMoment(value)) {
    return moment(value);
  }
}*/

export function capitalize(str: string): string {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}