import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedNumber, FormattedMessage } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

// Icons
import Icon from '@mdi/react';
import {
  mdiAccountCogOutline,
  mdiArrowRightBoldOutline,
  mdiClockFast,
  mdiContentCopy,
  mdiPackageVariantClosed,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import {
  EnumPayInItemType,
  EnumTransferSortField,
  EnumTransactionStatus,
  PayIn,
  OrderPayInItem,
  TransferQuery,
  EnumBillingViewMode,
  ServiceBillingPayInItem,
  PayInItemType,
  EnumBillableServiceType
} from 'model/order';
import { PageRequest, PageResult, Sorting } from 'model/response';
import {
  EnumMangopayUserType,
  Customer,
  CustomerIndividual,
  CustomerProfessional,
} from 'model/account-marketplace';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyReferenceNumber = 'copy-reference-number',
};

function getPayIn(item: PayInItemType): PayIn | null {
  switch (item.type) {
    case EnumPayInItemType.ORDER:
      return (item as OrderPayInItem).order?.payIn || null;
    case EnumPayInItemType.SERVICE_BILLING: {
      return (item as ServiceBillingPayInItem).serviceBilling.payIn || null;
    }
  }
}

function getCustomerName(customer: Customer): string {
  if (customer && customer.type === EnumMangopayUserType.INDIVIDUAL) {
    const c = customer as CustomerIndividual;
    return [c.firstName, c.lastName].join(' ');
  }
  if (customer && customer.type === EnumMangopayUserType.PROFESSIONAL) {
    const c = customer as CustomerProfessional;
    return c.name;
  }
  return '';
}

const styles = (theme: Theme) => createStyles({
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
  compositeLabelJustified: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compositeLabelLeft: {
    display: 'flex',
    alignItems: 'baseline',
  },
  labelPayInContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  labelPayInStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center'
  },
  labelPayInMessage: {
    color: '#424242',
    marginTop: theme.spacing(0.5),
  },
  alightRight: {
    textAlign: 'right',
  }
});

function renderItemType(payin: PayInItemType, props: TransferTableProps, intl: IntlShape) {
  switch (payin.type) {
    case EnumPayInItemType.ORDER:
      return (
        <Chip
          icon={<Icon path={mdiPackageVariantClosed} size="1.5rem" />}
          label={intl.formatMessage({ id: `enum.payin-item-type.${EnumPayInItemType.ORDER}` })}
          color="primary"
          variant="outlined"
        />
      );

    case EnumPayInItemType.SERVICE_BILLING:
      const serviceBilling = payin.serviceBilling;
      return (
        <Chip
          icon={<Icon
            path={serviceBilling.type === EnumBillableServiceType.SUBSCRIPTION ? mdiClockFast : mdiAccountCogOutline}
            size="1.5rem"
          />}
          label={`${intl.formatMessage({ id: `enum.billable-service.${serviceBilling.type}` })}`}
          color="primary"
          variant="outlined"
        />
      );
  }
}

function transferColumns(props: TransferTableProps): Column<PayInItemType, EnumTransferSortField>[] {
  const { intl, classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.transfer.header.actions' }),
      id: 'actions',
      width: 80,
      hidden: true,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelLeft}>

        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.reference-number' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumTransferSortField.REFERENCE_NUMBER,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        const payIn = getPayIn(row);
        return (
          <div className={classes.compositeLabelJustified}>
            <Link to={buildPath(DynamicRoutes.PayInView, [payIn?.key || ''])} className={classes.link}>
              {payIn?.referenceNumber || 'Not Implemented'}
            </Link>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
            >
              <Icon path={mdiContentCopy} className={classes.rowIconAction} />
            </i>
          </div>
        );
      }
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.type' }),
      id: 'type',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        return renderItemType(row, props, intl);
      },
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.consumer' }),
      id: 'consumer',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        let link: React.ReactNode | null = null;
        switch (row.type) {
          case EnumPayInItemType.ORDER: {
            const consumer = row.order.consumer || null;
            const consumerName = consumer ? getCustomerName(consumer) : '';
            link = (
              <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [consumer!.key])} className={classes.link}>
                {consumerName}
              </Link>
            );
            break;
          }

          case EnumPayInItemType.SERVICE_BILLING: {
            const serviceBilling = row.serviceBilling;
            if (serviceBilling.subscription) {
              const consumer = serviceBilling.subscription.consumer || null;
              const consumerName = consumer ? getCustomerName(consumer) : '';
              link = (
                <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [consumer!.key])} className={classes.link}>
                  {consumerName}
                </Link>
              );
            }
            if (serviceBilling.userService) {
              const owner = serviceBilling.userService.owner;
              link = (
                <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [owner.key])} className={classes.link}>
                  {owner.username}
                </Link>
              );
            }
            break;
          }
        }

        return (
          <div className={classes.compositeLabel}>
            <div className={classes.labelPayInContainer}>
              {link}
            </div>
          </div>
        )
      },
    }, {
      header: '',
      id: 'separator',
      sortable: false,
      hidden: props.mode === EnumBillingViewMode.PROVIDER,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        return (<Icon path={mdiArrowRightBoldOutline} size={'1.2rem'} style={{ margin: '0 10' }} />);
      }
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.provider' }),
      id: 'provider',
      sortable: false,
      hidden: props.mode === EnumBillingViewMode.PROVIDER,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        let link: React.ReactNode | null = null;
        switch (row.type) {
          case EnumPayInItemType.ORDER:
            // Orders contain only a single item
            const provider = row.order.items![0].provider || null;
            const providerName = provider ? getCustomerName(provider) : '';
            link = (
              <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [provider!.key])} className={classes.link}>
                {providerName}
              </Link>
            );
            break;

          case EnumPayInItemType.SERVICE_BILLING: {
            const serviceBilling = row.serviceBilling;
            if (serviceBilling.subscription) {
              const provider = serviceBilling.subscription.provider || null;
              const providerName = provider ? getCustomerName(provider) : '';
              link = (
                <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [provider!.key])} className={classes.link}>
                  {providerName}
                </Link>
              );
            }
            if (serviceBilling.userService) {
              link = (
                <FormattedMessage id={'company.title'} />
              );
            }
            break;
          }
        }

        return (
          <div className={classes.compositeLabel}>
            <div className={classes.labelPayInContainer}>
              {link}
            </div>
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.total-price' }),
      id: 'totalPrice',
      headerStyle: { textAlign: 'right' },
      sortable: false,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row?.transfer!.creditedFunds + row?.transfer!.fees} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.credited-funds' }),
      id: 'creditedFunds',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumTransferSortField.FUNDS,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row?.transfer!.creditedFunds} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.fees' }),
      id: 'fees',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumTransferSortField.FEES,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row?.transfer!.fees} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.executed-on' }),
      id: 'executedOn',
      sortable: true,
      sortColumn: EnumTransferSortField.EXECUTED_ON,
      cell: (
        rowIndex: number,
        column: Column<PayInItemType, EnumTransferSortField>,
        row: PayInItemType,
        handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => (
        row?.transfer?.executionDate ?
          <DateTime value={row?.transfer?.executionDate?.toDate()} day='numeric' month='numeric' year='numeric' />
          :
          null
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumTransferSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType, handleAction?: cellActionHandler<PayInItemType, EnumTransferSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.labelPayInContainer}>
            {row.transfer?.transactionStatus &&
              <div
                className={classes.labelPayInStatus}
                style={{ background: statusToBackGround(row.transfer!.transactionStatus) }}
              >
                {intl.formatMessage({ id: `enum.transaction-status.${row.transfer!.transactionStatus}` })}
              </div>
            }
            {row.transfer?.transactionStatus === EnumTransactionStatus.FAILED &&
              <div className={classes.labelPayInMessage}>
                {`${row?.transfer?.resultCode} - ${row?.transfer?.resultMessage}`}
              </div>
            }
          </div>
        )
      },
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

interface TransferTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumTransferSortField>[]
  ) => Promise<PageResult<PayInItemType> | null>,
  query: TransferQuery,
  result: PageResult<PayInItemType> | null,
  pagination: PageRequest,
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumTransferSortField>[]) => void,
  sorting: Sorting<EnumTransferSortField>[];
  loading?: boolean;
  mode?: EnumBillingViewMode;
}

class TransferTable extends React.Component<TransferTableProps> {

  constructor(props: TransferTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  static defaultProps = {
    mode: EnumBillingViewMode.DEFAULT,
  }

  handleAction(action: string, index: number, column: Column<PayInItemType, EnumTransferSortField>, row: PayInItemType): void {
    if (row) {
      switch (action) {
        case EnumAction.CopyReferenceNumber:
          const value = getPayIn(row)?.referenceNumber || '';

          copyToClipboard(value);
          break;

        default:
          // No action
          break;
      }
    }
  }

  render() {
    const { intl, result, setPager, pagination, find, sorting, setSorting, loading } = this.props;

    return (
      <>
        <MaterialTable<PayInItemType, EnumTransferSortField>
          intl={intl}
          columns={transferColumns(this.props)}
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
          selected={[]}
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
const styledComponent = withStyles(styles)(TransferTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;