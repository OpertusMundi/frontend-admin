import React from 'react';

import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';
import { useNavigate, useLocation, useParams, NavigateFunction, Location } from 'react-router-dom';

import { Link } from 'react-router-dom';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import { red } from '@material-ui/core/colors';

import Icon from '@mdi/react';
import {
  mdiAccount,
  mdiAccountCircleOutline,
  mdiAlertDecagramOutline,
  mdiBankTransferIn,
  mdiBankTransferOut,
  mdiCheckDecagramOutline,
  mdiClockFast,
  mdiCommentAlertOutline,
  mdiDomain,
  mdiFaceAgent,
  mdiListStatus,
  mdiPackageVariantClosed,
  mdiTuneVariant,
  mdiWalletPlusOutline,
} from '@mdi/js';

// Components
import { CustomerDetails } from 'components/common';
import MarketplaceAccountConfiguration from 'components/account-marketplace/form/configuration';

// Store
import { RootState } from 'store';
import {
  setOrderPager,
  setOrderSorting,
  setPayInPager,
  setPayInSorting,
  setTransferPager,
  setTransferSorting,
  setPayOutPager,
  setPayOutSorting,
  setSubscriptionPager,
  setSubscriptionSorting,
  setSubBillingPager,
  setSubBillingSorting,
  setTabIndex,
} from 'store/account-marketplace/actions';
import {
  findOne,
  findOrders,
  findPayIns,
  findTransfers,
  findPayOuts,
  findSubscriptions,
  findSubscriptionBilling,
} from 'store/account-marketplace/thunks';

// Service
import message from 'service/message';
import AccountApi from 'service/account-marketplace';
import { ObjectResponse, PageRequest, SimpleResponse, Sorting } from 'model/response';
import { CustomerType, EnumAccountType, EnumActivationStatus, EnumCustomerType, EnumMangopayUserType, EnumSubscriptionSortField, MarketplaceAccount } from 'model/account-marketplace';

// Utilities
import { FieldMapperFunc, localizeErrorCodes } from 'utils/error';

// Model
import { buildPath, DynamicRoutes, StaticRoutes } from 'model/routes';
import { EnumDataProvider } from 'model/configuration';
import { Message } from 'model/message';
import { EnumMarketplaceRole } from 'model/role';
import {
  EnumOrderSortField,
  EnumBillingViewMode,
  EnumPayInSortField,
  EnumPayOutSortField,
  EnumTransferSortField,
  EnumSubscriptionBillingSortField,
  SubscriptionBilling,
} from 'model/order';

// Components
import OrderTable from 'components/order/grid/table';
import PayInTable from 'components/payin/grid/table';
import PayOutTable from 'components/payout/grid/table';
import TransferTable from 'components/transfer/grid/table';
import SubscriptionTable from 'components/subscription/grid/table';
import SubscriptionBillingTable from 'components/subscription-billing/grid/table';
import UseStatisticsState from 'components/subscription-billing/use-statistics';

const styles = (theme: Theme) => createStyles({
  alignSelfBaseline: {
    alignSelf: 'baseline',
  },
  avatar: {
    backgroundColor: red[500],
  },
  button: {
    margin: theme.spacing(3, 1, 2),
    borderRadius: 0,
    textTransform: 'none',
  },
  card: {
    minWidth: 480,
    maxWidth: 640,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  gridLabel: {
    position: 'absolute',
    top: '0px',
    background: '#3f51b5',
    color: '#ffffff',
    left: 0,
    padding: theme.spacing(0.5),
    borderBottomRightRadius: theme.spacing(0.5),
    fontSize: '0.7rem',
  },
  link: {
    textDecoration: 'underline',
    color: 'inherit',
  },
  paperTable: {
    padding: theme.spacing(1),
    position: 'relative',
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
    overflowX: 'auto',
  },
  statsDrawer: {
    overflowX: 'hidden',
    maxWidth: 500,
  },
  statusLabel: {
    display: 'flex',
    background: '#4CAF50',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    justifyContent: 'center',
  },
  statusLabelWarning: {
    display: 'flex',
    background: '#F4511E',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    justifyContent: 'center',
  },
});

interface RouteParams {
  key?: string | undefined;
}

interface MarketplaceAccountFormProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

interface MarketplaceAccountFormState {
  billingRecord: SubscriptionBilling | null;
  confirmCompanyName: string;
  confirmExternalProviderUpdate: boolean;
  confirmOpenDatasetProviderUpdate: boolean,
  initialExternalProvider: EnumDataProvider;
  initialOpenDatasetProvider: boolean;
  loaded: boolean;
}

const customerErrorMapper = (intl: IntlShape, message: Message, fieldMapper?: FieldMapperFunc) => {
  switch (message.code) {
    case 'AdminMessageCode.ExternalProviderAlreadyExists':
      return intl.formatMessage({ id: `error.${message.code}` });
    case 'AdminMessageCode.OpenDatasetProviderAlreadyExists':
      return intl.formatMessage({ id: `error.${message.code}` });
  }

  return null;
}

class MarketplaceAccountForm extends React.Component<MarketplaceAccountFormProps, MarketplaceAccountFormState> {

  api: AccountApi;

  constructor(props: MarketplaceAccountFormProps) {
    super(props);

    this.api = new AccountApi();
    this.state = {
      billingRecord: null,
      confirmCompanyName: '',
      confirmExternalProviderUpdate: false,
      confirmOpenDatasetProviderUpdate: false,
      initialExternalProvider: EnumDataProvider.UNDEFINED,
      initialOpenDatasetProvider: false,
      loaded: false,
    };

    this.setExternalProvider = this.setExternalProvider.bind(this);
    this.setOpenDatasetProvider = this.setOpenDatasetProvider.bind(this);
    this.viewPayIn = this.viewPayIn.bind(this);
    this.viewProcessInstance = this.viewProcessInstance.bind(this);
    this.viewUseStatistics = this.viewUseStatistics.bind(this);
  }

  get key(): string | null {
    const { key } = this.props.params;

    return key || null;
  }

  setExternalProvider(key: string, provider: EnumDataProvider): Promise<boolean> {
    const { account } = this.props;

    if (account) {
      this.api.setExternalProvider(account.key, { provider })
        .then((response) => {
          if (response.data.success) {
            this.setState({
              initialExternalProvider: provider,
            });

            return true;
          } else {
            const messages = localizeErrorCodes(this.props.intl, response.data, undefined, undefined, customerErrorMapper);
            message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
            return false;
          }
        })
        .catch((err: AxiosError<SimpleResponse>) => {
          const messages = localizeErrorCodes(this.props.intl, err.response?.data, undefined, undefined, customerErrorMapper);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
          return false;
        });
    }
    return Promise.resolve(true);
  }

  setOpenDatasetProvider(key: string, enabled: boolean): Promise<boolean> {
    const { account } = this.props;

    if (account) {
      (enabled
        ? this.api.grantOpenDatasetProvider(account.key)
        : this.api.revokeOpenDatasetProvider(account.key)
      ).then((response) => {
        if (response.data.success) {
          this.setState({
            initialOpenDatasetProvider: enabled,
          });

          return true;
        } else {
          const messages = localizeErrorCodes(this.props.intl, response.data, undefined, undefined, customerErrorMapper);
          message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
          return false;
        }
      }).catch((err: AxiosError<SimpleResponse>) => {
        const messages = localizeErrorCodes(this.props.intl, err.response?.data, undefined, undefined, customerErrorMapper);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
        return false;
      });
    }
    return Promise.resolve(true);
  }

  componentDidMount() {
    this.getAccountData();
  }

  componentDidUpdate(prevProps: MarketplaceAccountFormProps) {
    const { key: prevKey } = prevProps.params;
    const { key: newKey } = this.props.params;

    if (prevKey !== newKey) {
      this.getAccountData();
    }
  }

  getAccountData(): void {
    const { config, account } = this.props;

    if (this.key) {
      this.props.findOne(this.key, account?.key !== this.key ? 0 : null)
        .then((response: ObjectResponse<MarketplaceAccount>) => {
          if (response.success) {
            const account = response.result!;
            const providers = config.externalProviders!.filter(p => account?.roles.some(r => r === p.requiredRole));
            const provider = providers[0] ? providers[0].id : EnumDataProvider.UNDEFINED;
            const openDatasetProvider = account.roles.includes(EnumMarketplaceRole.ROLE_PROVIDER_OPEN_DATASET);

            this.setState({
              initialExternalProvider: provider,
              initialOpenDatasetProvider: openDatasetProvider,
              loaded: true,
            });
            this.loadTabContent(this.props.tabIndex);
          } else {
            const messages = localizeErrorCodes(this.props.intl, response, false);
            message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));

            this.props.navigate(StaticRoutes.MarketplaceAccountManager);
          }
        })
    } else {
      this.props.navigate(StaticRoutes.MarketplaceAccountManager);
    }
  }

  loadTabContent(index: number) {
    const { account, orders, payins, transfers, payouts, subscriptions } = this.props;
    const consumer = account?.profile.consumer.current;
    const provider = account?.profile.provider.current;

    /**
     * Tabs
     *
     * 1: Orders        (consumer) / Transfers  (provider)
     * 2: PayIns        (consumer) / PayOuts    (provider)
     * 3: Subscriptions (consumer)
     * 4: Transfers     (consumer + provider)
     * 5: PayOuts       (consumer + provider)
     * 6:
     */
    switch (index) {
      case 1:
        // Orders
        if (consumer && !orders.loaded) {
          this.findOrders();
        }
        // Transfers
        if (!consumer && provider && !transfers.loaded) {
          this.findTransfers();
        }
        break;
      case 2:
        // PayIns
        if (consumer && !payins.loaded) {
          this.findPayIns();
        }
        // PayOuts
        if (!consumer && provider && !payouts.loaded) {
          this.findPayOuts();
        }
        break;
      case 3:
        // Subscriptions
        if (consumer && !subscriptions.loaded) {
          this.findSubscriptions();
          this.findSubscriptionBilling();
        }
        break;
      case 4:
        // Transfers
        if (consumer && provider && !transfers.loaded) {
          this.findTransfers();
        }
        break;
      case 5:
        // PayOuts
        if (consumer && provider && !payouts.loaded) {
          this.findPayOuts();
        }
        break;
    }
  }

  setTabIndex(index: number) {
    this.props.setTabIndex(index);

    this.loadTabContent(index);
  }

  getCustomerName(customer: CustomerType): string {
    switch (customer.type) {
      case EnumMangopayUserType.INDIVIDUAL:
        return [customer.firstName, customer.lastName].join(' ');

      case EnumMangopayUserType.PROFESSIONAL:
        return customer.name;
    }
  }

  renderCustomer(customer: CustomerType, type: EnumCustomerType) {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiFaceAgent} size="1.5rem" />
            </Avatar>
          }
          title={
            <FormattedMessage id={`account-marketplace.form.section.${type}`} />
          }
        ></CardHeader>
        <CardContent>
          <CustomerDetails customer={customer} />
        </CardContent>
      </Card>
    );
  }

  findOrders(): void {
    this.props.findOrders().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  findPayIns(): void {
    this.props.findPayIns().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  findTransfers(): void {
    this.props.findTransfers().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  findPayOuts(): void {
    this.props.findPayOuts().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  findSubscriptions(): void {
    this.props.findSubscriptions().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  findSubscriptionBilling(): void {
    this.props.findSubscriptionBilling().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  setOrderSorting(sorting: Sorting<EnumOrderSortField>[]): void {
    this.props.setOrderSorting(sorting);
    this.findOrders();
  }

  setPayInSorting(sorting: Sorting<EnumPayInSortField>[]): void {
    this.props.setPayInSorting(sorting);
    this.findPayIns();
  }

  setTransferSorting(sorting: Sorting<EnumTransferSortField>[]): void {
    this.props.setTransferSorting(sorting);
    this.findTransfers();
  }

  setPayOutSorting(sorting: Sorting<EnumPayOutSortField>[]): void {
    this.props.setPayOutSorting(sorting);
    this.findPayOuts();
  }

  setSubscriptionSorting(sorting: Sorting<EnumSubscriptionSortField>[]): void {
    this.props.setSubscriptionSorting(sorting);
    this.findSubscriptions();
  }

  setSubBillingSorting(sorting: Sorting<EnumSubscriptionBillingSortField>[]): void {
    this.props.setSubBillingSorting(sorting);
    this.findSubscriptionBilling();
  }

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  viewPayIn(key: string): void {
    const path = buildPath(DynamicRoutes.PayInView, [key]);
    this.props.navigate(path);
  }

  viewUseStatistics(billingRecord: SubscriptionBilling | null) {
    this.setState({ billingRecord });
  }

  renderAccountData() {
    const { account = null, classes } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!account) {
      return null;
    }

    const provider = account.profile.provider.current;
    const consumer = account.profile.consumer.current;
    const parent = account.parent;
    const organization = parent?.profile?.provider?.current;

    return (
      <Grid container>
        <Grid container item xs={6} className={classes.alignSelfBaseline}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatar}>
                    <Icon path={account.type === EnumAccountType.VENDOR ? mdiDomain : mdiAccount} size="1.5rem" />
                  </Avatar>
                }
                title={_t({ id: 'account-marketplace.form.section.user' })}
              ></CardHeader>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption">
                      <FormattedMessage id={'account-marketplace.form.field.firstName'} />
                    </Typography>
                    <Typography gutterBottom>{account.profile.firstName}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption">
                      <FormattedMessage id={'account-marketplace.form.field.lastName'} />
                    </Typography>
                    <Typography gutterBottom>{account.profile.lastName}</Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="caption">
                      <FormattedMessage id={'account-marketplace.form.field.email'} />
                    </Typography>
                    <Grid container item justifyContent="flex-start" spacing={1}>
                      <Grid item>
                        <Typography gutterBottom>{account.email}</Typography>
                      </Grid>
                      <Grid item>
                        {account.emailVerified &&
                          <Icon color={'#4CAF50'} path={mdiCheckDecagramOutline} size="1.5rem" />
                        }
                        {!account.emailVerified &&
                          <Icon color={'#FF5722'} path={mdiAlertDecagramOutline} size="1.5rem" />
                        }
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {organization &&
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption">
                        <FormattedMessage id={'account-marketplace.form.field.parent'} />
                      </Typography>
                      <Link to={buildPath(DynamicRoutes.MarketplaceAccountView, [organization.key])} className={classes.link}>
                        <Typography gutterBottom>{this.getCustomerName(organization)}</Typography>
                      </Link>
                    </Grid>
                  </Grid>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatar}>
                    <Icon path={mdiListStatus} size="1.5rem" />
                  </Avatar>
                }
                title={
                  <a className={classes.link} href={`/workflows/process-instances/record?businessKey=${account.key}`}>
                    <FormattedMessage id={'account-marketplace.form.section.registration'} />
                  </a>
                }
              ></CardHeader>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="caption">
                      <FormattedMessage id={'account-marketplace.form.field.registeredAt'} />
                    </Typography>
                    <Typography gutterBottom>
                      <FormattedTime value={account.registeredAt.toDate()} day='numeric' month='numeric' year='numeric' />
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption">
                      <FormattedMessage id={'account-marketplace.form.field.registration-status'} />
                    </Typography>
                    {account.activationStatus === EnumActivationStatus.COMPLETED &&
                      <div className={classes.statusLabel}>
                        <div>{account.activationStatus}</div>
                      </div>
                    }
                    {account.activationStatus === EnumActivationStatus.PENDING &&
                      <div className={classes.statusLabelWarning}>
                        <div>{account.activationStatus}</div>
                      </div>
                    }
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container item xs={6}>
          {consumer &&
            <Grid item xs={12}>
              {this.renderCustomer(consumer, EnumCustomerType.CONSUMER)}
            </Grid>
          }
          {provider &&
            <Grid item xs={12}>
              {this.renderCustomer(provider, EnumCustomerType.PROVIDER)}
            </Grid>
          }
        </Grid>
      </Grid>
    );
  }

  render() {
    const {
      account = null,
      classes,
      config,
      loading,
      orders,
      payins,
      payouts,
      subscriptions,
      subscriptionBilling,
      transfers,
      tabIndex,
    } = this.props;
    const {
      billingRecord,
      initialExternalProvider,
      initialOpenDatasetProvider,
      loaded,
    } = this.state;

    if (!account) {
      return null;
    }

    const provider = account.profile.provider.current;
    const consumer = account.profile.consumer.current;

    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <Tabs
              value={tabIndex}
              indicatorColor="primary"
              textColor="primary"
              onChange={(event, tabIndex) => this.setTabIndex(tabIndex)}
              variant="fullWidth"
            >
              <Tab icon={<Icon path={mdiAccountCircleOutline} size="1.5rem" />} label="Account" />
              {consumer &&
                <Tab icon={<Icon path={mdiPackageVariantClosed} size="1.5rem" />} label="Orders" />
              }
              {consumer &&
                <Tab icon={<Icon path={mdiBankTransferIn} size="1.5rem" />} label="Pay Ins" />
              }
              {consumer &&
                <Tab icon={<Icon path={mdiClockFast} size="1.5rem" />} label="Subscriptions" />
              }
              {provider &&
                <Tab icon={<Icon path={mdiWalletPlusOutline} size="1.5rem" />} label="Transfers" />
              }
              {provider &&
                <Tab icon={<Icon path={mdiBankTransferOut} size="1.5rem" />} label="Pay Outs" />
              }
              {provider &&
                <Tab icon={<Icon path={mdiTuneVariant} size="1.5rem" />} label="Configuration" />
              }
            </Tabs>
          </Grid>
          {tabIndex === 0 &&
            this.renderAccountData()
          }
          {tabIndex === 1 && consumer &&
            <Grid item xs={12}>
              <Paper className={classes.paperTable}>
                <OrderTable
                  find={this.props.findOrders}
                  loading={loading}
                  mode={EnumBillingViewMode.CONSUMER}
                  pagination={orders.pagination}
                  query={orders.query}
                  result={orders.items}
                  selected={[]}
                  setPager={this.props.setOrderPager}
                  setSorting={(sorting: Sorting<EnumOrderSortField>[]) => this.setOrderSorting(sorting)}
                  sorting={orders.sorting}
                  viewProcessInstance={this.viewProcessInstance}
                />
              </Paper>
            </Grid>
          }
          {(
            (tabIndex === 1 && !consumer && provider) ||
            (tabIndex === 4 && consumer && provider)
          ) &&
            <Grid item xs={12}>
              <Paper className={classes.paperTable}>
                <TransferTable
                  find={this.props.findTransfers}
                  loading={loading}
                  mode={EnumBillingViewMode.PROVIDER}
                  pagination={transfers.pagination}
                  query={transfers.query}
                  result={transfers.items}
                  setPager={this.props.setTransferPager}
                  setSorting={(sorting: Sorting<EnumTransferSortField>[]) => this.setTransferSorting(sorting)}
                  sorting={transfers.sorting}
                />
              </Paper>
            </Grid>
          }
          {tabIndex === 2 && consumer &&
            <Grid item xs={12}>
              <Paper className={classes.paperTable}>
                <PayInTable
                  find={this.props.findPayIns}
                  loading={loading}
                  mode={EnumBillingViewMode.CONSUMER}
                  pagination={payins.pagination}
                  query={payins.query}
                  result={payins.items}
                  selected={[]}
                  setPager={this.props.setPayInPager}
                  setSorting={(sorting: Sorting<EnumPayInSortField>[]) => this.setPayInSorting(sorting)}
                  sorting={payins.sorting}
                  viewPayIn={this.viewPayIn}
                  viewProcessInstance={this.viewProcessInstance}
                />
              </Paper>
            </Grid>
          }
          {(
            (tabIndex === 2 && !consumer && provider) ||
            (tabIndex === 5 && consumer && provider)
          ) &&
            <Grid item xs={12}>
              <Paper className={classes.paperTable}>
                <PayOutTable
                  find={this.props.findPayOuts}
                  loading={loading}
                  mode={EnumBillingViewMode.PROVIDER}
                  pagination={payouts.pagination}
                  query={payouts.query}
                  selected={[]}
                  setPager={this.props.setPayOutPager}
                  setSorting={(sorting: Sorting<EnumPayOutSortField>[]) => this.setPayOutSorting(sorting)}
                  result={payouts.items}
                  sorting={payouts.sorting}
                  viewProcessInstance={this.viewProcessInstance}
                />
              </Paper>
            </Grid>
          }
          {tabIndex === 3 && consumer &&
            <Grid container>
              <Grid item xs={12}>
                <Paper className={classes.paperTable}>
                  <div className={classes.gridLabel}>Subscriptions</div>
                  <SubscriptionTable
                    config={this.props.config}
                    find={this.props.findSubscriptions}
                    loading={loading}
                    mode={EnumBillingViewMode.CONSUMER}
                    pagination={subscriptions.pagination}
                    query={subscriptions.query}
                    selected={[]}
                    setPager={this.props.setSubscriptionPager}
                    setSorting={(sorting: Sorting<EnumSubscriptionSortField>[]) => this.setSubscriptionSorting(sorting)}
                    result={subscriptions.items}
                    sorting={subscriptions.sorting}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paperTable}>
                  <div className={classes.gridLabel}>Billing Records</div>
                  <SubscriptionBillingTable
                    config={this.props.config}
                    find={this.props.findSubscriptionBilling}
                    loading={loading}
                    mode={EnumBillingViewMode.CONSUMER}
                    pagination={subscriptionBilling.pagination}
                    query={subscriptionBilling.query}
                    selected={[]}
                    setPager={this.props.setSubBillingPager}
                    setSorting={(sorting: Sorting<EnumSubscriptionBillingSortField>[]) => this.setSubBillingSorting(sorting)}
                    result={subscriptionBilling.items}
                    sorting={subscriptionBilling.sorting}
                    viewPayIn={this.viewPayIn}
                    viewUseStatistics={this.viewUseStatistics}
                  />
                </Paper>
              </Grid>
            </Grid>
          }
          {(
            (loaded && tabIndex === 3 && !consumer && provider) ||
            (loaded && tabIndex === 6 && consumer && provider)
          ) &&
            <MarketplaceAccountConfiguration
              account={account}
              config={config}
              initialExternalProvider={initialExternalProvider}
              initialOpenDatasetProvider={initialOpenDatasetProvider}
              loading={loading}
              setExternalProvider={this.setExternalProvider}
              setOpenDatasetProvider={this.setOpenDatasetProvider}
            />
          }
        </Grid>
        <Drawer anchor={'right'} open={billingRecord !== null} onClose={() => this.viewUseStatistics(null)}
          classes={{
            paper: classes.statsDrawer,
          }}
        >
          <UseStatisticsState record={billingRecord!} />
        </Drawer>
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  account: state.account.marketplace.account,
  config: state.config,
  loading: state.account.marketplace.loading,
  orders: state.account.marketplace.orders,
  payins: state.account.marketplace.payins,
  payouts: state.account.marketplace.payouts,
  subscriptions: state.account.marketplace.subscriptions,
  subscriptionBilling: state.account.marketplace.billing.subscriptions,
  tabIndex: state.account.marketplace.tabIndex,
  transfers: state.account.marketplace.transfers,
});

const mapDispatch = {
  findOne: (key: string, tabIndex: number | null) => findOne(key, tabIndex),
  findOrders: (pageRequest?: PageRequest, sorting?: Sorting<EnumOrderSortField>[]) => findOrders(pageRequest, sorting),
  findPayIns: (pageRequest?: PageRequest, sorting?: Sorting<EnumPayInSortField>[]) => findPayIns(pageRequest, sorting),
  findTransfers: (pageRequest?: PageRequest, sorting?: Sorting<EnumTransferSortField>[]) => findTransfers(pageRequest, sorting),
  findPayOuts: (pageRequest?: PageRequest, sorting?: Sorting<EnumPayOutSortField>[]) => findPayOuts(pageRequest, sorting),
  findSubscriptions: (pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionSortField>[]) => findSubscriptions(pageRequest, sorting),
  findSubscriptionBilling: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionBillingSortField>[]
  ) => findSubscriptionBilling(pageRequest, sorting),
  setOrderPager,
  setOrderSorting,
  setPayInPager,
  setPayInSorting,
  setTransferPager,
  setTransferSorting,
  setPayOutPager,
  setPayOutSorting,
  setSubscriptionPager,
  setSubscriptionSorting,
  setSubBillingPager,
  setSubBillingSorting,
  setTabIndex,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const StyledComponent = withStyles(styles)(MarketplaceAccountForm);

// Inject i18n resources
const LocalizedComponent = injectIntl(StyledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params: RouteParams = useParams();

  return (
    <ConnectedComponent navigate={navigate} location={location} params={params} />
  );
}

export default RoutedComponent;
