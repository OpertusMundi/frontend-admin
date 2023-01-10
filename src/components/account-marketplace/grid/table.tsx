import React from 'react';

import { Link } from 'react-router-dom';

import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiCogOutline,
  mdiDatabaseCogOutline,
  mdiDomain,
  mdiEmailAlertOutline,
  mdiMessageTextOutline,
  mdiShieldRefreshOutline,
  mdiTrashCanOutline,
  mdiWalletOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import { buildPath, DynamicRoutes } from 'model/routes';
import { EnumMarketplaceAccountSortField, EnumKycLevel, MarketplaceAccountSummary, MarketplaceAccountQuery, EnumAccountType, EnumAccountActiveTask } from 'model/account-marketplace';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Utilities
import clsx from 'clsx';
import { ApplicationConfiguration } from 'model/configuration';
import { EnumMarketplaceRole } from 'model/role';

enum EnumAction {
  DeleteAllUserData = 'delete-all-user-data',
  KycRefresh = 'kyc-refresh',
  RefreshWallet = 'refresh-wallet',
  SendMessage = 'send-message',
  ToggleTester = 'toggle-tester',
  VendorDetails = 'vendor-details',
};

function accountColumns(props: AccountTableProps): Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>[] {
  const { intl, classes, config } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'account.marketplace.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'start' }}>
          <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.send-message' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.SendMessage, rowIndex, column, row) : null}
            >
              <Icon path={mdiMessageTextOutline} className={classes.rowIconAction} style={{ marginTop: 2 }} />
            </i>
          </Tooltip>
          {row.type === EnumAccountType.OPERTUSMUNDI && (row.consumer || row.provider) &&
            <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.refresh-wallet' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.RefreshWallet, rowIndex, column, row) : null}
              >
                <Icon path={mdiWalletOutline} className={classes.rowIconAction} style={{ marginTop: 2 }} />
              </i>
            </Tooltip>
          }
          {row.type === EnumAccountType.VENDOR &&
            <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.vendor-details' })}>
              <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.parentKey + ''])} className={classes.link}>
                <Icon path={mdiDomain} className={classes.rowIconAction} />
              </Link>
            </Tooltip>
          }
          {row.type === EnumAccountType.OPERTUSMUNDI && (row.consumer || row.provider) &&
            <Tooltip title={intl.formatMessage({ id: 'account.marketplace.tooltip.kyc-refresh' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.KycRefresh, rowIndex, column, row) : null}
              >
                <Icon path={mdiShieldRefreshOutline} className={classes.rowIconAction} />
              </i>
            </Tooltip>
          }
          {row.roles.includes(EnumMarketplaceRole.ROLE_TESTER) &&
            <Tooltip title={intl.formatMessage({
              id: row.activeTask === EnumAccountActiveTask.NONE
                ? 'account.marketplace.tooltip.delete-execute'
                : 'account.marketplace.tooltip.delete-processing'
            })}>
              <i
                onClick={() => handleAction && row.activeTask === EnumAccountActiveTask.NONE
                  ? handleAction(EnumAction.DeleteAllUserData, rowIndex, column, row)
                  : null
                }
              >
                <Icon
                  path={row.activeTask === EnumAccountActiveTask.NONE ? mdiTrashCanOutline : mdiCogOutline}
                  className={row.activeTask === EnumAccountActiveTask.NONE ? classes.rowIconAction : classes.rowIcon}
                  spin={row.activeTask !== EnumAccountActiveTask.NONE}
                />
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
      width: 150,
      sortable: true,
      sortColumn: EnumMarketplaceAccountSortField.EMAIL,
      cell: (
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabel}>
          {row.activeTask === EnumAccountActiveTask.NONE &&
            <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [row.key + ''])} className={classes.link}>
              {row.email}
            </Link>
          }
          {row.activeTask !== EnumAccountActiveTask.NONE &&
            <span>{row.email}</span>
          }
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
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <div className={classes.compositeLabel}>
            <div className={classes.marginRight}>{row.consumerName}</div>
            {row.consumer && row.type === EnumAccountType.OPERTUSMUNDI &&
              <div
                className={row.consumerUpdatePending
                  ? classes.compositeLabelPending
                  : row.consumerKycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel
                }
                onClick={() => row.consumerUpdatePending ? props.viewProcessInstance(row.consumerProcessInstance) : null}
              >
                <div className={classes.statusLabelTextWithMargin}>{row.consumerKycLevel}</div>
                {row.consumerUpdatePending &&
                  <Icon path={mdiDatabaseCogOutline} className={classes.rowIcon} />
                }
              </div>
            }
            {!row.consumer && row.consumerUpdatePending && row.type === EnumAccountType.OPERTUSMUNDI &&
              <div
                className={classes.compositeLabelPending}
                onClick={() => props.viewProcessInstance(row.providerProcessInstance)}
              >
                <div className={classes.statusLabelTextWithMargin}>{EnumKycLevel.LIGHT}</div>
                <Icon path={mdiDatabaseCogOutline} className={classes.rowIcon} />
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
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        return (
          <div className={classes.compositeLabel}>
            <div className={classes.marginRight}>{row.providerName}</div>
            {row.provider && row.type === EnumAccountType.OPERTUSMUNDI &&
              <div
                className={row.providerUpdatePending
                  ? classes.compositeLabelPending
                  : row.providerKycLevel === EnumKycLevel.LIGHT ? classes.statusLabelWarning : classes.statusLabel
                }
                onClick={() => row.providerUpdatePending ? props.viewProcessInstance(row.providerProcessInstance) : null}
              >
                <div className={classes.statusLabelTextWithMargin}>{row.providerKycLevel}</div>
                {row.providerUpdatePending &&
                  <Icon path={mdiDatabaseCogOutline} className={classes.rowIcon} />
                }
              </div>
            }
            {!row.provider && row.providerUpdatePending && row.type === EnumAccountType.OPERTUSMUNDI &&
              <div
                className={classes.compositeLabelPending}
                onClick={() => props.viewProcessInstance(row.providerProcessInstance)}
              >
                <div className={classes.statusLabelTextWithMargin}>{EnumKycLevel.LIGHT}</div>
                <Icon path={mdiDatabaseCogOutline} className={classes.rowIcon} />
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
        rowIndex: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary, handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => {
        const providers = config.externalProviders!.filter(p => row.roles.some(r => r === p.requiredRole));
        if (providers.length !== 1) {
          return null;
        }
        return (
          <div className={classes.compositeLabel} >
            <div className={classes.statusLabel}>
              <div className={classes.statusLabelText}>{providers[0].name}</div>
            </div>
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.registered-on' }),
      id: 'registeredOn',
      sortable: false,
      width: 180,
      cell: (
        rowIndex: number,
        column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>,
        row: MarketplaceAccountSummary,
        handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        <DateTime value={row?.registeredOn?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'account.marketplace.header.tester' }),
      id: 'tester',
      sortable: false,
      width: 120,
      className: classes.alightCenter,
      cell: (
        rowIndex: number,
        column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>,
        row: MarketplaceAccountSummary,
        handleAction?: cellActionHandler<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>
      ): React.ReactNode => (
        row.activeTask === EnumAccountActiveTask.NONE
          ? <Switch
            checked={row.roles.includes(EnumMarketplaceRole.ROLE_TESTER)}
            onChange={() => handleAction && handleAction(EnumAction.ToggleTester, rowIndex, column, row)}
            name="tester"
            color="primary"
          />
          : null
      ),
    }]);
}

const styles = (theme: Theme) => createStyles({
  alightCenter: {
    textAlign: 'center',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    color: 'inherit',
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
  compositeLabelPending: {
    cursor: 'pointer',
    display: 'flex',
    marginRight: theme.spacing(2),
    background: '#616161',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
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
  statusLabel: {
    display: 'flex',
    marginRight: theme.spacing(2),
    background: '#4CAF50',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
  },
  statusLabelText: {

  },
  statusLabelWarning: {
    display: 'flex',
    marginRight: theme.spacing(2),
    background: '#F4511E',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
  },
  statusLabelTextWithMargin: {
    marginRight: theme.spacing(1),
  },
});

interface AccountTableProps extends WithStyles<typeof styles> {
  config: ApplicationConfiguration;
  intl: IntlShape;
  loading?: boolean;
  pagination: PageRequest;
  query: MarketplaceAccountQuery;
  result: PageResult<MarketplaceAccountSummary> | null;
  selected: MarketplaceAccountSummary[];
  sorting: Sorting<EnumMarketplaceAccountSortField>[];
  addToSelection: (rows: MarketplaceAccountSummary[]) => void;
  deleteAllUserData: (row: MarketplaceAccountSummary) => void;
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]
  ) => Promise<PageResult<MarketplaceAccountSummary> | null>;
  refreshKycStatus: (row: MarketplaceAccountSummary) => void;
  refreshWallet: (row: MarketplaceAccountSummary) => void;
  removeFromSelection: (rows: MarketplaceAccountSummary[]) => void;
  resetSelection: () => void;
  sendMessage: (row: MarketplaceAccountSummary) => void;
  setPager: (page: number, size: number) => void;
  setSorting: (sorting: Sorting<EnumMarketplaceAccountSortField>[]) => void;
  toggleTester: (row: MarketplaceAccountSummary) => void;
  view: (key: string) => void;
  viewProcessInstance: (businessKey: string) => void;
}

class AccountTable extends React.Component<AccountTableProps> {

  constructor(props: AccountTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<MarketplaceAccountSummary, EnumMarketplaceAccountSortField>, row: MarketplaceAccountSummary): void {
    if (row.key) {
      switch (action) {
        case EnumAction.DeleteAllUserData:
          if (row.activeTask === EnumAccountActiveTask.NONE) {
            this.props.deleteAllUserData(row);
          }
          break;

        case EnumAction.KycRefresh:
          this.props.refreshKycStatus(row);
          break;

        case EnumAction.RefreshWallet:
          this.props.refreshWallet(row);
          break;


        case EnumAction.SendMessage:
          this.props.sendMessage(row);
          break;

        case EnumAction.ToggleTester:
          this.props.toggleTester(row);
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