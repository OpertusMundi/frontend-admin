import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime, FormattedNumber } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

// Icons
import Icon from '@mdi/react';
import {
  mdiContentCopy,
  mdiTimelineClockOutline,
  mdiDatabaseCogOutline,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumKycLevel, CustomerProfessional } from 'model/account-marketplace';
import { EnumPayOutSortField, EnumTransactionStatus, PayOut, PayOutQuery } from 'model/order';
import { PageRequest, PageResult, Sorting } from 'model/response';

const COPY = 'copy';

enum EnumAction {
  CopyReferenceNumber = 'copy-bankwire-ref',
  View = 'view',
  ViewProcessInstance = 'view-process-instance',
};

const getCustomerName = (payout: PayOut): string => {
  if (payout?.provider) {
    const c = payout?.provider as CustomerProfessional;
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
  labelPayOutContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  labelPayOutStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center'
  },
  labelPayOutMessage: {
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

function payoutColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<PayOut, EnumPayOutSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'billing.payout.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<PayOut, EnumPayOutSortField>, row: PayOut, handleAction?: cellActionHandler<PayOut, EnumPayOutSortField>
      ): React.ReactNode => (
        <div className={classes.classes.compositeLabelLeft}>
          <Tooltip title={intl.formatMessage({ id: 'billing.payout.tooltip.view-details' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.View, rowIndex, column, row) : null}
            >
              <Icon path={mdiTimelineClockOutline} className={classes.classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          {row.processInstance &&
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
      header: intl.formatMessage({ id: 'billing.payout.header.bankwire-ref' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumPayOutSortField.BANKWIRE_REF,
      cell: (
        rowIndex: number, column: Column<PayOut, EnumPayOutSortField>, row: PayOut, handleAction?: cellActionHandler<PayOut, EnumPayOutSortField>
      ): React.ReactNode => (
        <div className={classes.classes.compositeLabelJustified}>
          <Link to={buildPath(DynamicRoutes.PayOutView, [row.key])} className={classes.classes.link}>
            {row.bankwireRef}
          </Link>
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.classes.rowIconAction} />
          </i>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.payout.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumPayOutSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<PayOut, EnumPayOutSortField>, row: PayOut, handleAction?: cellActionHandler<PayOut, EnumPayOutSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.classes.labelPayOutContainer}>
            {row?.status &&
              <div
                className={classes.classes.labelPayOutStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.transaction-status.${row.status}` })}
              </div>
            }
            {row?.status === EnumTransactionStatus.FAILED &&
              <div className={classes.classes.labelPayOutMessage}>
                {`${row?.providerResultCode} - ${row?.providerResultMessage}`}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payout.header.provider' }),
      id: 'provider',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<PayOut, EnumPayOutSortField>, row: PayOut, handleAction?: cellActionHandler<PayOut, EnumPayOutSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.provider &&
              <div className={classes.classes.compositeLabel}>
                <div
                  className={row?.provider?.kycLevel === EnumKycLevel.LIGHT ? classes.classes.statusLabelWarning : classes.classes.statusLabel}
                >
                  <div className={classes.classes.statusLabelText}>{row.provider?.kycLevel}</div>
                </div>
                <div className={classes.classes.marginRight}>{getCustomerName(row)}</div>
              </div>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payout.header.funds' }),
      id: 'debitedFunds',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumPayOutSortField.FUNDS,
      className: classes.classes.alightRight,
      cell: (
        rowIndex: number, column: Column<PayOut, EnumPayOutSortField>, row: PayOut, handleAction?: cellActionHandler<PayOut, EnumPayOutSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.debitedFunds} style={'currency'} currency={row.currency} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payout.header.modified-on' }),
      id: 'registeredOn',
      sortable: true,
      sortColumn: EnumPayOutSortField.MODIFIED_ON,
      cell: (
        rowIndex: number,
        column: Column<PayOut, EnumPayOutSortField>,
        row: PayOut,
        handleAction?: cellActionHandler<PayOut, EnumPayOutSortField>
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

interface PayOutTableProps extends WithStyles<typeof styles> {
  createTransfer: (key: string) => void;
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumPayOutSortField>[]
  ) => Promise<PageResult<PayOut> | null>,
  query: PayOutQuery,
  result: PageResult<PayOut> | null,
  pagination: PageRequest,
  selected: PayOut[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumPayOutSortField>[]) => void,
  addToSelection: (rows: PayOut[]) => void,
  removeFromSelection: (rows: PayOut[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumPayOutSortField>[];
  viewPayOut: (key: string) => void;
  viewProcessInstance: (processInstance: string) => void;
  loading?: boolean;
}

class AccountTable extends React.Component<PayOutTableProps> {

  constructor(props: PayOutTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<PayOut, EnumPayOutSortField>, row: PayOut): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CopyReferenceNumber:
          const element: HTMLInputElement = document.getElementById('copy-to-clipboard') as HTMLInputElement;

          if (element && document.queryCommandSupported(COPY)) {
            element.focus();
            element.value = row.bankwireRef;
            element.select();
            document.execCommand(COPY);
          }
          break;
        case EnumAction.View:
          this.props.addToSelection([row]);

          this.props.viewPayOut(row.key);
          break;

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
    const { intl, classes, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <>
        <MaterialTable<PayOut, EnumPayOutSortField>
          intl={intl}
          columns={payoutColumns(intl, { classes })}
          rows={result ? result.items : []}
          pagination={{
            rowsPerPageOptions: [10, 20, 50],
            count: result ? result.count : 0,
            size: result ? result.pageRequest.size : 20,
            page: result ? result.pageRequest.page : 0,
          }}
          handleAction={this.handleAction}
          handleChangePage={(index: number) => {
            setPager(index, pagination.size);

            find();
          }}
          handleChangeRowsPerPage={(size: number) => {
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
const styledComponent = withStyles(styles)(AccountTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;