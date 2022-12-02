import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
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
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/consumer/actions';
import { find } from 'store/consumer/thunks';
import { toggleSendMessageDialog } from 'store/message/actions';

// Model
import { PageRequest, Sorting } from 'model/response';
import { EnumMarketplaceAccountSortField, MarketplaceAccountSummary } from 'model/account-marketplace';
import { ClientContact } from 'model/chat';

// Components
import DateTime from 'components/common/date-time';
import ConsumerFilters from './grid/filter';
import ConsumerTable from './grid/table';

const styles = (theme: Theme) => createStyles({
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
  },
});

interface ConsumerManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class ConsumerManager extends React.Component<ConsumerManagerProps> {

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

  setSorting(sorting: Sorting<EnumMarketplaceAccountSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  showSendMessageDialog(row: MarketplaceAccountSummary) {
    const contact = this.getContact(row);
    this.props.toggleSendMessageDialog(contact);
  }

  getContact(row: MarketplaceAccountSummary): ClientContact {
    return {
      id: row.key,
      logoImage: row.image,
      logoImageMimeType: row.imageMimeType,
      name: row.consumerName,
      email: row.email,
    };
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
            <ConsumerFilters
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
                    <FormattedMessage id="account.marketplace.last-update" />
                    <DateTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <ConsumerTable
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumMarketplaceAccountSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              sendMessage={(row: MarketplaceAccountSummary) => this.showSendMessageDialog(row)}
              sorting={sorting}
              loading={loading}
            />
          </Paper>
        </div>
      </>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.account.consumer,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMarketplaceAccountSortField>[]) => find(pageRequest, sorting),
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
const styledComponent = withStyles(styles)(ConsumerManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
