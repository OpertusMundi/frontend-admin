import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// 3rd party components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';

import PerfectScrollbar from 'react-perfect-scrollbar';

// Icons
import Icon from '@mdi/react';
import {
  mdiCommentAlertOutline,
  mdiSendOutline,
} from '@mdi/js';

// Services
import message from 'service/message';
import MessageApi from 'service/chat';

// Store
import { RootState } from 'store';
import {
  addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting,
} from 'store/message-inbox-user/actions';
import { find, readMessage, replyToMessage, sendMessage, getThreadMessages } from 'store/message-inbox-user/thunks';
import { countNewMessages } from 'store/message-inbox-user/thunks';

// Model
import { PageRequest, Sorting } from 'model/response';
import { EnumMessageSortField, ClientMessage, ClientMessageCommand } from 'model/chat';

// Components
import Message from 'components/message/message';
import MessageHeader from 'components/message/message-header';
import MessageSend from 'components/message/message-send';

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
  },
  messageListContainer: {
    marginRight: theme.spacing(1),
  },
  messageList: {
    maxHeight: 'calc(100vh - 120px)',
  },
});

interface MessageManagerProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps {
  intl: IntlShape,
}

class MessageManager extends React.Component<MessageManagerProps> {

  private api: MessageApi;

  private readTimer: number | null;

  constructor(props: MessageManagerProps) {
    super(props);

    this.api = new MessageApi();

    this.readTimer = null;

    this.sendMessage = this.sendMessage.bind(this);
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

  readMessage(messageKey: string): void {
    this.props.readMessage(messageKey);
  }

  sendMessage(userKey: string, threadKey: string, text: string): void {
    if (threadKey) {
      this.props.replyToMessage(threadKey, { text })
        .then((m) => {
          message.infoHtml(
            <FormattedMessage id="inbox.user.message-sent" />,
            () => (<Icon path={mdiSendOutline} size="2rem" />)
          );
        })
        .then(() => {
          this.find();
          this.props.getThreadMessages(threadKey);
        })
    }
  }

  selectMessage(message: ClientMessage): void {
    this.props.resetSelection();
    this.props.addToSelection([message]);

    if (this.readTimer !== null) {
      window.clearTimeout(this.readTimer);
    }
    if (!message.read) {
      this.readTimer = window.setTimeout(() => {
        this.props.readMessage(message.id);
      }, 3000);
    }

    this.props.getThreadMessages(message.thread);
  }

  render() {
    const {
      classes,
      find,
      inbox: { messages, loading, selectedMessages, thread },
      profile,
      setPager,
    } = this.props;

    const items = messages?.result?.items || [];

    const pages = Math.ceil((messages?.result?.count || 0) / (messages?.result?.pageRequest.size || 10));
    const page = (messages?.result?.pageRequest.page || 0) + 1;
    const size = messages?.result?.pageRequest.size || 10;

    if (!loading && items.length === 0) {
      return (
        <Alert severity="info">Inbox is empty</Alert>
      );
    }

    return (
      <Grid container direction="row" spacing={1}>
        <Grid container item xs={12}>
          <Pagination
            count={pages}
            boundaryCount={1}
            siblingCount={0}
            page={page}
            showFirstButton
            showLastButton
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              setPager(value - 1, size);

              find();
            }}
          />
        </Grid>
        <Grid container item xs={4}>
          <PerfectScrollbar className={classes.messageList} options={{ suppressScrollX: true }}>
            <div className={classes.messageListContainer}>

              {items.map((m) => (
                <MessageHeader
                  key={m.id}
                  message={m}
                  read={(id: string) => this.readMessage(id)}
                  select={(message: ClientMessage) => this.selectMessage(message)}
                  selected={!!selectedMessages.find((s) => s.id === m.id)}
                />
              ))}
            </div>
          </PerfectScrollbar>
        </Grid>
        <Grid container item xs={8} direction={'column'}>
          {thread && thread.result &&
            <PerfectScrollbar className={classes.messageList} options={{ suppressScrollX: true }}>
              {thread.result!.map((m) => (
                <Grid container item key={m.id}>
                  <Message
                    align={profile!.key === m.senderId ? 'right' : 'left'}
                    message={m}
                    size={'lg'}
                  />
                </Grid>
              ))}
              <Grid container item>
                <MessageSend
                  align={'right'}
                  message={thread.result![thread.result!.length - 1] || null}
                  readOnly={loading}
                  send={this.sendMessage}
                />
              </Grid>
            </PerfectScrollbar>
          }
        </Grid>
      </Grid>
    );

  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  inbox: state.message.userInbox,
  profile: state.security.profile,
});

const mapDispatch = {
  addToSelection,
  countNewMessages: () => countNewMessages(),
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMessageSortField>[]) => find(pageRequest, sorting),
  readMessage: (messageKey: string) => readMessage(messageKey),
  removeFromSelection,
  replyToMessage: (threadKey: string, command: ClientMessageCommand) => replyToMessage(threadKey, command),
  resetFilter,
  resetSelection,
  sendMessage: (userKey: string, command: ClientMessageCommand) => sendMessage(userKey, command),
  setFilter,
  setPager,
  setSorting,
  getThreadMessages: (threadKey: string) => getThreadMessages(threadKey),
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
