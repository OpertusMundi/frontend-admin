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
import { EnumKycLevel, CustomerProfessional, EnumMangopayUserType, CustomerIndividual } from 'model/account-marketplace';
import { EnumDisputeSortField, EnumDisputeStatus, Dispute, DisputeQuery } from 'model/dispute';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyReferenceNumber = 'copy-bankwire-ref',
  SendMessage = 'send-message',
  ViewProcessInstance = 'view-process-instance',
};

const getCustomerName = (dispute: Dispute): string => {
  const consumer = dispute?.payin?.consumer;

  if (consumer && consumer.type === EnumMangopayUserType.INDIVIDUAL) {
    const c = consumer as CustomerIndividual;
    return [c.firstName, c.lastName].join(' ');
  }
  if (consumer && consumer.type === EnumMangopayUserType.PROFESSIONAL) {
    const c = consumer as CustomerProfessional;
    return c.name;
  }
  return '';
}

const styles = (theme: Theme) => createStyles({
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
  labelDisputeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  labelDisputeStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center'
  },
  labelDisputeMessage: {
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
  consumer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
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

function disputeColumns(intl: IntlShape, props: DisputeTableProps): Column<Dispute, EnumDisputeSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.dispute.header.reference-number' }),
      id: 'referenceNumber',
      width: 180,
      sortable: true,
      sortColumn: EnumDisputeSortField.REFERENCE_NUMBER,
      cell: (
        rowIndex: number, column: Column<Dispute, EnumDisputeSortField>, row: Dispute, handleAction?: cellActionHandler<Dispute, EnumDisputeSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabelJustified}>
          <Link to={buildPath(DynamicRoutes.PayInView, [row.initialTransactionKey])} className={classes.link}>
            {row.initialTransactionRefNumber}
          </Link>
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.rowIconAction} />
          </i>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.dispute.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumDisputeSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<Dispute, EnumDisputeSortField>, row: Dispute, handleAction?: cellActionHandler<Dispute, EnumDisputeSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.labelDisputeContainer}>
            {row?.status &&
              <div
                className={classes.labelDisputeStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.dispute-status.${row.status}` })}
              </div>
            }
            <div className={classes.labelDisputeMessage}>
              {`${row?.reasonType} - ${row?.reasonMessage}`}
            </div>
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.dispute.header.consumer' }),
      id: 'consumer',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<Dispute, EnumDisputeSortField>, row: Dispute, handleAction?: cellActionHandler<Dispute, EnumDisputeSortField>
      ): React.ReactNode => {
        const consumer = row.payin.consumer;
        return (
          <>
            {consumer &&
              <div className={classes.compositeLabel}>
                <div
                  className={consumer.kycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
                >
                  <div className={classes.statusLabelText}>{consumer.kycLevel}</div>
                </div>
                <div className={classes.consumer}>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [consumer.key])} className={classes.link}>
                    {getCustomerName(row)}
                  </Link>
                  <Typography variant="caption">{consumer.email}</Typography>
                </div>
              </div>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.dispute.header.disputed-funds' }),
      id: 'disputedFunds',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumDisputeSortField.DISPUTED_FUNDS,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<Dispute, EnumDisputeSortField>, row: Dispute, handleAction?: cellActionHandler<Dispute, EnumDisputeSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.disputedFunds} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.dispute.header.created-on' }),
      id: 'creationDate',
      sortable: true,
      sortColumn: EnumDisputeSortField.CREATED_ON,
      cell: (
        rowIndex: number,
        column: Column<Dispute, EnumDisputeSortField>,
        row: Dispute,
        handleAction?: cellActionHandler<Dispute, EnumDisputeSortField>
      ): React.ReactNode => (
        <DateTime value={row.creationDate?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.dispute.header.contest-deadline-on' }),
      id: 'contestDeadlineDate',
      sortable: true,
      sortColumn: EnumDisputeSortField.CONTEST_DEADLINE_ON,
      cell: (
        rowIndex: number,
        column: Column<Dispute, EnumDisputeSortField>,
        row: Dispute,
        handleAction?: cellActionHandler<Dispute, EnumDisputeSortField>
      ): React.ReactNode => (
        <DateTime value={row?.contestDeadlineDate?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const statusToBackGround = (status: EnumDisputeStatus): string => {
  return '#0277BD';
};

interface DisputeTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  loading?: boolean;
  pagination: PageRequest,
  query: DisputeQuery,
  result: PageResult<Dispute> | null,
  selected: Dispute[],
  sorting: Sorting<EnumDisputeSortField>[];
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumDisputeSortField>[]
  ) => Promise<PageResult<Dispute> | null>,
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumDisputeSortField>[]) => void,
}

class DisputeTable extends React.Component<DisputeTableProps> {

  constructor(props: DisputeTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<Dispute, EnumDisputeSortField>, row: Dispute): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CopyReferenceNumber:
          const value = row.payin.referenceNumber;

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
        <MaterialTable<Dispute, EnumDisputeSortField>
          intl={intl}
          columns={disputeColumns(intl, this.props)}
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
const styledComponent = withStyles(styles)(DisputeTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;