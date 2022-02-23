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
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiTrashCan, mdiUndoVariant } from '@mdi/js';

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
  confirm: boolean;
  record: HelpdeskAccount | null
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
  }

  state: AccountManagerState = {
    confirm: false,
    record: null,
  }

  showConfirmDialog(record: HelpdeskAccount): void {
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
      case EnumDialogAction.Yes: {
        const { record } = this.state;

        if (record && record.id) {
          this.api.remove(record.id)
            .then((response) => {
              if (response.data.success) {
                this.find();

                message.info('error.delete-success');
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

    this.hideConfirmDialog();
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

  deleteRow(id: number): void {
    const { explorer: { result } } = this.props;

    const record = result?.items.find(o => o.id === id);

    if (record) {
      this.showConfirmDialog(record);
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
              deleteRow={this.deleteRow}
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumHelpdeskAccountSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              sorting={sorting}
              updateRow={(id: number) => this.updateRow(id)}
              loading={loading}
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
        <FormattedMessage id="view.shared.message.delete-confirm" values={{ name: record.email }} />
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
