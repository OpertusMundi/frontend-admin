import React from 'react';

import { AxiosError } from 'axios';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import Button from '@material-ui/core/Button';

// Icons
import Icon from '@mdi/react';
import { mdiTrashCan, mdiUndoVariant, mdiCommentAlertOutline } from '@mdi/js';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

// Styles
import { createStyles, Grid, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// State, routing and localization
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

// Store
import { RootState } from 'store';
import { find } from 'store/contract/thunks';

// Services
import ContractApi from 'service/contract';
import message from 'service/message';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting, SimpleResponse } from 'model/response';
import { EnumContractStatus, EnumMasterContractSortField, MasterContractHistory } from 'model/contract';

// Utilities
import { localizeErrorCodes } from 'utils/error';

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

interface ContractListComponentProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

interface ContractListComponentState {
  confirm: boolean,
  confirmOnNavigate: boolean,
  record: MasterContractHistory | null
}

class ContractListComponent extends React.Component<ContractListComponentProps, ContractListComponentState> {

  private api: ContractApi;

  constructor(props: ContractListComponentProps) {
    super(props);

    this.api = new ContractApi();

    this.state = {
      confirm: false,
      confirmOnNavigate: true,
      record: null,
    };
  }

  componentDidMount() {
    this.find();
  }

  find(): void {
    this.props.find()
      .then((response) => {
        if (response && !response.success) {
          const messages = localizeErrorCodes(this.props.intl, response, true);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      });
  }

  createDraftForTemplate(contract: MasterContractHistory) {
    this.api.createDraftForTemplate(contract.id)
      .then((response) => {
        if (response.data.success) {
          const url = buildPath(DynamicRoutes.ContractUpdate, [response.data.result!.id.toString()]);
          this.props.navigate(url);
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, true);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      });
  }

  publishDraft(contract: MasterContractHistory) {
    this.api.publishDraft(contract.id)
      .then((response) => {
        if (response.data.success) {
          return this.find();
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, true);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      });
  }

  deactivateTemplate(contract: MasterContractHistory) {
    this.api.deactivateTemplate(contract.id)
      .then((response) => {
        if (response.data.success) {
          return this.find();
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, true);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      });
  }

  deleteDraft() {
    const { record = null } = this.state;
    if (record == null) {
      return;
    }
    this.api.deleteDraft(record.id)
      .then((response) => {
        if (response.data.success) {
          this.setState({
            confirm: false,
            record: null,
          });

          return this.find();
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, true);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      });
  }

  onNavigate(e: React.MouseEvent | null, url: string) {
    if (e) {
      e.preventDefault();
    }

    this.props.navigate(url);
  }

  showConfirmDialog(record: MasterContractHistory): void {
    this.setState({
      confirm: true,
      record,
    });
  }

  hideConfirmDialog(): void {
    this.setState({
      confirm: false,
      record: null,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Yes:
        this.deleteDraft();
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
        <FormattedMessage id="view.shared.message.delete-contract" defaultMessage='Are you sure you want to delete this draft?' />
      </Dialog>
    );
  }

  render() {
    const { classes, result } = this.props;

    const items = result ? result.items : [];

    const contracts = items.map((contract, index) => (
      <Grid key={`contract-${index}`} className={classes.contract}>
        <div className={classes.contractInner} ><h3 className={classes.contractTitle}>{contract.title}</h3>
          <div className={classes.state}>
            <FormattedMessage id="view.shared.state" defaultMessage={contract.status} />
          </div>
          <div className={classes.date}>
            <FormattedMessage id="view.shared.modified_at" defaultMessage={"Last modified: " + contract.modifiedAt?.format('DD-MM-YYYY')} />
          </div>
          <div className={classes.btnControl}>
            {contract.status === EnumContractStatus.DRAFT &&
              <Button
                type="button"
                variant="contained"
                className={classes.editBtn}
                onClick={(e) => this.onNavigate(e, buildPath(DynamicRoutes.ContractUpdate, [contract.id.toString()]))}
              >
                <FormattedMessage id="view.shared.action.edit" defaultMessage="Edit" />
              </Button>
            }

            {contract.status !== EnumContractStatus.DRAFT &&
              <Button
                type="button"
                variant="contained"
                className={classes.editBtn}
                onClick={() => this.createDraftForTemplate(contract)}
              >
                <FormattedMessage id="view.shared.action.new-version" defaultMessage="New version" />
              </Button>
            }

            {contract.status === EnumContractStatus.DRAFT &&
              <Button
                type="button"
                variant="contained"
                className={classes.editBtn}
                onClick={() => this.publishDraft(contract)}
              >
                <FormattedMessage id="view.shared.action.publish" defaultMessage="Publish" />
              </Button>
            }

            {contract.status === EnumContractStatus.DRAFT &&
              <Button
                type="button"
                variant="contained"
                className={classes.editBtn}
                onClick={() => this.showConfirmDialog(contract)}
              >
                <FormattedMessage id="view.shared.action.delete" defaultMessage="Delete" />
              </Button>
            }

            {contract.status === EnumContractStatus.ACTIVE &&
              <Button
                type="submit"
                variant="contained"
                className={classes.editBtn}
                onClick={() => this.deactivateTemplate(contract)}
              >
                <FormattedMessage id="view.shared.action.disable" defaultMessage="Disable" />
              </Button>
            }
          </div>
        </div>
      </Grid>
    ));

    return (
      <div>
        <h2 className={classes.heading}> Master contracts </h2>
        <Button className={classes.createBtn}
          type="submit"
          variant="contained"
          onClick={(e) => this.onNavigate(e, DynamicRoutes.ContractCreate)}
        >
          New Master Contract
        </Button>
        {contracts}
        {this.renderConfirm()}
      </div>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  lastUpdated: state.contract.lastUpdated,
  loading: state.contract.loading,
  result: state.contract.result,
});

const mapDispatch = {
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMasterContractSortField>[]) => find(pageRequest, sorting),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ContractListComponent);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent navigate={navigate} location={location} />
  );
}

export default RoutedComponent;
