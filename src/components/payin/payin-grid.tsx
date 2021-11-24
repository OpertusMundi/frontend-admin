import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
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
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/payin/actions';
import { find } from 'store/payin/thunks';
import { createTransfer } from 'store/transfer/thunks';


// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumPayInSortField } from 'model/order';

// Components
import PayInFilters from './grid/filter';
import PayInTable from './grid/table';

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

interface PayInManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class PayInManager extends React.Component<PayInManagerProps> {

  constructor(props: PayInManagerProps) {
    super(props);

    this.createTransfer = this.createTransfer.bind(this);
    this.viewPayIn = this.viewPayIn.bind(this);
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

  viewPayIn(key: string): void {
    const path = buildPath(DynamicRoutes.PayInView, [key]);
    this.props.navigate(path);
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
              id={'billing.payin.message.transfer-success'}
              values={{
                count: response!.result!.length,
                creditedFunds: _t(creditedFunds, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }),
                fees: _t(fees, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }),
              }}
            />,
            () => (<Icon path={mdiWalletOutline} size="3rem" />),
          );

          this.find();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setSorting(sorting: Sorting<EnumPayInSortField>[]): void {
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
            <PayInFilters
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
                    <FormattedMessage id="billing.payin.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <PayInTable
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
              setSorting={(sorting: Sorting<EnumPayInSortField>[]) => this.setSorting(sorting)}
              result={result}
              sorting={sorting}
              viewPayIn={this.viewPayIn}
            />
          </Paper>
        </div >
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.billing.payin,
});

const mapDispatch = {
  addToSelection,
  createTransfer: (key: string) => createTransfer(key),
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumPayInSortField>[]) => find(pageRequest, sorting),
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
const styledComponent = withStyles(styles)(PayInManager);

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
