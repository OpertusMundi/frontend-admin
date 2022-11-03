import React from 'react';
import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiClipboardOutline, mdiCommentAlertOutline, mdiContentCopy, mdiTrashCan, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import HelpdeskAccountApi from 'service/account';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/account/actions';
import { find } from 'store/account/thunks';

// Utilities
import { localizeErrorCodes } from 'utils/error';

// Model
import { DynamicRoutes, buildPath } from 'model/routes';
import { PageRequest, Sorting, SimpleResponse } from 'model/response';
import { HelpdeskAccount, EnumHelpdeskAccountSortField } from 'model/account';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import AccountFilters from './grid/filter';
import AccountTable from './grid/table';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

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
  },
  otp: {
    padding: theme.spacing(2, 0),
  },
});

enum EnumDialog {
  Delete = 'Delete',
  RegisterToIdp = 'RegisterToIdp',
  ResetPassword = 'ResetPassword',
}

interface AccountManagerState {
  dialog: EnumDialog | null;
  otp: string | undefined | null;
  record: HelpdeskAccount | null;
}

interface AccountManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class AccountManager extends React.Component<AccountManagerProps, AccountManagerState> {

  private api: HelpdeskAccountApi;

  constructor(props: AccountManagerProps) {
    super(props);

    this.api = new HelpdeskAccountApi();

    this.deleteRow = this.deleteRow.bind(this);
    this.registerToIdp = this.registerToIdp.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.updateRow = this.updateRow.bind(this);
  }

  state: AccountManagerState = {
    dialog: null,
    otp: null,
    record: null,
  }

  showDialog(dialog: EnumDialog, record: HelpdeskAccount): void {
    this.setState({
      dialog,
      otp: null,
      record,
    });
  }

  hideDialog(): void {
    this.setState({
      dialog: null,
      otp: null,
      record: null,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    const { dialog } = this.state;

    switch (dialog) {
      case EnumDialog.Delete:
        this.handleDeleteAction(action);
        break;
      case EnumDialog.RegisterToIdp:
        this.handleRegisterToIdpAction(action);
        break;
      case EnumDialog.ResetPassword:
        this.handleResetPasswordAction(action);
    }
  }

  handleDeleteAction(action: DialogAction) {
    switch (action.key) {
      case EnumDialogAction.Yes: {
        const { record } = this.state;

        if (record && record.id) {
          this.api.remove(record.id)
            .then((response) => {
              if (response.data.success) {
                this.find();

                message.info('message.delete-success');
              } else {
                const messages = localizeErrorCodes(this.props.intl, response.data);
                message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
              }
            })
            .catch((err: AxiosError<SimpleResponse>) => {
              const messages = localizeErrorCodes(this.props.intl, err.response?.data);
              message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            });
        }
        break;
      }
    }

    this.hideDialog();
  }

  handleRegisterToIdpAction(action: DialogAction) {
    switch (action.key) {
      case EnumDialogAction.Yes: {
        const { record } = this.state;

        if (record && record.id) {
          this.api.registerToIdp(record.id)
            .then((response) => {
              if (response.data.success) {
                this.setState({
                  otp: response.data.result,
                });

                if (response.data.result) {
                  message.info('message.idp-registration-success');
                }
              } else {
                const messages = localizeErrorCodes(this.props.intl, response.data);
                message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
              }
            })
            .catch((err: AxiosError<SimpleResponse>) => {
              const messages = localizeErrorCodes(this.props.intl, err.response?.data);
              message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            });
        }
        break;
      }

      case EnumDialogAction.No: {
        this.hideDialog();
        this.find();
        break;
      }
    }
  }

  handleResetPasswordAction(action: DialogAction) {
    switch (action.key) {
      case EnumDialogAction.Yes: {
        const { record } = this.state;

        if (record && record.id) {
          this.api.resetPassword(record.id)
            .then((response) => {
              if (response.data.success) {
                this.setState({
                  otp: response.data.result,
                });

                if (response.data.result) {
                  message.info('message.password-reset-success');
                }
              } else {
                const messages = localizeErrorCodes(this.props.intl, response.data);
                message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
              }
            })
            .catch((err: AxiosError<SimpleResponse>) => {
              const messages = localizeErrorCodes(this.props.intl, err.response?.data);
              message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            });
        }
        break;
      }

      case EnumDialogAction.No: {
        this.hideDialog();

        break;
      }
    }
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

  createRow(): void {
    this.props.navigate(DynamicRoutes.AccountCreate);
  }

  updateRow(id: number): void {
    const path = buildPath(DynamicRoutes.AccountUpdate, [id.toString()]);

    this.props.navigate(path);
  }

  registerToIdp(id: number): void {
    const { explorer: { result } } = this.props;

    const record = result?.items.find(o => o.id === id);

    if (record) {
      this.showDialog(EnumDialog.RegisterToIdp, record);
    }
  }

  resetPassword(id: number): void {
    const { explorer: { result } } = this.props;

    const record = result?.items.find(o => o.id === id);

    if (record) {
      this.showDialog(EnumDialog.ResetPassword, record);
    }
  }

  deleteRow(id: number): void {
    const { explorer: { result } } = this.props;

    const record = result?.items.find(o => o.id === id);

    if (record) {
      this.showDialog(EnumDialog.Delete, record);
    }
  }

  setSorting(sorting: Sorting<EnumHelpdeskAccountSortField>[]): void {
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
            <AccountFilters
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
                    <FormattedMessage id="account.helpdesk.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <AccountTable
              loading={loading}
              pagination={pagination}
              query={query}
              result={result}
              selected={selected}
              sorting={sorting}
              deleteRow={this.deleteRow}
              find={this.props.find}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumHelpdeskAccountSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              registerToIdp={(id: number) => this.registerToIdp(id)}
              resetPassword={(id: number) => this.resetPassword(id)}
              updateRow={this.updateRow}
            />
          </Paper>
        </div>
        {this.renderDeleteConfirm()}
        {this.renderIdpConfirm()}
        {this.renderResetPasswordDialog()}
      </>
    );
  }

  renderDeleteConfirm() {
    const _t = this.props.intl.formatMessage;

    const { dialog, record } = this.state;

    if (dialog !== EnumDialog.Delete || !record) {
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
        handleClose={() => this.hideDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={dialog === EnumDialog.Delete}
      >
        <FormattedMessage id="view.shared.message.delete-confirm" values={{ name: record.email }} />
      </Dialog>
    );
  }

  renderIdpConfirm() {
    const _t = this.props.intl.formatMessage;

    const { classes } = this.props;
    const { dialog, otp, record } = this.state;

    if (dialog !== EnumDialog.RegisterToIdp || !record) {
      return null;
    }

    const actions: DialogAction[] = otp === null
      ? [{
        key: EnumDialogAction.Yes,
        label: _t({ id: 'view.shared.action.yes' }),
        iconClass: () => (<Icon path={mdiTrashCan} size="1.5rem" />),
        color: 'primary',
      }, {
        key: EnumDialogAction.No,
        label: _t({ id: 'view.shared.action.no' }),
        iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
      }]
      : [{
        key: EnumDialogAction.No,
        label: _t({ id: 'view.shared.action.close' }),
        iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
      }];

    return (
      <Dialog
        actions={actions}
        handleClose={() => this.hideDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={dialog === EnumDialog.RegisterToIdp}
      >
        {otp === null &&
          <FormattedMessage id="account.helpdesk.message.register-to-idp-confirm" values={{ email: (<b>{record.email}</b>) }} />
        }
        {otp === undefined &&
          <FormattedMessage id="account.helpdesk.message.register-to-idp-invalid-request" values={{ email: (<b>{record.email}</b>) }} />
        }
        {otp &&
          <>
            <FormattedMessage
              id="account.helpdesk.message.otp-created"
              tagName={'p'}
              values={{ email: <b>{record.email}</b> }}
            />
            <Grid container alignItems='center' justifyContent='center' spacing={4} className={classes.otp}>
              <Grid item >
                <Typography variant="h6" display="block" >
                  {otp}
                </Typography>
              </Grid>
              <Grid>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => {
                    copyToClipboard(otp);

                    message.infoHtml(
                      <FormattedMessage
                        id={'account.helpdesk.message.otp-copied'}
                      />,
                      () => (<Icon path={mdiClipboardOutline} size="3rem" />),
                    );
                  }}
                  title="Copy to clipboard"
                >
                  <Icon path={mdiContentCopy} size="1.5rem" />
                </IconButton>
              </Grid>
            </Grid>
            <Typography variant="h5" display="block" gutterBottom color="secondary">
              <FormattedMessage
                id="account.helpdesk.message.otp-warning"
                tagName={'p'}
              />
            </Typography>
            <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
          </>
        }

      </Dialog>
    );
  }

  renderResetPasswordDialog() {
    const _t = this.props.intl.formatMessage;

    const { classes } = this.props;
    const { dialog, otp, record } = this.state;

    if (dialog !== EnumDialog.ResetPassword || !record) {
      return null;
    }

    const actions: DialogAction[] = otp === null
      ? [{
        key: EnumDialogAction.Yes,
        label: _t({ id: 'view.shared.action.yes' }),
        iconClass: () => (<Icon path={mdiTrashCan} size="1.5rem" />),
        color: 'primary',
      }, {
        key: EnumDialogAction.No,
        label: _t({ id: 'view.shared.action.no' }),
        iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
      }]
      : [{
        key: EnumDialogAction.No,
        label: _t({ id: 'view.shared.action.close' }),
        iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
      }];

    return (
      <Dialog
        actions={actions}
        handleClose={() => this.hideDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={dialog === EnumDialog.ResetPassword}
      >
        {otp === null &&
          <FormattedMessage id="account.helpdesk.message.reset-password-confirm" values={{ email: (<b>{record.email}</b>) }} />
        }
        {otp === undefined &&
          <FormattedMessage id="account.helpdesk.message.reset-password-invalid-request" values={{ email: (<b>{record.email}</b>) }} />
        }
        {otp &&
          <>
            <FormattedMessage
              id="account.helpdesk.message.otp-created"
              tagName={'p'}
              values={{ email: <b>{record.email}</b> }}
            />
            <Grid container alignItems='center' justifyContent='center' spacing={4} className={classes.otp}>
              <Grid item >
                <Typography variant="h6" display="block" >
                  {otp}
                </Typography>
              </Grid>
              <Grid>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => {
                    copyToClipboard(otp);

                    message.infoHtml(
                      <FormattedMessage
                        id={'account.helpdesk.message.otp-copied'}
                      />,
                      () => (<Icon path={mdiClipboardOutline} size="3rem" />),
                    );
                  }}
                  title="Copy to clipboard"
                >
                  <Icon path={mdiContentCopy} size="1.5rem" />
                </IconButton>
              </Grid>
            </Grid>
            <Typography variant="h5" display="block" gutterBottom color="secondary">
              <FormattedMessage
                id="account.helpdesk.message.otp-warning"
                tagName={'p'}
              />
            </Typography>
            <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
          </>
        }

      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.account.helpdesk,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumHelpdeskAccountSortField>[]) => find(pageRequest, sorting),
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

export default RoutedComponent;
