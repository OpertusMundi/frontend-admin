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
import { mdiCheckOutline, mdiCommentAlertOutline, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import WorkflowApi from 'service/workflow';

// Store
import { RootState } from 'store';
import {
  addToSelection,
  removeFromSelection,
  resetFilter,
  resetSelection,
  setFilter,
  setPager,
  setSorting,
} from 'store/incident/actions';
import { find } from 'store/incident/thunks';

// Model
import { PageRequest, Sorting } from 'model/response';
import { EnumIncidentSortField, Incident } from 'model/workflow';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

import IncidentFilters from './incident/filter';
import IncidentTable from './incident/table';

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
    paddingLeft: 0,
    fontSize: '0.7rem',
  }
});

interface WorkflowManagerState {
  retry: boolean;
  incident: Incident | null,
}

interface WorkflowManagerProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps {
  intl: IntlShape,
}

class IncidentManager extends React.Component<WorkflowManagerProps, WorkflowManagerState> {

  private api: WorkflowApi;

  constructor(props: WorkflowManagerProps) {
    super(props);

    this.api = new WorkflowApi();

    this.viewIncident = this.viewIncident.bind(this);
  }

  state: WorkflowManagerState = {
    retry: false,
    incident: null,
  }

  showRetryDialog(incident: Incident): void {
    this.setState({
      retry: true,
      incident,
    });
  }

  hideRetryDialog(): void {
    this.setState({
      retry: false,
      incident: null,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    const { incident } = this.state;

    switch (action.key) {
      case EnumDialogAction.Accept: {
        if (incident) {
          // this.api.accept(workflow.publisher.id, workflow.key)
          //   .then((response) => {
          //     if (response.data.success) {
          //       this.find();

          //       message.info('workflow.message.accept-success');

          //       this.hideRetryDialog();
          //     } else {
          //       const messages = localizeErrorCodes(this.props.intl, response.data);
          //       message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
          //     }
          //   })
          //   .catch((err: AxiosError<SimpleResponse>) => {
          //     const messages = localizeErrorCodes(this.props.intl, err.response?.data);
          //     message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
          //   });
        }
        break;
      }
      case EnumDialogAction.Cancel:
        this.hideRetryDialog();
        break;
    }
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

  viewIncident(key: string): void {
    const { workflow: { incidents: { result } } } = this.props;

    const record = result?.items.find(i => i.incidentId === key);

    if (record) {
      this.showRetryDialog(record);
    }
  }

  setSorting(sorting: Sorting<EnumIncidentSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      addToSelection,
      classes,
      workflow: { incidents: { query, result, pagination, selected, sorting, loading, lastUpdated } },
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
            <IncidentFilters
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
                    <FormattedMessage id="workflow.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paperTable}>
            <IncidentTable
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumIncidentSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              viewRow={(key: string) => this.viewIncident(key)}
              sorting={sorting}
              loading={loading}
            />
          </Paper>
        </div >
        {this.renderReviewDialog()}
      </>
    );
  }

  renderReviewDialog() {
    const _t = this.props.intl.formatMessage;

    const { retry, incident: record } = this.state;

    if (!retry || !record) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Accept,
            label: _t({ id: 'view.shared.action.accept' }),
            iconClass: () => (<Icon path={mdiCheckOutline} size="1.5rem" />),
            color: 'primary',
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideRetryDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={retry}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormattedMessage
              id="workflow.message.review-workflow"
              values={{ title: record.processDefinitionName, version: record.processDefinitionVersion }}
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  workflow: state.workflow,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumIncidentSortField>[]) => find(pageRequest, sorting),
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
const styledComponent = withStyles(styles)(IncidentManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
