import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

// Icons
import Icon from '@mdi/react';
import {
  mdiContentCopy,
  mdiDatabaseCogOutline,
  mdiMessageTextOutline,
  mdiTimelineClockOutline,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumKycLevel, EnumMangopayUserType, CustomerIndividual, CustomerProfessional } from 'model/account-marketplace';
import { EnumOrderSortField, EnumOrderStatus, Order, OrderQuery } from 'model/order';
import { PageRequest, PageResult, Sorting } from 'model/response';

const COPY = 'copy';

enum EnumAction {
  CopyReferenceNumber = 'copy-reference-number',
  SendMessage = 'send-message',
  ViewProcessInstance = 'view-process-instance',
  ViewTimeline = 'view-timeline',
};

const getCustomerName = (order: Order): string => {
  if (order?.consumer && order?.consumer.type === EnumMangopayUserType.INDIVIDUAL) {
    const c = order?.consumer as CustomerIndividual;
    return [c.firstName, c.lastName].join(' ');
  }
  if (order?.consumer && order?.consumer?.type === EnumMangopayUserType.PROFESSIONAL) {
    const c = order?.consumer as CustomerProfessional;
    return c.name;
  }
  return '';
}

function orderColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<Order, EnumOrderSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'billing.order.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => (
        <div className={classes.classes.compositeLabelLeft}>
          <Tooltip title={intl.formatMessage({ id: 'billing.order.tooltip.send-message' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.SendMessage, rowIndex, column, row) : null}
            >
              <Icon path={mdiMessageTextOutline} className={classes.classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'billing.order.tooltip.view-timeline' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ViewTimeline, rowIndex, column, row) : null}
            >
              <Icon path={mdiTimelineClockOutline} className={classes.classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          {row.payIn?.processInstance &&
            <Tooltip title={intl.formatMessage({ id: 'billing.order.tooltip.view-process-instance' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.ViewProcessInstance, rowIndex, column, row) : null}
              >
                <Icon path={mdiDatabaseCogOutline} className={classes.classes.rowIconAction} />
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.order.header.reference-number' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumOrderSortField.REFERENCE_NUMBER,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => (
        <div className={classes.classes.compositeLabelJustified}>
          <Link to={buildPath(DynamicRoutes.OrderTimeline, [row.key])} className={classes.classes.link}>
            {row.referenceNumber}
          </Link>
          {row.referenceNumber &&
            <i
              onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
            >
              <Icon path={mdiContentCopy} className={classes.classes.rowIconAction} />
            </i>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.order.header.status' }),
      headerStyle: { textAlign: 'center' },
      id: 'status',
      sortable: true,
      sortColumn: EnumOrderSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.classes.compositeLabelCenter}>
            {row?.status &&
              <div
                className={classes.classes.labelOrderStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.order-status.${row.status}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.order.header.consumer' }),
      id: 'consumer',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.consumer &&
              <div className={classes.classes.compositeLabel}>
                <div
                  className={row?.consumer?.kycLevel === EnumKycLevel.LIGHT ? classes.classes.statusLabelWarning : classes.classes.statusLabel}
                >
                  <div>{row.consumer?.kycLevel}</div>
                </div>
                <div className={classes.classes.marginRight}>{getCustomerName(row)}</div>
              </div>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.order.header.payment-method' }),
      headerStyle: { textAlign: 'center' },
      id: 'paymentMethod',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.classes.compositeLabelCenter}>
            {row?.paymentMethod &&
              <div
                className={classes.classes.labelPaymentMethod}
              >
                {intl.formatMessage({ id: `enum.payment-method.${row.paymentMethod}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.order.header.delivery-method' }),
      headerStyle: { textAlign: 'center' },
      id: 'deliveryMethod',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.classes.compositeLabelCenter}>
            {row?.deliveryMethod &&
              <div
                className={classes.classes.labelDeliveryMethod}
              >
                {intl.formatMessage({ id: `enum.delivery-method.${row.deliveryMethod}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.order.header.modified-on' }),
      id: 'registeredOn',
      sortable: true,
      sortColumn: EnumOrderSortField.MODIFIED_ON,
      cell: (
        rowIndex: number,
        column: Column<Order, EnumOrderSortField>,
        row: Order,
        handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => (
        <FormattedTime value={row?.statusUpdatedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
  },
  rowIconAction: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  link: {
    color: 'inherit',
  },
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  compositeLabelCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compositeLabelJustified: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compositeLabelLeft: {
    display: 'flex',
    alignItems: 'baseline',
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
  labelOrderStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center'
  },
  labelDeliveryMethod: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 120,
    justifyContent: 'center'
  },
  labelPaymentMethod: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 100,
    justifyContent: 'center'
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
});

const statusToBackGround = (status: EnumOrderStatus): string => {
  switch (status) {
    case EnumOrderStatus.SUCCEEDED:
      return '#2E7D32';
    case EnumOrderStatus.CANCELLED:
      return '#f44336';
    case EnumOrderStatus.REFUNDED:
      return '#616161';
  }
  return '#0277BD';
};

interface OrderTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumOrderSortField>[]
  ) => Promise<PageResult<Order> | null>,
  query: OrderQuery,
  result: PageResult<Order> | null,
  pagination: PageRequest,
  selected: Order[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumOrderSortField>[]) => void,
  addToSelection: (rows: Order[]) => void,
  removeFromSelection: (rows: Order[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumOrderSortField>[];
  viewOrderTimeline: (key: string) => void;
  viewProcessInstance: (processInstance: string) => void;
  loading?: boolean;
}

class OrderTable extends React.Component<OrderTableProps> {

  constructor(props: OrderTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<Order, EnumOrderSortField>, row: Order): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CopyReferenceNumber:
          const element: HTMLInputElement = document.getElementById('copy-to-clipboard') as HTMLInputElement;

          if (element && document.queryCommandSupported(COPY)) {
            element.focus();
            element.value = row.referenceNumber;
            element.select();
            document.execCommand(COPY);
          }
          break;
        case EnumAction.ViewTimeline:
          this.props.addToSelection([row]);

          this.props.viewOrderTimeline(row.key);
          break;

        case EnumAction.ViewProcessInstance:
          if (row.payIn?.processInstance) {
            this.props.viewProcessInstance(row.payIn?.processInstance);
          }
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
      <>
        <MaterialTable<Order, EnumOrderSortField>
          intl={intl}
          columns={orderColumns(intl, { classes })}
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
const styledComponent = withStyles(styles)(OrderTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;