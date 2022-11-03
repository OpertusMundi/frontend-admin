import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime, FormattedNumber, FormattedDate } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';


import Icon from '@mdi/react';
import {
  mdiAbacus,
  mdiBankTransferIn,
  mdiShoppingOutline,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, PageResult, Sorting } from 'model/response';
import {
  EnumKycLevel,
  CustomerProfessional,
  EnumCustomerType,
  EnumMangopayUserType,
} from 'model/account-marketplace';
import {
  EnumBillingViewMode,
  EnumSubscriptionBillingSortField,
  EnumSubscriptionBillingStatus,
  SubscriptionBilling, SubscriptionBillingQuery,
} from 'model/order';
import { ApplicationConfiguration } from 'model/configuration';

enum EnumAction {
  ViewAsset = 'view-asset',
  ViewPayIn = 'view-payin',
  ViewStatistics = 'view-statistics',
};

const getCustomerName = (record: SubscriptionBilling, type: EnumCustomerType): string => {
  if (type === EnumCustomerType.PROVIDER && record?.subscription?.provider) {
    const p = record.subscription?.provider as CustomerProfessional;
    return p.name;
  }
  if (type === EnumCustomerType.CONSUMER && record?.subscription?.consumer) {
    const c = record.subscription.consumer;

    switch (c.type) {
      case EnumMangopayUserType.INDIVIDUAL:
        return [c.firstName, c.lastName].join(' ');

      case EnumMangopayUserType.PROFESSIONAL:
        return c.name;
    }
  }

  return '';
}

const styles = (theme: Theme) => createStyles({
  alightRight: {
    textAlign: 'right',
  },
  assetDescription: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: 350,
  },
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  consumer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    color: 'inherit',
  },
  provider: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
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
  statusLabelText: {
  },
});

function subscriptionBillingColumns(intl: IntlShape, props: SubscriptionBillingTableProps): Column<SubscriptionBilling, EnumSubscriptionBillingSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Tooltip title={intl.formatMessage({ id: 'billing.subscription-billing.tooltip.view-statistics' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ViewStatistics, rowIndex, column, row) : null}
            >
              <Icon path={mdiAbacus} className={classes.rowIcon} />
            </i>
          </Tooltip>
          {row.subscription?.item && props.mode !== EnumBillingViewMode.CONSUMER &&
            <Tooltip title={intl.formatMessage({ id: 'billing.subscription-billing.tooltip.view-asset' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.ViewAsset, rowIndex, column, row) : null}
              >
                <Icon path={mdiShoppingOutline} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row?.payIn &&
            <Tooltip title={intl.formatMessage({ id: 'billing.subscription-billing.tooltip.view-payin' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.ViewPayIn, rowIndex, column, row) : null}
              >
                <Icon path={mdiBankTransferIn} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumSubscriptionBillingSortField.STATUS,
      width: 150,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.compositeLabel}>
            {row?.status &&
              <div
                className={classes.statusLabel}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.subscription-billing-status.${row.status}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.provider' }),
      id: 'provider',
      sortable: false,
      hidden: props.mode === EnumBillingViewMode.CONSUMER,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.subscription?.provider ? (
              <div className={classes.compositeLabel}>
                <div
                  className={row?.subscription?.provider?.kycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
                >
                  <div className={classes.statusLabelText}>{row.subscription?.provider?.kycLevel}</div>
                </div>
                <div className={classes.provider}>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.subscription.provider!.key])} className={classes.link}>
                    {getCustomerName(row, EnumCustomerType.PROVIDER)}
                  </Link>
                  <Typography variant="caption">{row.subscription.provider!.email}</Typography>
                </div>
              </div>
            ) : (<span>-</span>)
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.consumer' }),
      id: 'consumer',
      sortable: false,
      hidden: props.mode === EnumBillingViewMode.CONSUMER,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.subscription?.consumer ? (
              <div className={classes.compositeLabel}>
                <div
                  className={row?.subscription?.consumer?.kycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
                >
                  <div className={classes.statusLabelText}>{row.subscription?.consumer?.kycLevel}</div>
                </div>
                <div className={classes.consumer}>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.subscription?.consumer!.key])} className={classes.link}>
                    {getCustomerName(row, EnumCustomerType.CONSUMER)}
                  </Link>
                  <Typography variant="caption">{row.subscription?.consumer!.email}</Typography>
                </div>
              </div>
            ) : (<span>-</span>)
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.item' }),
      id: 'item',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => {

        return (
          <>
            {row.subscription?.item ? (
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body1">{row.subscription?.item!.title}</Typography>
                </Grid>
                <Grid item xs={12} className={classes.assetDescription} title={row.subscription?.item!.abstractText}>
                  <Typography variant="caption">{row.subscription?.item!.abstractText}</Typography>
                </Grid>
              </Grid>
            ) : <span>-</span>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.created-on' }),
      id: 'createdOn',
      sortable: true,
      sortColumn: EnumSubscriptionBillingSortField.CREATED_ON,
      width: 170,
      cell: (
        rowIndex: number,
        column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>,
        row: SubscriptionBilling,
        handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => (
        <FormattedTime value={row.createdOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.interval' }),
      id: 'interval',
      sortable: true,
      sortColumn: EnumSubscriptionBillingSortField.FROM_DATE,
      width: 200,
      cell: (
        rowIndex: number,
        column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>,
        row: SubscriptionBilling,
        handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => (
        <>
          <FormattedDate value={row.fromDate.toDate()} day='numeric' month='numeric' year='numeric' />
          {' - '}
          <FormattedDate value={row.toDate.toDate()} day='numeric' month='numeric' year='numeric' />
        </>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.due-date' }),
      id: 'dueDate',
      sortable: true,
      sortColumn: EnumSubscriptionBillingSortField.DUE_DATE,
      width: 100,
      cell: (
        rowIndex: number,
        column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>,
        row: SubscriptionBilling,
        handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => (
        <FormattedDate value={row.dueDate.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.price' }),
      id: 'netPrice',
      headerStyle: { textAlign: 'right' },
      sortable: false,
      className: classes.alightRight,
      width: 120,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.totalPriceExcludingTax} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.tax' }),
      id: 'tax',
      headerStyle: { textAlign: 'right' },
      sortable: false,
      className: classes.alightRight,
      width: 120,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.totalTax} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription-billing.header.total-price' }),
      id: 'totalPrice',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumSubscriptionBillingSortField.TOTAL_PRICE,
      className: classes.alightRight,
      width: 120,
      cell: (
        rowIndex: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling, handleAction?: cellActionHandler<SubscriptionBilling, EnumSubscriptionBillingSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.totalPrice} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }]);
}

const statusToBackGround = (status: EnumSubscriptionBillingStatus): string => {
  switch (status) {
    case EnumSubscriptionBillingStatus.DUE:
      return '#FBC02D';
    case EnumSubscriptionBillingStatus.FAILED:
      return '#E64A19';
    case EnumSubscriptionBillingStatus.PAID:
    case EnumSubscriptionBillingStatus.NO_CHARGE:
      return '#4CAF50';
  }
};

interface SubscriptionBillingTableProps extends WithStyles<typeof styles> {
  config: ApplicationConfiguration,
  intl: IntlShape,
  loading?: boolean;
  mode?: EnumBillingViewMode;
  pagination: PageRequest,
  query: SubscriptionBillingQuery,
  result: PageResult<SubscriptionBilling> | null,
  selected: SubscriptionBilling[],
  sorting: Sorting<EnumSubscriptionBillingSortField>[];
  addToSelection?: (rows: SubscriptionBilling[]) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionBillingSortField>[]
  ) => Promise<PageResult<SubscriptionBilling> | null>,
  removeFromSelection?: (rows: SubscriptionBilling[]) => void,
  resetSelection?: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumSubscriptionBillingSortField>[]) => void,
  viewPayIn: (key: string) => void;
  viewUseStatistics: (data: SubscriptionBilling) => void;
}

class SubscriptionBillingTable extends React.Component<SubscriptionBillingTableProps> {

  constructor(props: SubscriptionBillingTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  static defaultProps = {
    mode: EnumBillingViewMode.DEFAULT,
  }

  handleAction(action: string, index: number, column: Column<SubscriptionBilling, EnumSubscriptionBillingSortField>, row: SubscriptionBilling): void {
    if (row) {
      switch (action) {
        case EnumAction.ViewAsset: {
          const { config: { marketplaceUrl } } = this.props;
          const { subscription } = row;

          if (subscription?.item) {
            const trailingSlash = !marketplaceUrl.endsWith('/');
            const url = `${marketplaceUrl}${trailingSlash ? '/' : ''}catalogue/${subscription.item.id}`;

            window.open(url, "_blank");
          }
          break;
        }

        case EnumAction.ViewPayIn:
          if (row.payIn) {
            this.props.viewPayIn(row.payIn.key);
          }
          break;

        case EnumAction.ViewStatistics:
          this.props.viewUseStatistics(row);
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
        <MaterialTable<SubscriptionBilling, EnumSubscriptionBillingSortField>
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