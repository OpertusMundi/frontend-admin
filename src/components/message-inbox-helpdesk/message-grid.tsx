import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline, mdiTrashCan, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import MessageApi from 'service/chat';

// Store
import { RootState } from 'store';
import {
  addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting,
} from 'store/message-inbox-helpdesk/actions';
import { find, assignMessageToUser } from 'store/message-inbox-helpdesk/thunks';
import { countNewMessages } from 'store/message-inbox-user/thunks';

// Model
import { PageRequest, Sorting } from 'model/response';
import { EnumMessageSortField, ClientMessage } from 'model/chat';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';
import Message from 'components/message/message';

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

interface MessageManagerState {
  confirm: boolean;
  record: ClientMessage | null
}

interface MessageManagerProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps {
  intl: IntlShape,
}

class MessageManager extends React.Component<MessageManagerProps, MessageManagerState> {

  private api: MessageApi;

  constructor(props: MessageManagerProps) {
    super(props);

    this.api = new MessageApi();
  }

  state: MessageManagerState = {
    confirm: false,
    record: null,
  }

  showConfirmDialog(record: ClientMessage): void {
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
      case EnumDialogAction.Yes:
        break;

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

  setSorting(sorting: Sorting<EnumMessageSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  assign(id: string): void {
    this.props.assignMessageToUser(id)
      .then((m: ClientMessage | null) => {
        message.info('inbox.helpdesk.message-assigned');

        return m!;
      })
      .then(() => {
        this.props.find();
      })
      .then(() => {
        this.props.countNewMessages();
      });
  }

  render() {
    const {
      addToSelection,
      classes,
      find,
      inbox: { query, messages, pagination, loading, lastUpdated, selected, sorting },
      setPager,
      setFilter,
      removeFromSelection,
      resetFilter,
    } = this.props;

    const items = messages?.result?.items || [];

    return (
      <>
        <div>
          {/* <Paper className={classes.paper}>
            <MessageFilters
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
                    <FormattedTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper> */}

          {items.map((m) => (
            <Message message={m} key={m.id} assign={(id: string) => this.assign(id)} />
          ))}

          {!loading && items.length === 0 &&
            <Alert severity="info">No new messages found!</Alert>
          }

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
        <FormattedMessage id="view.shared.message.delete-confirm" values={{ name: record.text }} />
      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  inbox: state.message.helpdeskInbox
});

const mapDispatch = {
  addToSelection,
  assignMessageToUser: (messageKey: string) => assignMessageToUser(messageKey),
  countNewMessages: () => countNewMessages(),
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMessageSortField>[]) => find(pageRequest, sorting),
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
const styledComponent = withStyles(styles)(MessageManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
