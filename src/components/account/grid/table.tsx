import React from 'react';

import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import { mdiFormTextboxPassword, mdiPencilOutline, mdiSecurity, mdiTrashCanOutline } from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumHelpdeskAccountSortField, HelpdeskAccount, HelpdeskAccountQuery } from 'model/account';
import { PageRequest, PageResult, Sorting } from 'model/response';

enum EnumAction {
  Delete = 'delete',
  Edit = 'edit',
  RegisterToIdp = 'register-to-idp',
  ResetPassword = 'reset-password',
};

function accountColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<HelpdeskAccount, EnumHelpdeskAccountSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'account.helpdesk.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<HelpdeskAccount, EnumHelpdeskAccountSortField>, row: HelpdeskAccount, handleAction?: cellActionHandler<HelpdeskAccount, EnumHelpdeskAccountSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Tooltip title={intl.formatMessage({ id: 'account.helpdesk.tooltip.edit' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.Edit, rowIndex, column, row) : null}
            >
              <Icon path={mdiPencilOutline} className={classes.classes.rowIcon} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'account.helpdesk.tooltip.delete' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.Delete, rowIndex, column, row) : null}
            >
              <Icon path={mdiTrashCanOutline} className={classes.classes.rowIcon} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'account.helpdesk.tooltip.reset-password' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ResetPassword, rowIndex, column, row) : null}
            >
              <Icon path={mdiFormTextboxPassword} className={classes.classes.rowIcon} />
            </i>
          </Tooltip>
          {!row.registeredToIdp &&
            <Tooltip title={intl.formatMessage({ id: 'account.helpdesk.tooltip.register-to-idp' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.RegisterToIdp, rowIndex, column, row) : null}
              >
                <Icon path={mdiSecurity} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: '',
      id: 'avatar',
      width: 60,
      cell: (
        rowIndex: number, column: Column<HelpdeskAccount, EnumHelpdeskAccountSortField>, row: HelpdeskAccount, handleAction?: cellActionHandler<HelpdeskAccount, EnumHelpdeskAccountSortField>
      ): React.ReactNode => {
        if (row?.image && row?.imageMimeType) {
          const url = `data:${row.imageMimeType};base64,${row.image}`;
          return (
            <Avatar alt={row.email} src={url || undefined} variant="circular" className={classes.classes.avatar} />
          );
        }
        return null;
      },
    }, {
      header: intl.formatMessage({ id: 'account.helpdesk.header.email' }),
      id: 'email',
      width: 250,
      sortable: true,
      sortColumn: EnumHelpdeskAccountSortField.EMAIL,
      cell: (
        rowIndex: number, column: Column<HelpdeskAccount, EnumHelpdeskAccountSortField>, row: HelpdeskAccount, handleAction?: cellActionHandler<HelpdeskAccount, EnumHelpdeskAccountSortField>
      ): React.ReactNode => (
        <Link to={buildPath(DynamicRoutes.AccountUpdate, [row.id + ''])} className={classes.classes.link}>
          {row.email}
        </Link>
      ),
    }, {
      header: intl.formatMessage({ id: 'account.helpdesk.header.firstName' }),
      id: 'firstName',
      width: 150,
      accessor: 'firstName',
      sortable: true,
      sortColumn: EnumHelpdeskAccountSortField.FIRST_NAME,
    }, {
      header: intl.formatMessage({ id: 'account.helpdesk.header.lastName' }),
      id: 'lastName',
      width: 150,
      accessor: 'lastName',
      sortable: true,
      sortColumn: EnumHelpdeskAccountSortField.LAST_NAME,
    }, {
      header: intl.formatMessage({ id: 'account.helpdesk.header.roles' }),
      id: 'roles',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<HelpdeskAccount, EnumHelpdeskAccountSortField>, row: HelpdeskAccount, handleAction?: cellActionHandler<HelpdeskAccount, EnumHelpdeskAccountSortField>
      ): React.ReactNode => (
        <div className={classes.classes.roles}>
          {row && row.roles && row.roles.map((r) => (
            <div key={r} className={classes.classes.role}>
              <FormattedMessage id={`enum.role.${r}`} />
            </div>
          ))}
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'account.helpdesk.header.modified-on' }),
      id: 'modifiedOn',
      width: 180,
      sortable: false,
      cell: (
        rowIndex: number, column: Column<HelpdeskAccount, EnumHelpdeskAccountSortField>, row: HelpdeskAccount, handleAction?: cellActionHandler<HelpdeskAccount, EnumHelpdeskAccountSortField>
      ): React.ReactNode => (
        <DateTime value={row?.modifiedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  link: {
    color: 'inherit',
  },
  roles: {
    display: 'flex',
  },
  role: {
    display: 'flex',
    marginRight: theme.spacing(1),
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
  }
});

interface AccountTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  loading?: boolean;
  pagination: PageRequest,
  query: HelpdeskAccountQuery,
  result: PageResult<HelpdeskAccount> | null,
  selected: HelpdeskAccount[],
  sorting: Sorting<EnumHelpdeskAccountSortField>[];
  addToSelection: (rows: HelpdeskAccount[]) => void,
  deleteRow: (id: number) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumHelpdeskAccountSortField>[]
  ) => Promise<PageResult<HelpdeskAccount> | null>,
  registerToIdp: (id: number) => void;
  resetPassword: (id: number) => void;
  removeFromSelection: (rows: HelpdeskAccount[]) => void,
  resetSelection: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumHelpdeskAccountSortField>[]) => void,
  updateRow: (id: number) => void;
}

class AccountTable extends React.Component<AccountTableProps> {

  constructor(props: AccountTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<HelpdeskAccount, EnumHelpdeskAccountSortField>, row: HelpdeskAccount): void {
    if (row.id) {
      switch (action) {
        case EnumAction.Delete:
          this.props.deleteRow(row.id);
          break;
        case EnumAction.Edit:
          this.props.updateRow(row.id);
          break;
        case EnumAction.RegisterToIdp:
          this.props.registerToIdp(row.id);
          break;
        case EnumAction.ResetPassword:
          this.props.resetPassword(row.id);
          break;
        default:
          // No action
          break;
      }
    }
  }

  render() {
    const { intl, classes, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <MaterialTable<HelpdeskAccount, EnumHelpdeskAccountSortField>
        intl={intl}
        columns={accountColumns(intl, { classes })}
        rows={result ? result.items : []}
        pagination={{
          rowsPerPageOptions: [10, 20, 50],
          count: result ? result.count : 0,
          size: result ? result.pageRequest.size : 20,
          page: result ? result.pageRequest.page : 0,
        }}
        handleAction={this.handleAction}
        handlePageChange={(index: number) => {
          setPager(index, pagination.size);

          find();
        }}
        handleRowsPerPageChange={(size: number) => {
          setPager(0, size);

          this.props.find();
        }}
        selected={selected}
        sorting={sorting}
        setSorting={setSorting}
        loading={loading}
      />
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(AccountTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;