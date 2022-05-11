import React from 'react';

import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiCogSyncOutline,
  mdiDomain,
  mdiEmailAlertOutline,
  mdiFinance,
  mdiFolderOpenOutline,
  mdiMessageTextOutline,
  mdiPackageVariantClosed,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumMarketplaceAccountSortField, EnumKycLevel, MarketplaceAccount, MarketplaceAccountQuery, EnumAccountType } from 'model/account-marketplace';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Utilities
import clsx from 'clsx';
import { ApplicationConfiguration } from 'model/configuration';

enum EnumAction {
  ViewAssets = 'toggle-favorite',
  SendMessage = 'send-message',
  ViewFinance = 'view-finance',
  ViewOrders = 'view-orders',
  VendorDetails = 'vendor-details',
};

function accountColumns(props: AccountTableProps): Column<MarketplaceAccount, EnumMarketplaceAccountSortField>[] {
  const { intl, classes, config } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'account.marketplace.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <>
          {row.type === EnumAccountType.VENDOR &&
            <div style={{ display: 'flex', justifyContent: 'start' }}>
              <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.vendor-details' })}>
                <i
                  onClick={() => handleAction ? handleAction(EnumAction.VendorDetails, rowIndex, column, row) : null}
                >
                  <Icon path={mdiDomain} className={classes.rowIconAction} />
                </i>
              </Tooltip>
            </div>
          }
          {row.type === EnumAccountType.OPERTUSMUNDI &&
            <div style={{ display: 'flex', justifyContent: 'start' }}>
              <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.send-message' })}>
                <i
                  onClick={() => handleAction ? handleAction(EnumAction.SendMessage, rowIndex, column, row) : null}
                >
                  <Icon path={mdiMessageTextOutline} className={classes.rowIconAction} style={{ marginTop: 2 }} />
                </i>
              </Tooltip>
              <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.view-assets' })}>
                <i
                  onClick={() => handleAction ? handleAction(EnumAction.ViewAssets, rowIndex, column, row) : null}
                >
                  <Icon path={mdiFolderOpenOutline} className={classes.rowIconAction} />
                </i>
              </Tooltip>
              <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.view-orders' })}>
                <i
                  onClick={() => handleAction ? handleAction(EnumAction.ViewOrders, rowIndex, column, row) : null}
                >
                  <Icon path={mdiPackageVariantClosed} className={classes.rowIconAction} />
                </i>
              </Tooltip>
              <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.view-finance' })}>
                <i
                  onClick={() => handleAction ? handleAction(EnumAction.ViewFinance, rowIndex, column, row) : null}
                >
                  <Icon path={mdiFinance} className={classes.rowIconAction} />
                </i>
              </Tooltip>
            </div>
          }
        </>
      ),
    }, {
      header: '',
      id: 'avatar',
      width: 60,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        if (row?.image && row?.imageMimeType) {
          const url = `data:${row.imageMimeType};base64,${row.image}`;
          return (
            <Avatar alt={row.email} src={url || undefined} variant="circular" className={classes.avatar} />
          );
        }
        return null;
      },
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.email' }),
      id: 'email',
      width: 250,
      sortable: true,
      sortColumn: EnumMarketplaceAccountSortField.EMAIL,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabel}>
          <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.key + ''])} className={classes.link}>
            {row.email}
          </Link>
          {!row.emailVerified &&
            <Icon path={mdiEmailAlertOutline} className={clsx(classes.rowIcon, classes.marginLeft)} />
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.consumer' }),
      id: 'consumer',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <div className={classes.compositeLabel}>
            <div className={classes.marginRight}>{row.consumerName}</div>
            {row.consumer &&
              <div
                className={row.consumerKycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
              >
                <div className={classes.statusLabelTextWithMargin}>{row.consumerKycLevel}</div>
                {row.consumerUpdatePending &&
                  <Icon path={mdiCogSyncOutline} className={classes.rowIcon} />
                }
              </div>
            }
            {!row.consumer && row.consumerUpdatePending &&
              <div
                className={classes.statusLabelWarning}
              >
                <div className={classes.statusLabelTextWithMargin}>{EnumKycLevel.LIGHT}</div>
                <Icon path={mdiCogSyncOutline} className={classes.rowIcon} />
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.provider' }),
      id: 'provider',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <div className={classes.compositeLabel}>
            <div className={classes.marginRight}>{row.providerName}</div>
            {row.provider &&
              <div
                className={row.providerKycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
              >
                <div className={classes.statusLabelTextWithMargin}>{row.providerKycLevel}</div>
                {row.providerUpdatePending &&
                  <Icon path={mdiCogSyncOutline} className={classes.rowIcon} />
                }
              </div>
            }
            {!row.provider && row.providerUpdatePending &&
              <div
                className={classes.statusLabelWarning}
              >
                <div className={classes.statusLabelTextWithMargin}>{EnumKycLevel.LIGHT}</div>
                <Icon path={mdiCogSyncOutline} className={classes.rowIcon} />
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.external-provider' }),
      id: 'external-provider',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        const providers = config.externalProviders.filter(p => row.roles.some(r => r === p.requiredRole));
        if (providers.length !== 1) {
          return null;
        }
        return (
          <div className={classes.compositeLabel} >
            <div className={classes.statusLabel}>
              <div className={classes.statusLabelText}>{providers[0].name}</div>
            </div>
          </div >
        )
      },
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.registered-on' }),
      id: 'registeredOn',
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>,
        row: MarketplaceAccount,
        handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <FormattedTime value={row?.registeredOn?.toDate()} day='numeric' month='numeric' year='numeric' />
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
  statusLabelNew: {
    display: 'flex',
    marginRight: theme.spacing(2),
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
  },
  statusLabelText: {
  },
  statusLabelTextWithMargin: {
    marginRight: theme.spacing(1),
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

interface AccountTableProps extends WithStyles<typeof styles> {
  config: ApplicationConfiguration,
  intl: IntlShape,
  loading?: boolean;
  pagination: PageRequest,
  query: MarketplaceAccountQuery,
  result: PageResult<MarketplaceAccount> | null,
  selected: MarketplaceAccount[],
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
  addToSelection: (rows: MarketplaceAccount[]) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]
  ) => Promise<PageResult<MarketplaceAccount> | null>,
  removeFromSelection: (rows: MarketplaceAccount[]) => void,
  resetSelection: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumMarketplaceAccountSortField>[]) => void,
  view: (key: string) => void;
}

class AccountTable extends React.Component<AccountTableProps> {

  constructor(props: AccountTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount): void {
    if (row.key) {
      switch (action) {
        default:
          // No action
          break;
      }
    }
  }

  render() {
    const { intl, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <MaterialTable<MarketplaceAccount, EnumMarketplaceAccountSortField>
        intl={intl}
        columns={accountColumns(this.props)}
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
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(AccountTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;