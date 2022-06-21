import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime, FormattedNumber } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

// Icons
import Icon from '@mdi/react';
import {
  mdiClockFast,
  mdiContentCopy,
  mdiDatabaseCogOutline,
  mdiPackageVariantClosed,
  mdiWalletPlusOutline,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumKycLevel, EnumMangopayUserType, CustomerIndividual, CustomerProfessional } from 'model/account-marketplace';
import { EnumBillingViewMode, EnumPayInItemType, EnumPayInSortField, EnumTransactionStatus, PayIn, PayInQuery } from 'model/order';
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumPaymentMethod } from 'model/enum';

// Helper methods
import { mapPaymentMethodToIcon } from 'components/billing/common';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyReferenceNumber = 'copy-reference-number',
  TransferFunds = 'transfer-funds',
  ViewProcessInstance = 'view-process-instance',
};

const getCustomerName = (payin: PayIn): string => {
  if (payin?.consumer && payin?.consumer?.type === EnumMangopayUserType.INDIVIDUAL) {
    const c = payin?.consumer as CustomerIndividual;
    return [c.firstName, c.lastName].join(' ');
  }
  if (payin?.consumer && payin?.consumer?.type === EnumMangopayUserType.PROFESSIONAL) {
    const c = payin?.consumer as CustomerProfessional;
    return c.name;
  }
  return '';
}

function mapStatusToColor(payin: PayIn) {
  switch (payin.status) {
    case EnumTransactionStatus.FAILED:
      return '#f44336';
    case EnumTransactionStatus.SUCCEEDED:
      return '#4CAF50';
    default:
      return '#757575';
  }
}

function renderItems(payin: PayIn, props: PayInTableProps, intl: IntlShape) {
  const items = payin.items;
  let orderCount = 0, subCount = 0;

  if (!items) {
    return null;
  }

  items.forEach((i) => {
    switch (i.type) {
      case EnumPayInItemType.ORDER:
        orderCount++;
        break;
      case EnumPayInItemType.SUBSCRIPTION_BILLING:
        subCount++;
        break;
    }
  });

  return (
    <>
      {orderCount !== 0 &&
        <Chip
          icon={<Icon path={mdiPackageVariantClosed} size="1.5rem" />}
          label={intl.formatMessage({ id: `enum.payin-item-type.${EnumPayInItemType.ORDER}` })}
          color="primary"
          variant="outlined"
        />
      }
      {subCount !== 0 &&
        <Chip
          icon={<Icon path={mdiClockFast} size="1.5rem" />}
          label={`${intl.formatMessage({ id: `enum.payin-item-type.${EnumPayInItemType.SUBSCRIPTION_BILLING}` })} ${subCount}`}
          color="primary"
          variant="outlined"
        />
      }
    </>
  );
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
    marginTop: 2,
    cursor: 'pointer',
  },
  rowIconActionDisabled: {
    width: 18,
    marginRight: 8,
    opacity: 0.5,
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
  labelPayInContainer: {
    display: 'flex',
  },
  labelPayInStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  labelPayInMessage: {
    color: '#424242',
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
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
  statusLabelText: {
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
  alightRight: {
    textAlign: 'right',
  }
});

function hasTransfer(row: PayIn): boolean {
  if (!row.items) {
    return true;
  }

  for (const item of row.items!) {
    if (item.transfer) {
      return true;
    }
  }

  return false;
}

function payinColumns(intl: IntlShape, props: PayInTableProps): Column<PayIn, EnumPayInSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.payin.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelLeft}>
          {row?.processInstance &&
            <Tooltip title={intl.formatMessage({ id: 'billing.order.tooltip.view-process-instance' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.ViewProcessInstance, rowIndex, column, row) : null}
              >
                <Icon path={mdiDatabaseCogOutline} className={classes.rowIconAction} />
              </i>
            </Tooltip>
          }
          {
            props.createTransfer &&
            row.status === EnumTransactionStatus.SUCCEEDED &&
            !hasTransfer(row) && row.paymentMethod !== EnumPaymentMethod.FREE &&
            <Tooltip title={intl.formatMessage({ id: 'billing.payin.tooltip.transfer-funds' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.TransferFunds, rowIndex, column, row) : null}
              >
                <Icon path={mdiWalletPlusOutline} className={classes.rowIconAction} />
              </i>
            </Tooltip>
          }
          {
            props.createTransfer &&
            row.status === EnumTransactionStatus.SUCCEEDED &&
            hasTransfer(row) &&
            <Tooltip title={intl.formatMessage({ id: 'billing.payin.tooltip.transfer-funds-completed' })}>
              <i>
                <Icon path={mdiWalletPlusOutline} className={classes.rowIconActionDisabled} />
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
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => {
        return (
          <Avatar style={{ background: mapStatusToColor(row) }}>
            {mapPaymentMethodToIcon(row)}
          </Avatar>
        );
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.reference-number' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumPayInSortField.REFERENCE_NUMBER,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelJustified}>
          <Link to={buildPath(DynamicRoutes.PayInView, [row.key])} className={classes.link}>
            {row.referenceNumber}
          </Link>
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.rowIconAction} />
          </i>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumPayInSortField.STATUS,
      width: 350,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.labelPayInContainer}>
            {row?.status &&
              <div
                className={classes.labelPayInStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.transaction-status.${row.status}` })}
              </div>
            }
            {row?.status === EnumTransactionStatus.FAILED &&
              <div className={classes.labelPayInMessage}>
                <Typography variant="caption">
                  {`${row?.providerResultCode} - ${row?.providerResultMessage}`}
                </Typography>
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.consumer' }),
      id: 'consumer',
      sortable: false,
      hidden: props.mode === EnumBillingViewMode.CONSUMER,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.consumer &&
              <div className={classes.compositeLabel}>
                <div
                  className={row?.consumer?.kycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
                >
                  <div className={classes.statusLabelText}>{row.consumer?.kycLevel}</div>
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
      header: intl.formatMessage({ id: 'billing.payin.header.type' }),
      id: 'type',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => {
        return renderItems(row, props, intl);
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.total-price' }),
      id: 'totalPrice',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumPayInSortField.TOTAL_PRICE,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.totalPrice} style={'currency'} currency={row.currency} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.modified-on' }),
      id: 'registeredOn',
      sortable: true,
      sortColumn: EnumPayInSortField.MODIFIED_ON,
      cell: (
        rowIndex: number,
        column: Column<PayIn, EnumPayInSortField>,
        row: PayIn,
        handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => (
        <FormattedTime value={row?.statusUpdatedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const statusToBackGround = (status: EnumTransactionStatus): string => {
  switch (status) {
    case EnumTransactionStatus.SUCCEEDED:
      return '#4CAF50';
    case EnumTransactionStatus.FAILED:
      return '#f44336';
  }
  return '#0277BD';
};

interface PayInTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  loading?: boolean;
  mode: EnumBillingViewMode;
  pagination: PageRequest,
  query: PayInQuery,
  result: PageResult<PayIn> | null,
  selected: PayIn[],
  sorting: Sorting<EnumPayInSortField>[];
  addToSelection?: (rows: PayIn[]) => void,
  createTransfer?: (payIn: PayIn) => void;
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumPayInSortField>[]
  ) => Promise<PageResult<PayIn> | null>,
  removeFromSelection?: (rows: PayIn[]) => void,
  resetSelection?: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumPayInSortField>[]) => void,
  viewPayIn: (key: string) => void;
  viewProcessInstance: (processInstance: string) => void;
}

class PayInTable extends React.Component<PayInTableProps> {

  constructor(props: PayInTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  static defaultProps = {
    mode: EnumBillingViewMode.DEFAULT,
  }

  handleAction(action: string, index: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CopyReferenceNumber:
          const value = row.referenceNumber;

          copyToClipboard(value);
          break;

        case EnumAction.TransferFunds:
          if (this.props.createTransfer) {
            this.props.createTransfer(row);
          }
          break;

        case EnumAction.ViewProcessInstance:
          if (row?.processInstance) {
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
        <MaterialTable<PayIn, EnumPayInSortField>
          intl={intl}
          columns={payinColumns(intl, this.props)}
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
const styledComponent = withStyles(styles)(PayInTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;