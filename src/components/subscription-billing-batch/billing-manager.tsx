import moment from 'utils/moment-localized';

import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedDate, FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

// Handle Moment dates for material UI pickers
import DateFnsUtils from '@date-io/moment';

// Icons
import Icon from '@mdi/react';
import {
  mdiCalendarCheckOutline,
  mdiCalendarRemoveOutline,
  mdiCalendarStartOutline,
  mdiCheck,
  mdiCommentAlertOutline,
  mdiUndoVariant,
} from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import {
  resetFilter,
  setFilter,
  setPager,
  setSorting,
  toggleBillingTaskForm,
  setBillingTaskParams,
} from 'store/subscription-billing/actions';
import { find, create } from 'store/subscription-billing/thunks';

// Model
import { Message } from 'model/message';
import { FieldMapperFunc, localizeErrorCodes } from 'utils/error';
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumSubscriptionBillingBatchSortField } from 'model/subscription-billing';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';
import DateTime from 'components/common/date-time';

import SubscriptionBillingFilters from './grid/filter';
import SubscriptionBillingTable from './grid/table';

const styles = (theme: Theme) => createStyles({
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  },
  red700: {
    color: '#D32F2F',
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  paperTable: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
    overflowX: 'auto',
  },
  title: {
    marginTop: theme.spacing(2),
  },
});

const mapErrorCodeToText = (intl: IntlShape, message: Message, fieldMapper?: FieldMapperFunc) => {
  switch (message.code) {
    case 'PaymentMessageCode.QUOTATION_INTERVAL_MONTH':
    case 'PaymentMessageCode.SUBSCRIPTION_BILLING_RUNNING':
    case 'PaymentMessageCode.VALIDATION_ERROR':
    case 'PaymentMessageCode.USE_STATS_NOT_READY':
      return message.description;
  }

  return null;
};

interface SubscriptionBillingManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class SubscriptionBillingManager extends React.Component<SubscriptionBillingManagerProps> {

  private refreshCountersInterval: number | null = null;

  constructor(props: SubscriptionBillingManagerProps) {
    super(props);

    this.viewProcessInstance = this.viewProcessInstance.bind(this);
  }

  componentDidMount() {
    this.find();

    this.refreshCountersInterval = window.setInterval(() => {
      this.props.find();
    }, 5 * 60 * 1000);
  }

  componentWillUnmount() {
    if (this.refreshCountersInterval != null) {
      clearInterval(this.refreshCountersInterval);
      this.refreshCountersInterval = null;
    }
  }

  find(): void {
    this.props.find().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  setSorting(sorting: Sorting<EnumSubscriptionBillingBatchSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  createBillingTask(action: DialogAction): void {
    const _fm = this.props.intl.formatMessage;

    switch (action.key) {
      case EnumDialogAction.Yes: {
        const { year, month } = this.props.configureTask!;
        if (year === null || month === null) {
          return;
        }

        this.props.create(year, month)
          .then((response) => {
            if (response === null) {
              return;
            }
            const { success } = response;
            if (success) {
              message.infoHtml(
                <FormattedMessage
                  id={'billing.subscription-billing-batch.message.create-success'}
                  values={{ interval: (<b>{_fm({ id: `enum.month.${month + 1}` })}{' '}{year}</b>) }}
                />,
                () => (<Icon path={mdiCalendarCheckOutline} size="3rem" />),
              );

              this.find();

              this.props.toggleBillingTaskForm(false);
            } else {
              const messages = localizeErrorCodes(
                this.props.intl, response, true, undefined, mapErrorCodeToText
              );
              message.errorHtml(messages, () => (<Icon path={mdiCalendarRemoveOutline} size="3rem" />));
            }
          })
          .catch((err) => {
            message.errorHtml("Failed to create subscription billing task", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
          })
          .finally(() => {
            this.setState({
              processing: false,
            });
          });
        break;
      }

      default:
        this.props.toggleBillingTaskForm(false);
        break;
    }

  }

  render() {
    const {
      classes,
      explorer: { query, result, pagination, loading, lastUpdated, selected, sorting },
      find,
      setPager,
      setFilter,
      resetFilter,
    } = this.props;

    return (
      <>
        <div>
          <Paper className={classes.paper}>
            <SubscriptionBillingFilters
              query={query}
              setFilter={setFilter}
              resetFilter={resetFilter}
              find={find}
              disabled={loading}
            />
            {lastUpdated &&
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom className={classes.caption}>
                    <FormattedMessage id="billing.subscription-billing-batch.last-update" />
                    <DateTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <SubscriptionBillingTable
              find={this.props.find}
              loading={loading}
              pagination={pagination}
              query={query}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumSubscriptionBillingBatchSortField>[]) => this.setSorting(sorting)}
              result={result}
              sorting={sorting}
              viewProcessInstance={this.viewProcessInstance}
            />
          </Paper>
        </div>
        {this.renderCreateBillingTaskForm()}
      </>
    );
  }

  renderCreateBillingTaskForm() {
    const _t = this.props.intl.formatMessage;
    const { classes, config: { quotationMinOffset = 0 }, configureTask, explorer: { loading } } = this.props;

    if (!configureTask) {
      return null;
    }

    const today = moment();
    const todayYear = today.year();
    const todayMonth = today.month();
    const maxYear = todayMonth === 0 ? todayYear - 1 : todayYear;
    const maxMonth = todayMonth === 0 ? 11 : todayMonth - 1;
    const year = configureTask.year || maxYear;
    const month = configureTask.month ?? maxMonth;
    const statsReadyDate = moment(month === 11 ? [year + 1, 0, quotationMinOffset + 1] : [year, month + 1, quotationMinOffset + 1]);

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Yes,
            label: _t({ id: 'view.shared.action.yes' }),
            iconClass: () => (<Icon path={mdiCheck} size="1.5rem" />),
            color: 'primary',
            disabled: loading
          }, {
            key: EnumDialogAction.No,
            label: _t({ id: 'view.shared.action.no' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />),
            disabled: loading
          }
        ]}
        handleClose={() => this.props.toggleBillingTaskForm(false)}
        handleAction={(action) => this.createBillingTask(action)}
        header={
          <div className={classes.dialogHeader}>
            <Icon path={mdiCalendarStartOutline} size="1.5rem" style={{ marginRight: 16 }} />
            <FormattedMessage id="billing.subscription-billing-batch.dialog.title" />
          </div>
        }
        open={configureTask !== null}
      >
        <MuiPickersUtilsProvider libInstance={moment} utils={DateFnsUtils}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DatePicker
                views={["year", "month"]}
                label="Year and Month"
                minDate={moment('2020-01-01')}
                maxDate={moment([maxYear, maxMonth, 1])}
                value={moment([year, month, 1])}
                onChange={(date: MaterialUiPickersDate): void => {
                  this.props.setBillingTaskParams(date?.year() || maxYear, date?.month() ?? maxMonth);
                }}
                helperText={
                  <span className={statsReadyDate.isAfter(today) ? classes.red700 : ''}>
                    <span>Subscription use statistics will be available on </span>
                    <b><FormattedDate value={statsReadyDate.toDate()} day='numeric' month='numeric' year='numeric' /></b>
                  </span>
                }
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Dialog>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  configureTask: state.billing.subscriptionBilling.configureTask,
  explorer: state.billing.subscriptionBilling,
});

const mapDispatch = {
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumSubscriptionBillingBatchSortField>[]) => find(pageRequest, sorting),
  create: (year: number, month: number) => create(year, month),
  resetFilter,
  setBillingTaskParams,
  setFilter,
  setPager,
  setSorting,
  toggleBillingTaskForm,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(SubscriptionBillingManager);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent navigate={navigate} location={location} />
  );
}

export default RoutedComponent;

