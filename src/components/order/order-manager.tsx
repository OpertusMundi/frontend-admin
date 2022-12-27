import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/order/actions';
import { find } from 'store/order/thunks';
import { toggleSendMessageDialog } from 'store/message/actions';

// Utilities
import { download as downloadInvoice } from 'utils/invoice';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { PageRequest, Sorting } from 'model/response';
import { EnumOrderSortField, Order } from 'model/order';
import { ClientContact } from 'model/chat';
import { CustomerIndividual, CustomerProfessional, EnumMangopayUserType } from 'model/account-marketplace';

// Components
import DateTime from 'components/common/date-time';
import OrderFilters from './grid/filter';
import OrderTable from './grid/table';

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

interface OrderManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class OrderManager extends React.Component<OrderManagerProps> {

  constructor(props: OrderManagerProps) {
    super(props);

    this.downloadInvoice = this.downloadInvoice.bind(this);
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

  downloadInvoice(row: Order): void {
    if (row) {
      downloadInvoice(row.key);
    }
  }

  viewProcessInstance(processInstance: string): void {
    const path = buildPath(DynamicRoutes.ProcessInstanceView, null, { processInstance });
    this.props.navigate(path);
  }

  setSorting(sorting: Sorting<EnumOrderSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  showSendMessageDialog(row: Order) {
    const contact = this.getContact(row);
    this.props.toggleSendMessageDialog(contact, `Order ${row.referenceNumber}`);
  }

  getContact(row: Order): ClientContact | null {
    if (row.consumer && row.consumer.type === EnumMangopayUserType.INDIVIDUAL) {
      const c = row.consumer as CustomerIndividual;
      return {
        id: c.key,
        logoImage: null,
        logoImageMimeType: null,
        name: [c.firstName, c.lastName].join(' '),
        email: row.consumer!.email,
      };
    } else if (row.consumer && row.consumer?.type === EnumMangopayUserType.PROFESSIONAL) {
      const c = row.consumer as CustomerProfessional;
      return {
        id: c.key,
        logoImage: c.logoImage,
        logoImageMimeType: c.logoImageMimeType,
        name: c.name,
        email: row.consumer!.email,
      };
    }

    return null;
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
      <div>
        <Paper className={classes.paper}>
          <OrderFilters
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
                  <FormattedMessage id="billing.order.last-update" />
                  <DateTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                </Typography>
              </Grid>
            </Grid>
          }
        </Paper>

        <Paper className={classes.paperTable}>
          <OrderTable
            addToSelection={addToSelection}
            downloadInvoice={this.downloadInvoice}
            find={this.props.find}
            loading={loading}
            pagination={pagination}
            removeFromSelection={removeFromSelection}
            query={query}
            resetSelection={resetSelection}
            selected={selected}
            sendMessage={(row: Order) => this.showSendMessageDialog(row)}
            setPager={setPager}
            setSorting={(sorting: Sorting<EnumOrderSortField>[]) => this.setSorting(sorting)}
            result={result}
            sorting={sorting}
            viewProcessInstance={this.viewProcessInstance}
          />
        </Paper>
      </div>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.billing.order,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumOrderSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
  toggleSendMessageDialog,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(OrderManager);

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
