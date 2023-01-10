import React from 'react';

import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedNumber } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiBankPlus,
  mdiCogSyncOutline,
  mdiEmailAlertOutline,
  mdiMessageTextOutline,
  mdiWalletOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumMarketplaceAccountSortField, EnumKycLevel, MarketplaceAccountSummary, MarketplaceAccountQuery } from 'model/account-marketplace';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Utilities
import clsx from 'clsx';

enum EnumAction {
  CreatePayOut = 'create-payout',
  RefreshWallet = 'refresh-wallet',
  SendMessage = 'send-message',
};

function providerColumns(intl: IntlShape, props: ProviderTableProps): Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>[] {
  const { classes } = props;
  return (
    [{
      header: intl.formatMessage({ id: 'account.marketplace.header.actions' }),
      id: 'actions',
      width: 60,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.send-message' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.SendMessage, rowIndex, column, row) : null}
            >
              <Icon path={mdiMessageTextOutline} className={classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.refresh-wallet' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.RefreshWallet, rowIndex, column, row) : null}
            >
              <Icon path={mdiWalletOutline} className={classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          {row.providerKycLevel === EnumKycLevel.REGULAR &&
            <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.create-payout' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.CreatePayOut, rowIndex, column, row) : null}
              >
                <Icon path={mdiBankPlus} className={classes.rowIconAction} />
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
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
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
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
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
      header: intl.formatMessage({ id: 'account.marketplace.header.provider' }),
      id: 'provider',
      sortable: false,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <div className={classes.compositeLabel}>
            <div className={classes.marginRight}>{row.providerName}</div>
            {row.provider &&
              <div
                className={row.providerKycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel}
              >
                <div>{row.providerKycLevel}</div>
                {row.providerUpdatePending &&
                  <Icon path={mdiCogSyncOutline} className={classes.rowIcon} />
                }
              </div>
            }
            {!row.provider && row.providerUpdatePending &&
              <div
                className={classes.statusLabelWarning}
              >
                <div>{EnumKycLevel.LIGHT}</div>
                <Icon path={mdiCogSyncOutline} className={classes.rowIcon} />
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
        column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>,
        row: MarketplaceAccountSummary,
        handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <DateTime value={row?.registeredOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.funds' }),
      id: 'providerFunds',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumMarketplaceAccountSortField.PROVIDER_FUNDS,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.providerFunds} style={'currency'} currency={'EUR'} />
          </b>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.pending-payout-finds' }),
      id: 'pendingPayoutFunds',
      headerStyle: { textAlign: 'right' },
      sortable: true,
      sortColumn: EnumMarketplaceAccountSortField.PROVIDER_PENDING_PAYOUT_FUNDS,
      className: classes.alightRight,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <b>
            <FormattedNumber value={row.pendingPayoutFunds} style={'currency'} currency={'EUR'} />
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
  ) => Promise<PageResult<MarketplaceAccountSummary> | null>,
  query: MarketplaceAccountQuery,
  result: PageResult<MarketplaceAccountSummary> | null,
  pagination: PageRequest,
  selected: MarketplaceAccountSummary[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumMarketplaceAccountSortField>[]) => void,
  addToSelection: (rows: MarketplaceAccountSummary[]) => void,
  refreshWallet: (row: MarketplaceAccountSummary) => void;
  removeFromSelection: (rows: MarketplaceAccountSummary[]) => void,
  resetSelection: () => void;
  sendMessage: (row: MarketplaceAccountSummary) => void;
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
  loading?: boolean;
}

class ProviderTable extends React.Component<ProviderTableProps> {

  constructor(props: ProviderTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(
    action: string, index: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary
  ): void {
    if (row.key) {
      switch (action) {
        case EnumAction.CreatePayOut:
          this.props.createPayOut(row.key);
          break;

        case EnumAction.RefreshWallet:
          this.props.refreshWallet(row);
          break;

        case EnumAction.SendMessage:
          this.props.sendMessage(row);
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
      <MaterialTable<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
        intl={intl}
        columns={providerColumns(intl, this.props)}
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
const styledComponent = withStyles(styles)(ProviderTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;