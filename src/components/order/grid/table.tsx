import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

// Icons
import Icon from '@mdi/react';
import {
  mdiContentCopy,
  mdiDatabaseCogOutline,
  mdiMessageTextOutline,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumKycLevel, EnumMangopayUserType, CustomerIndividual, CustomerProfessional } from 'model/account-marketplace';
import { EnumOrderSortField, EnumOrderStatus, EnumBillingViewMode, Order, OrderQuery } from 'model/order';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyReferenceNumber = 'copy-reference-number',
  SendMessage = 'send-message',
  ViewProcessInstance = 'view-process-instance',
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

function orderColumns(intl: IntlShape, props: OrderTableProps): Column<Order, EnumOrderSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.order.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelLeft}>
          <Tooltip title={intl.formatMessage({ id: 'billing.order.tooltip.send-message' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.SendMessage, rowIndex, column, row) : null}
            >
              <Icon path={mdiMessageTextOutline} className={classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          {row.payIn?.processInstance &&
            <Tooltip title={intl.formatMessage({ id: 'billing.order.tooltip.view-process-instance' })}>
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
      header: intl.formatMessage({ id: 'billing.order.header.reference-number' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumOrderSortField.REFERENCE_NUMBER,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelJustified}>
          <Link to={buildPath(DynamicRoutes.OrderTimeline, [row.key])} className={classes.link}>
            {row.referenceNumber}
          </Link>
          {row.referenceNumber &&
            <i
              onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
            >
              <Icon path={mdiContentCopy} className={classes.rowIconAction} />
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
      width: 200,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.compositeLabelCenter}>
            {row?.status &&
              <div
                className={classes.labelOrderStatus}
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
      hidden: props.mode === EnumBillingViewMode.CONSUMER,
      cell: (
        rowIndex: number, column: Column<Order, EnumOrderSortField>, row: Order, handleAction?: cellActionHandler<Order, EnumOrderSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.consumer &&
              <div className={classes.compositeLabel}>
                <div
                  className={row?.consumer?.kycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
                >
                  <div>{row.consumer?.kycLevel}</div>
                </div>
                <div className={classes.consumer}>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.consumer!.key])} className={classes.link}>
                    {getCustomerName(row)}
                  </Link>
                  <Typography variant="caption">{row.consumer!.email}</Typography>
                </div>
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
          <div className={classes.compositeLabelCenter}>
            {row?.paymentMethod &&
              <div
                className={classes.labelPaymentMethod}
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
          <div className={classes.compositeLabelCenter}>
            {row?.deliveryMethod &&
              <div
                className={classes.labelDeliveryMethod}
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
        <DateTime value={row?.statusUpdatedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
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
  consumer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
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
    justifyContent: 'center',
    width: '100%',
    maxWidth: 180,
    textAlign: 'center',
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
      return '#FBC02D';
  }
  return '#616161';
};

interface OrderTableProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  loading?: boolean;
  mode: EnumBillingViewMode;
  pagination: PageRequest;
  query: OrderQuery;
  result: PageResult<Order> | null;
  selected: Order[];
  sorting: Sorting<EnumOrderSortField>[];
  addToSelection?: (rows: Order[]) => void;
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumOrderSortField>[]
  ) => Promise<PageResult<Order> | null>;
  removeFromSelection?: (rows: Order[]) => void;
  resetSelection?: () => void;
  sendMessage: (row: Order) => void;
  setPager: (page: number, size: number) => void;
  setSorting: (sorting: Sorting<EnumOrderSortField>[]) => void;
  viewProcessInstance: (processInstance: string) => void;
}

class OrderTable extends React.Component<OrderTableProps> {

  constructor(props: OrderTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  static defaultProps = {
    mode: EnumBillingViewMode.DEFAULT,
  }

  handleAction(action: string, index: number, column: Column<Order, EnumOrderSortField>, row: Order): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CopyReferenceNumber:
          const value = row.referenceNumber;

          copyToClipboard(value);

          break;

        case EnumAction.SendMessage:
          this.props.sendMessage(row);
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
    const { intl, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <>
        <MaterialTable<Order, EnumOrderSortField>
          intl={intl}
          columns={orderColumns(intl, this.props)}
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