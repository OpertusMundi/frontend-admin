import React from 'react';

import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime, FormattedNumber } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiBankPlus,
  mdiCogSyncOutline,
  mdiEmailAlertOutline,
  mdiFinance,
  mdiFolderOpenOutline,
  mdiLink,
  mdiMessageTextOutline,
  mdiPackageVariantClosed,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumMarketplaceAccountSortField, EnumKycLevel, MarketplaceAccount, MarketplaceAccountQuery } from 'model/account-marketplace';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Utilities
import clsx from 'clsx';

enum EnumAction {
  CreatePayOut = 'create-payout',
  SendMessage = 'send-message',
  ViewAssets = 'toggle-favorite',
  ViewDetails = 'view-details',
  ViewFinance = 'view-finance',
  ViewOrders = 'view-orders',
};

function providerColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<MarketplaceAccount, EnumMarketplaceAccountSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'account.marketplace.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.view-details' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ViewDetails, rowIndex, column, row) : null}
            >
              <Icon path={mdiLink} className={classes.classes.rowIconAction} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.send-message' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.SendMessage, rowIndex, column, row) : null}
            >
              <Icon path={mdiMessageTextOutline} className={classes.classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.view-assets' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ViewAssets, rowIndex, column, row) : null}
            >
              <Icon path={mdiFolderOpenOutline} className={classes.classes.rowIconAction} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.view-orders' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ViewOrders, rowIndex, column, row) : null}
            >
              <Icon path={mdiPackageVariantClosed} className={classes.classes.rowIconAction} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.view-finance' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ViewFinance, rowIndex, column, row) : null}
            >
              <Icon path={mdiFinance} className={classes.classes.rowIconAction} />
            </i>
          </Tooltip>
          {row.providerKycLevel === EnumKycLevel.REGULAR &&
            <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.create-payout' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.CreatePayOut, rowIndex, column, row) : null}
              >
                <Icon path={mdiBankPlus} className={classes.classes.rowIconAction} />
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
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        if (row?.image && row?.imageMimeType) {
          const url = `data:${row.imageMimeType};base64,${row.image}`;
          return (
            <Avatar alt={row.email} src={url || undefined} variant="circular" className={classes.classes.avatar} />
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
        <div className={classes.classes.compositeLabel}>
          <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.key + ''])} className={classes.classes.link}>
            {row.email}
          </Link>
          {!row.emailVerified &&
            <Icon path={mdiEmailAlertOutline} className={clsx(classes.classes.rowIcon, classes.classes.marginLeft)} />
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.provider' }),
      id: 'provider',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <div className={classes.classes.compositeLabel}>
            <div className={classes.classes.marginRight}>{row.providerName}</div>
            {row.provider &&
              <div
                className={row.providerKycLevel === EnumKycLevel.LIGHT ? classes.classes.statusLabelWarning : classes.classes.statusLabel}
              >
                <div className={classes.classes.statusLabelText}>{row.providerKycLevel}</div>
                {row.providerUpdatePending &&
                  <Icon path={mdiCogSyncOutline} className={classes.classes.rowIcon} />
                }
              </div>
            }
            {!row.provider && row.providerUpdatePending &&
              <div
                className={classes.classes.statusLabelWarning}
              >
                <div className={classes.classes.statusLabelText}>{EnumKycLevel.LIGHT}</div>
                <Icon path={mdiCogSyncOutline} className={classes.classes.rowIcon} />
              </div>
            }
          </div>
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
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.funds' }),
      id: 'providerFunds',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumMarketplaceAccountSortField.PROVIDER_FUNDS,
      className: classes.classes.alightRight,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount, handleAction?: cellActionHandler<MarketplaceAccount, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.providerFunds} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }]);
}

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  rowIcon: {
    width: 18,
    marginLeft: 8,
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

interface ProviderTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  createPayOut: (key: string) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]
  ) => Promise<PageResult<MarketplaceAccount> | null>,
  query: MarketplaceAccountQuery,
  result: PageResult<MarketplaceAccount> | null,
  pagination: PageRequest,
  selected: MarketplaceAccount[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumMarketplaceAccountSortField>[]) => void,
  addToSelection: (rows: MarketplaceAccount[]) => void,
  removeFromSelection: (rows: MarketplaceAccount[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
  loading?: boolean;
}

class AccountTable extends React.Component<ProviderTableProps> {

  constructor(props: ProviderTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(
    action: string, index: number, column: Column<MarketplaceAccount, EnumMarketplaceAccountSortField>, row: MarketplaceAccount
  ): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CreatePayOut:
          this.props.createPayOut(row.key);
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
      <MaterialTable<MarketplaceAccount, EnumMarketplaceAccountSortField>
        intl={intl}
        columns={providerColumns(intl, { classes })}
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