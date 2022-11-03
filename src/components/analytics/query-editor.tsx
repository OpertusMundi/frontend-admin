import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Services
import message from 'service/message';
import HelpdeskAccountApi from 'service/account';

// Store
import { RootState } from 'store';
import { resetFilter, setFilter } from 'store/analytics/actions';
import { executeQuery } from 'store/analytics/thunks';

// Components
import QueryEditorFilters from './components/filter';
import ChartArea from './components/chart';

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

interface QueryEditorState {
}

interface QueryEditorProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class QueryEditor extends React.Component<QueryEditorProps, QueryEditorState> {

  private api: HelpdeskAccountApi;

  constructor(props: QueryEditorProps) {
    super(props);

    this.api = new HelpdeskAccountApi();
  }

  state: QueryEditorState = {
  }


  executeQuery(): void {
    this.props.executeQuery().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  render() {
    const {
      classes,
      editor: { query, loading, response },
      setFilter,
      resetFilter,
    } = this.props;

    return (
      <div>
        <Paper className={classes.paper}>
          <QueryEditorFilters
            query={query}
            setFilter={setFilter}
            resetFilter={resetFilter}
            disabled={loading}
          />
        </Paper>

        {response?.result && response?.result.points.length !== 0 &&
          <Paper className={classes.paper}>
            <ChartArea data={response?.result || null}
            />
          </Paper>
        }
      </div>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  editor: state.analytics,
});

const mapDispatch = {
  executeQuery: () => executeQuery(),
  resetFilter,
  setFilter,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(QueryEditor);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
