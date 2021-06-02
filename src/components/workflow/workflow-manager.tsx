import React from 'react';
import { AxiosError } from 'axios';

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
import { mdiCommentAlertOutline, mdiTrashCan, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import WorkflowApi from 'service/workflow';

// Store
import { RootState } from 'store';
import { setSelectedIncident } from 'store/workflow/actions';
import { getIncidents } from 'store/workflow/thunks';

// Utilities
import { localizeErrorCodes } from 'utils/error';

// Model
import { DynamicRoutes, buildPath } from 'model/routes';
import { PageRequest, Sorting, SimpleResponse } from 'model/response';
import { Account, EnumSortField } from 'model/account';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

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
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  }
});

interface WorkflowManagerState {
  confirm: boolean;
  record: Account | null
}

interface WorkflowManagerProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps {
  intl: IntlShape,
}

class WorkflowManager extends React.Component<WorkflowManagerProps, WorkflowManagerState> {

  private api: WorkflowApi;

  constructor(props: WorkflowManagerProps) {
    super(props);

    this.api = new WorkflowApi();

    this.resolveIncident = this.resolveIncident.bind(this);
  }

  state: WorkflowManagerState = {
    confirm: false,
    record: null,
  }

  showConfirmDialog(record: Account): void {
    this.setState({
      confirm: true,
      record,
    });
  }

  hideConfirmDialog(): void {
    this.setState({
      confirm: false,
      record: null,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Yes: {
        const { record } = this.state;

        break;
      }
    }

    this.hideConfirmDialog();
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

  createRow(): void {
    this.props.history.push(DynamicRoutes.AccountCreate);
  }

  updateRow(id: number): void {
    const path = buildPath(DynamicRoutes.AccountUpdate, [id.toString()]);

    this.props.history.push(path);
  }

  resolveIncident(id: number): void {
    const { explorer: { result } } = this.props;

    const record = result?.items.find(o => o.id === id);

    if (record) {
      this.showConfirmDialog(record);
    }
  }

  render() {
    const {
      classes,
      explorer: { query, result, pagination, loading, lastUpdated, selected, sorting },
    } = this.props;

    return (
      <>
        <div>
          <Paper className={classes.paper}>
            {lastUpdated &&
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom className={classes.caption}>
                    <FormattedMessage id="account.manager.last-update" />
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paper}>

          </Paper>
        </div >
        {this.renderConfirm()}
      </>
    );
  }

  renderConfirm() {
    const _t = this.props.intl.formatMessage;

    const { confirm, record } = this.state;

    if (!confirm || !record) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Yes,
            label: _t({ id: 'view.shared.action.yes' }),
            iconClass: () => (<Icon path={mdiTrashCan} size="1.5rem" />),
            color: 'primary',
          }, {
            key: EnumDialogAction.No,
            label: _t({ id: 'view.shared.action.no' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideConfirmDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirm}
      >
        <FormattedMessage id="view.shared.message.delete-confirm" values={{ name: record.email }} />
      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  explorer: state.account.explorer,
});

const mapDispatch = {
  find: () => getIncidents(),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(WorkflowManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
