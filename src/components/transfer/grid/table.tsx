import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedNumber, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

// Icons
import Icon from '@mdi/react';
import {
  mdiContentCopy,
  mdiTransferRight,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import {
  EnumPayInItemType,
  EnumTransferSortField,
  EnumTransactionStatus,
  PayIn,
  PayInItem,
  OrderPayInItem,
  TransferQuery
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

function getPayIn(item: PayInItem): PayIn | null {
  switch (item.type) {
    case EnumPayInItemType.ORDER:
      return (item as OrderPayInItem).order?.payIn || null;
    case EnumPayInItemType.SUBSCRIPTION_BILLING: {
      return null;
    }
  }
}

function getConsumer(item: PayInItem): Customer | null {
  switch (item.type) {
    case EnumPayInItemType.ORDER:
      return (item as OrderPayInItem).order?.consumer || null;
    case EnumPayInItemType.SUBSCRIPTION_BILLING: {
      return null;
    }
  }
}

function getProvider(item: PayInItem): Customer | null {
  switch (item.type) {
    case EnumPayInItemType.ORDER:
      // Orders contain only a single item
      return (item as OrderPayInItem).order?.items![0].provider || null;
    case EnumPayInItemType.SUBSCRIPTION_BILLING: {
      return null;
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
  labelDeliveryMethod: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 120,
    justifyContent: 'center'
  },
  labelCustomer: {
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

function transferColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<PayInItem, EnumTransferSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'billing.transfer.header.actions' }),
      id: 'actions',
      width: 80,
      hidden: true,
      cell: (
        rowIndex: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem, handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
      ): React.ReactNode => (
        <div className={classes.classes.compositeLabelLeft}>

        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.reference-number' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumTransferSortField.REFERENCE_NUMBER,
      cell: (
        rowIndex: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem, handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
      ): React.ReactNode => {
        const payIn = getPayIn(row);
        return (
          <div className={classes.classes.compositeLabelJustified}>
            <Link to={buildPath(DynamicRoutes.PayInView, [payIn?.key || ''])} className={classes.classes.link}>
              {payIn?.referenceNumber || 'Not Implemented'}
            </Link>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
            >
              <Icon path={mdiContentCopy} className={classes.classes.rowIconAction} />
            </i>
          </div>
        );
      }
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.customer' }),
      id: 'customer',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem, handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
      ): React.ReactNode => {
        const consumer = getConsumer(row);
        const provider = getProvider(row);
        const consumerName = consumer ? getCustomerName(consumer) : '';
        const providerName = provider ? getCustomerName(provider) : '';

        return (
          <div className={classes.classes.compositeLabel}>
            <div className={classes.classes.labelPayInContainer}>
              <div className={classes.classes.labelCustomer}>
                {consumerName}
              </div>
            </div>
            <Icon path={mdiTransferRight} size={'1.2rem'} style={{ margin: '0 10' }} />
            <div className={classes.classes.labelPayInContainer}>
              <div className={classes.classes.labelCustomer}>
                {providerName}
              </div>
            </div>
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.total-price' }),
      id: 'totalPrice',
      headerStyle: { textAlign: 'right' },
      sortable: false,
      className: classes.classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem, handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
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
      className: classes.classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem, handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
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
      className: classes.classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem, handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
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
        column: Column<PayInItem, EnumTransferSortField>,
        row: PayInItem,
        handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
      ): React.ReactNode => (
        row?.transfer?.executedOn ?
          <FormattedTime value={row?.transfer?.executedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
          :
          null
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.transfer.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumTransferSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem, handleAction?: cellActionHandler<PayInItem, EnumTransferSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.classes.labelPayInContainer}>
            {row.transfer?.status &&
              <div
                className={classes.classes.labelPayInStatus}
                style={{ background: statusToBackGround(row.transfer!.status) }}
              >
                {intl.formatMessage({ id: `enum.transaction-status.${row.transfer!.status}` })}
              </div>
            }
            {row.transfer?.status === EnumTransactionStatus.FAILED &&
              <div className={classes.classes.labelPayInMessage}>
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
  ) => Promise<PageResult<PayInItem> | null>,
  query: TransferQuery,
  result: PageResult<PayInItem> | null,
  pagination: PageRequest,
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumTransferSortField>[]) => void,
  sorting: Sorting<EnumTransferSortField>[];
  loading?: boolean;
}

class AccountTable extends React.Component<TransferTableProps> {

  constructor(props: TransferTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<PayInItem, EnumTransferSortField>, row: PayInItem): void {
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
    const { intl, classes, result, setPager, pagination, find, sorting, setSorting, loading } = this.props;

    return (
      <>
        <MaterialTable<PayInItem, EnumTransferSortField>
          intl={intl}
          columns={transferColumns(intl, { classes })}
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
const styledComponent = withStyles(styles)(AccountTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;