import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime, FormattedNumber } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

// Icons
import Icon from '@mdi/react';
import {
  mdiBankTransfer,
  mdiClockFast,
  mdiContentCopy,
  mdiCreditCardOutline,
  mdiLink,
  mdiPackageVariantClosed,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumKycLevel, EnumMangopayUserType, CustomerIndividual, CustomerProfessional } from 'model/customer';
import { EnumPayInItemType, EnumPayInSortField, EnumTransactionStatus, PayIn, PayInQuery } from 'model/order';
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumPaymentMethod } from 'model/enum';

const COPY = 'copy';

enum EnumAction {
  CopyReferenceNumber = 'copy-reference-number',
  View = 'view',
};

const getCustomerName = (payin: PayIn): string => {
  if (payin.customer && payin.customer?.type === EnumMangopayUserType.INDIVIDUAL) {
    const c = payin.customer as CustomerIndividual;
    return [c.firstName, c.lastName].join(' ');
  }
  if (payin.customer && payin.customer?.type === EnumMangopayUserType.PROFESSIONAL) {
    const c = payin.customer as CustomerProfessional;
    return c.name;
  }
  return '';
}

function mapStatusToIcon(payin: PayIn) {
  switch (payin.paymentMethod) {
    case EnumPaymentMethod.BANKWIRE:
      return (<Icon path={mdiBankTransfer} size="1.5rem" />);
    case EnumPaymentMethod.CARD_DIRECT:
      return (<Icon path={mdiCreditCardOutline} size="1.5rem" />);
  }
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

function renderItems(payin: PayIn, classes: WithStyles<typeof styles>, intl: IntlShape) {
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

function payinColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<PayIn, EnumPayInSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'billing.payin.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => (
        <div className={classes.classes.compositeLabelLeft}>
          <Tooltip title={intl.formatMessage({ id: 'billing.payin.tooltip.view-details' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.View, rowIndex, column, row) : null}
            >
              <Icon path={mdiLink} className={classes.classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
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
            {mapStatusToIcon(row)}
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
        <div className={classes.classes.compositeLabelJustified}>
          <Link to={buildPath(DynamicRoutes.PayInView, [row.key])} className={classes.classes.link}>
            {row.referenceNumber}
          </Link>
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyReferenceNumber, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.classes.rowIconAction} />
          </i>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumPayInSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.classes.labelPayInContainer}>
            {row?.status &&
              <div
                className={classes.classes.labelPayInStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.transaction-status.${row.status}` })}
              </div>
            }
            {row?.status === EnumTransactionStatus.FAILED &&
              <div className={classes.classes.labelPayInMessage}>
                {`${row?.providerResultCode} - ${row?.providerResultMessage}`}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.consumer' }),
      id: 'consumer',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn, handleAction?: cellActionHandler<PayIn, EnumPayInSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.customer &&
              <div className={classes.classes.compositeLabel}>
                <div
                  className={row?.customer.kycLevel === EnumKycLevel.LIGHT ? classes.classes.statusLabelWarning : classes.classes.statusLabel}
                >
                  <div className={classes.classes.statusLabelText}>{row.customer.kycLevel}</div>
                </div>
                <div className={classes.classes.marginRight}>{getCustomerName(row)}</div>
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
        return renderItems(row, classes, intl);
      },
    }, {
      header: intl.formatMessage({ id: 'billing.payin.header.total-price' }),
      id: 'totalPrice',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumPayInSortField.TOTAL_PRICE,
      className: classes.classes.alightRight,
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

interface FieldTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumPayInSortField>[]
  ) => Promise<PageResult<PayIn> | null>,
  query: PayInQuery,
  result: PageResult<PayIn> | null,
  pagination: PageRequest,
  selected: PayIn[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumPayInSortField>[]) => void,
  addToSelection: (rows: PayIn[]) => void,
  removeFromSelection: (rows: PayIn[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumPayInSortField>[];
  viewPayIn: (key: string) => void;
  loading?: boolean;
}

class AccountTable extends React.Component<FieldTableProps> {

  constructor(props: FieldTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<PayIn, EnumPayInSortField>, row: PayIn): void {
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
        case EnumAction.View:
          this.props.addToSelection([row]);

          this.props.viewPayIn(row.key);
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
        <MaterialTable<PayIn, EnumPayInSortField>
          intl={intl}
          columns={payinColumns(intl, { classes })}
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