import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedDate, FormattedNumber } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

// Icons
import Icon from '@mdi/react';
import {
  mdiDatabaseCogOutline,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumBillingViewMode } from 'model/order';
import {
  EnumSubscriptionBillingBatchSortField,
  EnumSubscriptionBillingBatchStatus,
  SubscriptionBillingBatch,
  SubscriptionBillingBatchQuery,
} from 'model/subscription-billing';

enum EnumAction {
  ViewProcessInstance = 'view-process-instance',
};

const styles = (theme: Theme) => createStyles({
  alightRight: {
    textAlign: 'right',
  },
  rowIconAction: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  link: {
    color: 'inherit',
  },
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  compositeLabelLeft: {
    display: 'flex',
    alignItems: 'baseline',
  },
  labelStatusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  labelStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center'
  },
  provider: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
});

function subscriptionBillingColumns(intl: IntlShape, props: SubscriptionBillingTableProps): Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.subscription-billing-batch.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>, row: SubscriptionBillingBatch, handleAction?: cellActionHandler<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelLeft}>
          {row.processInstance &&
            <Tooltip title={intl.formatMessage({ id: 'billing.subscription-billing-batch.tooltip.view-process-instance' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.ViewProcessInstance, rowIndex, column, row) : null}
              >
                <Icon path={mdiDatabaseCogOutline} className={classes.rowIconAction} />
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing-batch.header.interval' }),
      id: 'interval',
      sortable: true,
      sortColumn: EnumSubscriptionBillingBatchSortField.FROM_DATE,
      width: 200,
      cell: (
        rowIndex: number, column: Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>, row: SubscriptionBillingBatch, handleAction?: cellActionHandler<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>
      ): React.ReactNode => (
        <>
          {<FormattedDate value={row.fromDate.toDate()} day='numeric' month='numeric' year='numeric' />}
          {' - '}
          <FormattedDate value={row.toDate.toDate()} day='numeric' month='numeric' year='numeric' />
        </>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing-batch.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumSubscriptionBillingBatchSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>, row: SubscriptionBillingBatch, handleAction?: cellActionHandler<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.labelStatusContainer}>
            {row?.status &&
              <div
                className={classes.labelStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.subscription-billing-batch-status.${row.status}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing-batch.header.created-by' }),
      id: 'createdBy',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>, row: SubscriptionBillingBatch, handleAction?: cellActionHandler<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>
      ): React.ReactNode => {

        return (
          <>
            <div className={classes.compositeLabel}>
              <div className={classes.provider}>
                <Link to={buildPath(DynamicRoutes.AccountUpdate, [row.createdBy.id.toString()])} className={classes.link}>
                  {[row.createdBy.firstName, row.createdBy.lastName].join(' ')}
                </Link>
                <Typography variant="caption">{row.createdBy.email}</Typography>
              </div>
            </div>
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing-batch.header.modified-on' }),
      id: 'registeredOn',
      sortable: true,
      sortColumn: EnumSubscriptionBillingBatchSortField.UPDATED_ON,
      cell: (
        rowIndex: number,
        column: Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>,
        row: SubscriptionBillingBatch,
        handleAction?: cellActionHandler<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>
      ): React.ReactNode => (
        <DateTime value={row.updatedOn.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing-batch.header.total-price' }),
      id: 'totalPrice',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumSubscriptionBillingBatchSortField.TOTAL_PRICE,
      className: classes.alightRight,
      width: 120,
      cell: (
        rowIndex: number,
        column: Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>,
        row: SubscriptionBillingBatch,
        handleAction?: cellActionHandler<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>
      ): React.ReactNode => (
        row.status !== EnumSubscriptionBillingBatchStatus.SUCCEEDED ? (
          <span>-</span>
        ) : (
          <b>
            <FormattedNumber value={row.totalPrice} style={'currency'} currency={'EUR'} />
          </b >
        )
      ),
    }]);
}

const statusToBackGround = (status: EnumSubscriptionBillingBatchStatus): string => {
  switch (status) {
    case EnumSubscriptionBillingBatchStatus.SUCCEEDED:
      return '#4CAF50';
    case EnumSubscriptionBillingBatchStatus.FAILED:
      return '#f44336';
  }
  return '#0277BD';
};

interface SubscriptionBillingTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  loading?: boolean;
  mode?: EnumBillingViewMode;
  pagination: PageRequest,
  query: SubscriptionBillingBatchQuery,
  result: PageResult<SubscriptionBillingBatch> | null,
  selected: SubscriptionBillingBatch[],
  sorting: Sorting<EnumSubscriptionBillingBatchSortField>[];
  addToSelection?: (rows: SubscriptionBillingBatch[]) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionBillingBatchSortField>[]
  ) => Promise<PageResult<SubscriptionBillingBatch> | null>,
  removeFromSelection?: (rows: SubscriptionBillingBatch[]) => void,
  resetSelection?: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumSubscriptionBillingBatchSortField>[]) => void,
  viewProcessInstance: (processInstance: string) => void;
}

class SubscriptionBillingTable extends React.Component<SubscriptionBillingTableProps> {

  constructor(props: SubscriptionBillingTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  static defaultProps = {
    mode: EnumBillingViewMode.DEFAULT,
  }

  handleAction(
    action: string, index: number, column: Column<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>, row: SubscriptionBillingBatch
  ): void {
    if (row.key) {
      switch (action) {
        case EnumAction.ViewProcessInstance:
          if (row.processInstance) {
            this.props.viewProcessInstance(row.processInstance);
          }
          break;

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
        <MaterialTable<SubscriptionBillingBatch, EnumSubscriptionBillingBatchSortField>
          intl={intl}
          columns={subscriptionBillingColumns(intl, this.props)}
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
const styledComponent = withStyles(styles)(SubscriptionBillingTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;