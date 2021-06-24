import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiWalletOutline } from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/payout/actions';
import { find } from 'store/payout/thunks';
import { createTransfer } from 'store/transfer/thunks';


// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumPayOutSortField } from 'model/order';

// Components
import PayOutFilters from './grid/filter';
import PayOutTable from './grid/table';

const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
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
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  }
});

interface PayOutManagerProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps {
  intl: IntlShape,
}

class PayOutManager extends React.Component<PayOutManagerProps> {

  constructor(props: PayOutManagerProps) {
    super(props);

    this.createTransfer = this.createTransfer.bind(this);
    this.viewPayOut = this.viewPayOut.bind(this);
    this.viewProcessInstance = this.viewProcessInstance.bind(this);
  }

  componentDidMount() {
    this.find();
  }

  find(): void {
    this.props.find().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  viewPayOut(key: string): void {
    const path = buildPath(DynamicRoutes.PayOutView, [key]);
    this.props.history.push(path);
  }

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.history.push(path);
  }

  createTransfer(key: string): void {
    const _t = this.props.intl.formatNumber;

    this.props.createTransfer(key)
      .then((response) => {
        if (response && response!.success) {
          const creditedFunds = response!.result!.reduce((total, transfer) => total + transfer.creditedFunds, 0);
          const fees = response!.result!.reduce((total, transfer) => total + transfer.fees, 0);
          message.infoHtml(
            <FormattedMessage
              id={'billing.payout.message.transfer-success'}
              values={{
                count: response!.result!.length,
                creditedFunds: _t(creditedFunds, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }),
                fees: _t(fees, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }),
              }}
            />,
            () => (<Icon path={mdiWalletOutline} size="3rem" />),
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setSorting(sorting: Sorting<EnumPayOutSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      addToSelection,
      classes,
      explorer: { query, result, pagination, loading, lastUpdated, selected, sorting },
      find,
      setPager,
      setFilter,
      removeFromSelection,
      resetFilter,
    } = this.props;

    return (
      <>
        <div>
          <Paper className={classes.paper}>
            <PayOutFilters
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
                    <FormattedMessage id="billing.payout.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <PayOutTable
              addToSelection={addToSelection}
              createTransfer={this.createTransfer}
              find={this.props.find}
              loading={loading}
              pagination={pagination}
              removeFromSelection={removeFromSelection}
              query={query}
              resetSelection={resetSelection}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumPayOutSortField>[]) => this.setSorting(sorting)}
              result={result}
              sorting={sorting}
              viewPayOut={this.viewPayOut}
              viewProcessInstance={this.viewProcessInstance}
            />
          </Paper>
        </div >
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.billing.payout,
});

const mapDispatch = {
  addToSelection,
  createTransfer: (key: string) => createTransfer(key),
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumPayOutSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(PayOutManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
