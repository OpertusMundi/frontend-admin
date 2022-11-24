import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiShieldBugOutline, mdiCommentAlertOutline, mdiShieldRefreshOutline, mdiTrashCan, mdiUndoVariant, mdiTrashCanOutline, mdiShredder } from '@mdi/js';

// Services
import message from 'service/message';
import MarketplaceAccountApi from 'service/account-marketplace';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/account-marketplace/actions';
import { find } from 'store/account-marketplace/thunks';
import { toggleSendMessageDialog } from 'store/message/actions';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumMarketplaceAccountSortField, MarketplaceAccountSummary } from 'model/account-marketplace';
import { ClientContact } from 'model/chat';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import AccountFilters from './grid/filter';
import AccountTable from './grid/table';

const styles = (theme: Theme) => createStyles({
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

interface AccountManagerState {
  accountDeleted: boolean;
  confirmDelete: boolean;
  contractsDeleted: boolean;
  fileSystemDeleted: boolean;
  record: MarketplaceAccountSummary | null;
}

interface AccountManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
  navigate: NavigateFunction;
  location: Location;
}

class AccountManager extends React.Component<AccountManagerProps, AccountManagerState> {

  private api: MarketplaceAccountApi;

  constructor(props: AccountManagerProps) {
    super(props);

    this.api = new MarketplaceAccountApi();

    this.deleteAllUserData = this.deleteAllUserData.bind(this);
    this.refreshKycStatus = this.refreshKycStatus.bind(this);
    this.toggleTester = this.toggleTester.bind(this);
  }

  state: AccountManagerState = {
    accountDeleted: false,
    confirmDelete: false,
    contractsDeleted: false,
    fileSystemDeleted: false,
    record: null,
  }

  viewRow(key: string): void {
    const path = buildPath(DynamicRoutes.MarketplaceAccountView, [key]);

    this.props.navigate(path);
  }

  viewProcessInstance(businessKey: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { businessKey });
    this.props.navigate(path);
  }

  showConfirmDeleteDialog(record: MarketplaceAccountSummary): void {
    this.setState({
      accountDeleted: false,
      confirmDelete: true,
      contractsDeleted: false,
      fileSystemDeleted: false,
      record,
    });
  }

  hideConfirmDeleteDialog(): void {
    this.setState({
      accountDeleted: false,
      confirmDelete: false,
      contractsDeleted: false,
      fileSystemDeleted: false,
      record: null,
    });
  }

  confirmDeleteDialogHandler(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Yes:
        const { record, accountDeleted, fileSystemDeleted, contractsDeleted } = this.state;

        if (record) {
          this.api.deleteAllUserData(record.key, accountDeleted, fileSystemDeleted, contractsDeleted)
            .then((response) => {
              if (response.data!.success) {
                message.infoHtml(
                  <FormattedMessage
                    id={accountDeleted
                      ? 'account-marketplace.message.delete-user-started'
                      : 'account-marketplace.message.delete-user-data-started'
                    }
                  />,
                  () => (<Icon path={accountDeleted ? mdiTrashCanOutline : mdiShredder} size="3rem" />),
                );
                this.find();
              } else {
                message.errorHtml(response.data!.messages[0].description);
              }
            })
            .catch(() => {
              message.error('account-marketplace.message.kyc-refresh-failure');
            });
        }
        break;

    }

    this.hideConfirmDeleteDialog();
  }

  componentDidMount() {
    this.find();
  }

  find(): void {
    this.props.find().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  setSorting(sorting: Sorting<EnumMarketplaceAccountSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  deleteAllUserData(row: MarketplaceAccountSummary): void {
    this.showConfirmDeleteDialog(row);
  }

  refreshKycStatus(row: MarketplaceAccountSummary): void {
    this.api.refreshKycStatus(row.key)
      .then((response) => {
        if (response.data!.success) {
          message.infoHtml(
            <FormattedMessage
              id={'account-marketplace.message.kyc-refresh-success'}
            />,
            () => (<Icon path={mdiShieldRefreshOutline} size="3rem" />),
          );
          this.find();
        } else {
          message.error('account-marketplace.message.kyc-refresh-failure');
        }
      })
      .catch(() => {
        message.error('account-marketplace.message.kyc-refresh-failure');
      });
  }

  toggleTester(row: MarketplaceAccountSummary): void {
    this.api.toggleTester(row.key)
      .then((response) => {
        if (response.data!.success) {
          message.infoHtml(
            <FormattedMessage
              id={'account-marketplace.message.toggle-tester-success'}
            />,
            () => (<Icon path={mdiShieldBugOutline} size="3rem" />),
          );
          this.find();
        } else {
          message.error('account-marketplace.message.toggle-tester-failure');
        }
      })
      .catch(() => {
        message.error('account-marketplace.message.toggle-tester-failure');
      });
  }

  contractsDeletedChanged(contractsDeleted: boolean): void {
    this.setState({ contractsDeleted });
  }

  fileSystemDeletedChanged(fileSystemDeleted: boolean): void {
    this.setState({ fileSystemDeleted });
  }

  accountDeletedChanged(accountDeleted: boolean): void {
    this.setState((state) => ({
      contractsDeleted: accountDeleted ? true : state.contractsDeleted,
      fileSystemDeleted: accountDeleted ? true : state.fileSystemDeleted,
      accountDeleted,
    }));
  }

  showSendMessageDialog(row: MarketplaceAccountSummary) {
    const contact = this.getContact(row);
    this.props.toggleSendMessageDialog(contact);
  }

  getContact(row: MarketplaceAccountSummary): ClientContact {
    return {
      id: row.key,
      logoImage: row.image,
      logoImageMimeType: row.imageMimeType,
      name: row.consumerName,
      email: row.email,
    };
  }

  render() {
    const {
      addToSelection,
      classes,
      config,
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
            <AccountFilters
              query={query}
              setFilter={setFilter}
              resetFilter={resetFilter}
              find={find}
              disabled={loading}
            />
            {lastUpdated &&
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom className={classes.caption}>
                    <FormattedMessage id="account.marketplace.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <AccountTable
              config={config}
              loading={loading}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              sorting={sorting}
              addToSelection={addToSelection}
              deleteAllUserData={this.deleteAllUserData}
              find={this.props.find}
              refreshKycStatus={this.refreshKycStatus}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              sendMessage={(row: MarketplaceAccountSummary) => this.showSendMessageDialog(row)}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumMarketplaceAccountSortField>[]) => this.setSorting(sorting)}
              toggleTester={this.toggleTester}
              view={(key: string) => this.viewRow(key)}
              viewProcessInstance={(businessKey: string) => this.viewProcessInstance(businessKey)}
            />
          </Paper>
        </div>
        {this.renderConfirmDeleteDialog()}
      </>
    );
  }

  renderConfirmDeleteDialog() {
    const _t = this.props.intl.formatMessage;

    const { confirmDelete, record, accountDeleted, fileSystemDeleted, contractsDeleted } = this.state;

    if (!confirmDelete || !record) {
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
        handleClose={() => this.hideConfirmDeleteDialog()}
        handleAction={(action) => this.confirmDeleteDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirmDelete}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom component={'p'}>
              <FormattedMessage id="account-marketplace.message.delete-confirm" values={{ name: (<b>{record.email}</b>) }} />
            </Typography>
            <Typography variant="caption" color="secondary" component={'p'}>
              <FormattedMessage id="account-marketplace.message.delete-confirm-data-details" />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fileSystemDeleted}
                  disabled={accountDeleted}
                  onChange={
                    (event) => this.fileSystemDeletedChanged(event.target.checked)
                  }
                  name="fileSystemDeleted"
                  color="primary"
                />
              }
              label={_t({ id: 'account-marketplace.confirm-delete-dialog.delete-file-system' })}
            />
            <Typography variant="caption" component={'p'}>
              <FormattedMessage id="account-marketplace.message.delete-confirm-filesystem-details" />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={contractsDeleted}
                  disabled={accountDeleted}
                  onChange={
                    (event) => this.contractsDeletedChanged(event.target.checked)
                  }
                  name="contractsDeleted"
                  color="primary"
                />
              }
              label={_t({ id: 'account-marketplace.confirm-delete-dialog.delete-contracts' })}
            />
            <Typography variant="caption" component={'p'}>
              <FormattedMessage id="account-marketplace.message.delete-confirm-contracts-details" />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={accountDeleted}
                  onChange={
                    (event) => this.accountDeletedChanged(event.target.checked)
                  }
                  name="accountDeleted"
                  color="primary"
                />
              }
              label={_t({ id: 'account-marketplace.confirm-delete-dialog.delete-account' })}
            />
            <Typography variant="caption" component={'p'}>
              <FormattedMessage id="account-marketplace.message.delete-confirm-account-details" />
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.account.marketplace,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
  toggleSendMessageDialog,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const StyledComponent = withStyles(styles)(AccountManager);

// Inject i18n resources
const LocalizedComponent = injectIntl(StyledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent navigate={navigate} location={location} />
  );
}

// Inject state
export default RoutedComponent;
