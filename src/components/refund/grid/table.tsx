import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedNumber } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

// Icons
import Icon from '@mdi/react';
import {
  mdiContentCopy,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumKycLevel, CustomerProfessional, Customer, EnumMangopayUserType, CustomerIndividual } from 'model/account-marketplace';
import { EnumRefundSortField, EnumRefundReasonType, Refund, RefundQuery } from 'model/refund';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';
import { EnumTransactionType } from 'model/transaction';

enum EnumAction {
  CopyReferenceNumber = 'copy-bankwire-ref',
  SendMessage = 'send-message',
  ViewProcessInstance = 'view-process-instance',
};

const getCustomerName = (customer?: Customer): string => {
  if (!customer) {
    return '';
  }
  if (customer.type === EnumMangopayUserType.INDIVIDUAL) {
    const c = customer as CustomerIndividual;
    return [c.firstName, c.lastName].join(' ');
  }
  if (customer.type === EnumMangopayUserType.PROFESSIONAL) {
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
  customer: {
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
  labelRefundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  labelRefundStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center'
  },
  labelRefundMessage: {
    color: '#424242',
    marginTop: theme.spacing(0.5),
  },
  alightRight: {
    textAlign: 'right',
  }
});

function getTransactionLink(row: Refund, props: RefundTableProps): React.ReactNode {
  const { classes } = props;

  switch (row.initialTransactionType) {
    case EnumTransactionType.PAYIN:
    case EnumTransactionType.TRANSFER:
      return (
        <Link to={buildPath(DynamicRoutes.PayInView, [row.initialTransactionKey])} className={classes.link}>
          {row.referenceNumber}
        </Link>
      );

    case EnumTransactionType.PAYOUT:
      return (
        <Link to={buildPath(DynamicRoutes.PayOutView, [row.key])} className={classes.link}>
          {row.referenceNumber}
        </Link>
      );

    default:
      return null;
  }

}

function refundColumns(intl: IntlShape, props: RefundTableProps): Column<Refund, EnumRefundSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.refund.header.transaction-ref' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumRefundSortField.REFERENCE_NUMBER,
      cell: (
        rowIndex: number, column: Column<Refund, EnumRefundSortField>, row: Refund, handleAction?: cellActionHandler<Refund, EnumRefundSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelJustified}>
          {getTransactionLink(row, props)}
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.rowIconAction} />
          </i>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.refund.header.reason' }),
      id: 'reason',
      sortable: true,
      sortColumn: EnumRefundSortField.REASON_TYPE,
      cell: (
        rowIndex: number, column: Column<Refund, EnumRefundSortField>, row: Refund, handleAction?: cellActionHandler<Refund, EnumRefundSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.labelRefundContainer}>
            {row.refundReasonType &&
              <div
                className={classes.labelRefundStatus}
                style={{ background: statusToBackGround(row.refundReasonType) }}
              >
                {intl.formatMessage({ id: `enum.refund-reason-type.${row.refundReasonType}` })}
              </div>
            }
            {row.refundReasonMessage &&
              <div className={classes.labelRefundMessage}>
                {row.refundReasonMessage}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.refund.header.consumer' }),
      id: 'consumer',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<Refund, EnumRefundSortField>, row: Refund, handleAction?: cellActionHandler<Refund, EnumRefundSortField>
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
                <div className={classes.customer}>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.consumer!.key])} className={classes.link}>
                    {getCustomerName(row.consumer)}
                  </Link>
                  <Typography variant="caption">{row.consumer!.email}</Typography>
                </div>
              </div>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.refund.header.provider' }),
      id: 'provider',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<Refund, EnumRefundSortField>, row: Refund, handleAction?: cellActionHandler<Refund, EnumRefundSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.provider &&
              <div className={classes.compositeLabel}>
                <div
                  className={row?.provider?.kycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
                >
                  <div>{row.provider?.kycLevel}</div>
                </div>
                <div className={classes.customer}>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.provider!.key])} className={classes.link}>
                    {getCustomerName(row.provider)}
                  </Link>
                  <Typography variant="caption">{row.provider!.email}</Typography>
                </div>
              </div>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.refund.header.funds' }),
      id: 'creditedFunds',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumRefundSortField.CREDITED_FUNDS,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<Refund, EnumRefundSortField>, row: Refund, handleAction?: cellActionHandler<Refund, EnumRefundSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.creditedFunds} style={'currency'} currency={row.currency} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.refund.header.executed-on' }),
      id: 'executedOn',
      sortable: true,
      sortColumn: EnumRefundSortField.EXECUTED_ON,
      cell: (
        rowIndex: number,
        column: Column<Refund, EnumRefundSortField>,
        row: Refund,
        handleAction?: cellActionHandler<Refund, EnumRefundSortField>
      ): React.ReactNode => (
        <DateTime value={row.executionDate?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const statusToBackGround = (status: EnumRefundReasonType): string => {
  return '#0277BD';
};

interface RefundTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  loading?: boolean;
  pagination: PageRequest,
  query: RefundQuery,
  result: PageResult<Refund> | null,
  selected: Refund[],
  sorting: Sorting<EnumRefundSortField>[];
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumRefundSortField>[]
  ) => Promise<PageResult<Refund> | null>,
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumRefundSortField>[]) => void,
}

class RefundTable extends React.Component<RefundTableProps> {

  constructor(props: RefundTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<Refund, EnumRefundSortField>, row: Refund): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CopyReferenceNumber:
          const value = row.referenceNumber;

          copyToClipboard(value);
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
        <MaterialTable<Refund, EnumRefundSortField>
          intl={intl}
          columns={refundColumns(intl, this.props)}
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
const styledComponent = withStyles(styles)(RefundTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;