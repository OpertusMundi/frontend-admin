import React from 'react';
import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiPinOutline, mdiTrashCan, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import ContractApi from 'service/contract';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/contract/actions';
import { find } from 'store/contract/thunks';

// Utilities
import { localizeErrorCodes } from 'utils/error';

// Model
import { DynamicRoutes, buildPath } from 'model/routes';
import { PageRequest, Sorting, SimpleResponse } from 'model/response';
import { MasterContractHistory, EnumMasterContractSortField } from 'model/contract';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import ContractFilters from './grid/filter';
import ContractTable from './grid/table';

const styles = (theme: Theme) => createStyles({
  alert: {
    margin: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  paperTable: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
    overflowX: 'auto',
  },
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  }
});

interface ContractManagerState {
  confirm: boolean;
  record: MasterContractHistory | null
}

interface ContractManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class ContractManager extends React.Component<ContractManagerProps, ContractManagerState> {

  private api: ContractApi;

  private refreshCountersInterval: number | null = null;

  constructor(props: ContractManagerProps) {
    super(props);

    this.api = new ContractApi();

    this.confirmDraftDelete = this.confirmDraftDelete.bind(this);
    this.createDraftForTemplate = this.createDraftForTemplate.bind(this);
    this.cloneDraftFromTemplate = this.cloneDraftFromTemplate.bind(this);
    this.deactivateTemplate = this.deactivateTemplate.bind(this);
    this.editDraft = this.editDraft.bind(this);
    this.publishDraft = this.publishDraft.bind(this);
    this.downloadPublishedTemplate = this.downloadPublishedTemplate.bind(this);
    this.setDefaultContract = this.setDefaultContract.bind(this);
  }

  state: ContractManagerState = {
    confirm: false,
    record: null,
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

  componentDidMount() {
    this.find();

    this.refreshCountersInterval = window.setInterval(() => {
      this.props.find();
    }, 5 * 60 * 1000);
  }

  componentWillUnmount() {
    if (this.refreshCountersInterval != null) {
      clearInterval(this.refreshCountersInterval);
      this.refreshCountersInterval = null;
    }
  }

  find(): void {
    this.props.find().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  createDraftForTemplate(contract: MasterContractHistory): void {
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

  cloneDraftFromTemplate(contract: MasterContractHistory): void {
    this.api.cloneDraftFromTemplate(contract.id)
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

  setDefaultContract(contract: MasterContractHistory): void {
    this.api.setDefaultContract(contract.id)
      .then((response) => {
        if (response.data.success) {
          message.infoHtml(
            <FormattedMessage
              id={'contract.message.default-contract-set'}
            />,
            () => (<Icon path={mdiPinOutline} size="3rem" />),
          );

          return this.find();
        } else {
          const messages = response.data.messages.map((m, index) => <p key={`error-${index}`}> {m.description} </p>);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        }
      })
      .catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, true);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
      });
  }

  downloadPublishedTemplate(contract: MasterContractHistory): void {
    this.api.downloadPublished(contract.id, contract.title)
      .then((response) => {
        if (!response.success) {
          const messages = localizeErrorCodes(this.props.intl, response, true);
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

  createRow(): void {
    this.props.navigate(DynamicRoutes.ContractCreate);
  }

  editDraft(contract: MasterContractHistory): void {
    const path = buildPath(DynamicRoutes.ContractUpdate, [contract.id.toString()]);

    this.props.navigate(path);
  }

  confirmDraftDelete(contract: MasterContractHistory): void {
    if (contract) {
      this.showConfirmDialog(contract);
    }
  }

  setSorting(sorting: Sorting<EnumMasterContractSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      addToSelection,
      classes,
      explorer: { query, result, pagination, loading, lastUpdated, selected, sorting },
      find,
      setPager,
      setFilter,
      removeFromSelection,
      resetFilter,
    } = this.props;

    return (
      <>
        <div>
          <Paper className={classes.paper}>
            <ContractFilters
              query={query}
              setFilter={setFilter}
              resetFilter={resetFilter}
              find={find}
              create={() => this.createRow()}
              disabled={loading}
            />
            {lastUpdated &&
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom className={classes.caption}>
                    <FormattedMessage id="contract.message.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          {result && result.defaultContractCount === 0 &&
            <Grid item xs={12}>
              <Alert className={classes.alert} severity="warning">
                <span>No default contract is set</span>
                {result.operationPending &&
                  <span>. <b>An update operation is in progress ...</b></span>
                }
              </Alert>
            </Grid>
          }
          {result && result.defaultContractCount !== 0 &&
            <Grid item xs={12}>
              <Alert className={classes.alert} severity="info">
                <span>{result.defaultContractCount} contracts assigned as default</span>
                {result.operationPending &&
                  <span>. <b>An update operation is in progress ...</b></span>
                }
              </Alert>
            </Grid>
          }

          <Paper className={classes.paperTable}>
            <ContractTable
              addToSelection={addToSelection}
              createDraftForTemplate={this.createDraftForTemplate}
              deactivateTemplate={this.deactivateTemplate}
              deleteDraft={this.confirmDraftDelete}
              editDraft={this.editDraft}
              find={find}
              publishDraft={this.publishDraft}
              cloneDraftFromTemplate={this.cloneDraftFromTemplate}
              downloadPublishedTemplate={this.downloadPublishedTemplate}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumMasterContractSortField>[]) => this.setSorting(sorting)}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              setDefaultContract={this.setDefaultContract}
              loading={loading}
              pagination={pagination}
              query={query}
              result={result}
              selected={selected}
              sorting={sorting}
            />
          </Paper>
        </div >
        {this.renderConfirm()}
      </>
    );
  }

  renderConfirm() {
    const _t = this.props.intl.formatMessage;

    const { confirm, record } = this.state;

    if (!confirm || !record) {
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
        <FormattedMessage id="view.shared.message.delete-confirm" values={{ name: record.title }} />
      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.contract,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMasterContractSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ContractManager);

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
