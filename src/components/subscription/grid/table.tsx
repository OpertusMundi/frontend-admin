import React from 'react';

// Components
import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';


import Icon from '@mdi/react';
import {
  mdiShoppingOutline,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, PageResult, Sorting } from 'model/response';
import {
  EnumKycLevel,
  CustomerProfessional,
  EnumSubscriptionSortField,
  AccountSubscription,
  SubscriptionQuery,
  EnumSubscriptionStatus,
  EnumCustomerType,
  EnumMangopayUserType,
} from 'model/account-marketplace';
import { EnumBillingViewMode } from 'model/order';
import { ApplicationConfiguration } from 'model/configuration';

enum EnumAction {
  ViewAsset = 'view-asset',
};

const getCustomerName = (subscription: AccountSubscription, type: EnumCustomerType): string => {
  if (type === EnumCustomerType.PROVIDER && subscription?.provider) {
    const p = subscription?.provider as CustomerProfessional;
    return p.name;
  }
  if (type === EnumCustomerType.CONSUMER && subscription?.consumer) {
    const c = subscription.consumer;

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

function subscriptionColumns(intl: IntlShape, props: AccountSubscriptionTableProps): Column<AccountSubscription, EnumSubscriptionSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'billing.subscription.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<AccountSubscription, EnumSubscriptionSortField>, row: AccountSubscription, handleAction?: cellActionHandler<AccountSubscription, EnumSubscriptionSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          {row.item &&
            <Tooltip title={intl.formatMessage({ id: 'billing.subscription.tooltip.view' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.ViewAsset, rowIndex, column, row) : null}
              >
                <Icon path={mdiShoppingOutline} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription.header.status' }),
      id: 'status',
      sortable: true,
      sortColumn: EnumSubscriptionSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<AccountSubscription, EnumSubscriptionSortField>, row: AccountSubscription, handleAction?: cellActionHandler<AccountSubscription, EnumSubscriptionSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.compositeLabel}>
            {row?.status &&
              <div
                className={classes.statusLabel}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.subscription-status.${row.status}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription.header.provider' }),
      id: 'provider',
      sortable: false,
      hidden: props.mode === EnumBillingViewMode.PROVIDER,
      cell: (
        rowIndex: number, column: Column<AccountSubscription, EnumSubscriptionSortField>, row: AccountSubscription, handleAction?: cellActionHandler<AccountSubscription, EnumSubscriptionSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.provider &&
              <div className={classes.compositeLabel}>
                <div
                  className={row?.provider?.kycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
                >
                  <div className={classes.statusLabelText}>{row.provider?.kycLevel}</div>
                </div>
                <div className={classes.provider}>
                  <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.provider!.key])} className={classes.link}>
                    {getCustomerName(row, EnumCustomerType.PROVIDER)}
                  </Link>
                  <Typography variant="caption">{row.provider!.email}</Typography>
                </div>
              </div>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription.header.consumer' }),
      id: 'consumer',
      sortable: false,
      hidden: props.mode === EnumBillingViewMode.CONSUMER,
      cell: (
        rowIndex: number, column: Column<AccountSubscription, EnumSubscriptionSortField>, row: AccountSubscription, handleAction?: cellActionHandler<AccountSubscription, EnumSubscriptionSortField>
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
                    {getCustomerName(row, EnumCustomerType.CONSUMER)}
                  </Link>
                  <Typography variant="caption">{row.consumer!.email}</Typography>
                </div>
              </div>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription.header.item' }),
      id: 'item',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<AccountSubscription, EnumSubscriptionSortField>, row: AccountSubscription, handleAction?: cellActionHandler<AccountSubscription, EnumSubscriptionSortField>
      ): React.ReactNode => {

        return (
          <>
            {row?.item ? (
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body1">{row.item!.title}</Typography>
                </Grid>
                <Grid item xs={12} className={classes.assetDescription} title={row.item!.abstractText}>
                  <Typography variant="caption">{row.item!.abstractText}</Typography>
                </Grid>
              </Grid>
            ) : <span>-</span>
            }
          </>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'billing.subscription.header.added-on' }),
      id: 'addedOn',
      sortable: true,
      sortColumn: EnumSubscriptionSortField.ADDED_ON,
      cell: (
        rowIndex: number,
        column: Column<AccountSubscription, EnumSubscriptionSortField>,
        row: AccountSubscription,
        handleAction?: cellActionHandler<AccountSubscription, EnumSubscriptionSortField>
      ): React.ReactNode => (
        <FormattedTime value={row?.addedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'billing.subscription.header.modified-on' }),
      id: 'modifiedOn',
      sortable: true,
      sortColumn: EnumSubscriptionSortField.MODIFIED_ON,
      cell: (
        rowIndex: number,
        column: Column<AccountSubscription, EnumSubscriptionSortField>,
        row: AccountSubscription,
        handleAction?: cellActionHandler<AccountSubscription, EnumSubscriptionSortField>
      ): React.ReactNode => (
        <FormattedTime value={row?.updatedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const statusToBackGround = (status: EnumSubscriptionStatus): string => {
  switch (status) {
    case EnumSubscriptionStatus.CREATED:
      return '#616161';
    case EnumSubscriptionStatus.ACTIVE:
      return '#1976D2';
    case EnumSubscriptionStatus.INACTIVE:
      return '#E64A19';
  }
};

interface AccountSubscriptionTableProps extends WithStyles<typeof styles> {
  config: ApplicationConfiguration,
  intl: IntlShape,
  loading?: boolean;
  mode?: EnumBillingViewMode;
  pagination: PageRequest,
  query: SubscriptionQuery,
  result: PageResult<AccountSubscription> | null,
  selected: AccountSubscription[],
  sorting: Sorting<EnumSubscriptionSortField>[];
  addToSelection?: (rows: AccountSubscription[]) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionSortField>[]
  ) => Promise<PageResult<AccountSubscription> | null>,
  removeFromSelection?: (rows: AccountSubscription[]) => void,
  resetSelection?: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumSubscriptionSortField>[]) => void,
}

class SubscriptionTable extends React.Component<AccountSubscriptionTableProps> {

  constructor(props: AccountSubscriptionTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  static defaultProps = {
    mode: EnumBillingViewMode.DEFAULT,
  }

  handleAction(action: string, index: number, column: Column<AccountSubscription, EnumSubscriptionSortField>, row: AccountSubscription): void {
    if (row.key) {
      switch (action) {
        case EnumAction.ViewAsset: {
          const { config: { marketplaceUrl } } = this.props;
          const { item } = row;

          const trailingSlash = !marketplaceUrl.endsWith('/');
          const url = `${marketplaceUrl}${trailingSlash ? '/' : ''}catalogue/${item!.id}`;

          window.open(url, "_blank");
          break;
        }

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
        <MaterialTable<AccountSubscription, EnumSubscriptionSortField>
          intl={intl}
          columns={subscriptionColumns(intl, this.props)}
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
const styledComponent = withStyles(styles)(SubscriptionTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;