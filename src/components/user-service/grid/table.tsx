import React from 'react';

// Components
import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import Icon from '@mdi/react';
import {
  mdiFilterCogOutline,
} from '@mdi/js';

// Model
import { PageRequest, PageResult, Sorting } from 'model/response';
import {
  EnumUserServiceSortField,
  UserService,
  UserServiceQuery,
  EnumUserServiceStatus,
} from 'model/account-marketplace';
import { ApplicationConfiguration } from 'model/configuration';

enum EnumAction {
  FilterBillingRecords = 'filter-billing-records',
};

const styles = (theme: Theme) => createStyles({
  assetDescription: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: 350,
  },
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  consumer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    color: 'inherit',
  },
  provider: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  statusLabel: {
    display: 'flex',
    marginRight: theme.spacing(2),
    background: '#4CAF50',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
  },
  statusLabelWarning: {
    display: 'flex',
    marginRight: theme.spacing(2),
    background: '#F4511E',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
  },
  statusLabelText: {
  },
});

function subscriptionColumns(intl: IntlShape, props: UserServiceTableProps): Column<UserService, EnumUserServiceSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.user-service.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<UserService, EnumUserServiceSortField>, row: UserService, handleAction?: cellActionHandler<UserService, EnumUserServiceSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          {row &&
            <Tooltip title={intl.formatMessage({ id: 'billing.user-service.tooltip.filter' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.FilterBillingRecords, rowIndex, column, row) : null}
              >
                <Icon path={mdiFilterCogOutline} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.user-service.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumUserServiceSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<UserService, EnumUserServiceSortField>, row: UserService, handleAction?: cellActionHandler<UserService, EnumUserServiceSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.compositeLabel}>
            {row?.status &&
              <div
                className={classes.statusLabel}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.user-service-status.${row.status}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.user-service.header.title' }),
      id: 'item',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<UserService, EnumUserServiceSortField>, row: UserService, handleAction?: cellActionHandler<UserService, EnumUserServiceSortField>
      ): React.ReactNode => {

        return (
          <>
            {row ? (
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body1">{row.title}</Typography>
                </Grid>
                <Grid item xs={12} className={classes.assetDescription} title={row.abstractText}>
                  <Typography variant="caption">{row.abstractText}</Typography>
                </Grid>
              </Grid>
            ) : <span>-</span>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.user-service.header.added-on' }),
      id: 'addedOn',
      sortable: true,
      sortColumn: EnumUserServiceSortField.CREATED_ON,
      cell: (
        rowIndex: number,
        column: Column<UserService, EnumUserServiceSortField>,
        row: UserService,
        handleAction?: cellActionHandler<UserService, EnumUserServiceSortField>
      ): React.ReactNode => (
        <DateTime value={row?.updatedOn.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.user-service.header.modified-on' }),
      id: 'modifiedOn',
      sortable: true,
      sortColumn: EnumUserServiceSortField.UPDATED_ON,
      cell: (
        rowIndex: number,
        column: Column<UserService, EnumUserServiceSortField>,
        row: UserService,
        handleAction?: cellActionHandler<UserService, EnumUserServiceSortField>
      ): React.ReactNode => (
        <DateTime value={row?.updatedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const statusToBackGround = (status: EnumUserServiceStatus): string => {
  switch (status) {
    case EnumUserServiceStatus.PROCESSING:
    case EnumUserServiceStatus.FAILED:
      return '#616161';
    case EnumUserServiceStatus.PUBLISHED:
      return '#1976D2';
    case EnumUserServiceStatus.DELETED:
      return '#E64A19';
  }
};

interface UserServiceTableProps extends WithStyles<typeof styles> {
  config: ApplicationConfiguration,
  intl: IntlShape,
  loading?: boolean;
  pagination: PageRequest,
  query: UserServiceQuery,
  result: PageResult<UserService> | null,
  selected: UserService[],
  sorting: Sorting<EnumUserServiceSortField>[];
  addToSelection?: (rows: UserService[]) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumUserServiceSortField>[]
  ) => Promise<PageResult<UserService> | null>,
  removeFromSelection?: (rows: UserService[]) => void,
  resetSelection?: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumUserServiceSortField>[]) => void,
}

class UserServiceTable extends React.Component<UserServiceTableProps> {

  constructor(props: UserServiceTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<UserService, EnumUserServiceSortField>, row: UserService): void {
    if (row.key) {
      switch (action) {
        default:
          // No action
          break;
      }
    }
  }

  render() {
    const { intl, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <>
        <MaterialTable<UserService, EnumUserServiceSortField>
          intl={intl}
          columns={subscriptionColumns(intl, this.props)}
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
        <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
      </>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(UserServiceTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;