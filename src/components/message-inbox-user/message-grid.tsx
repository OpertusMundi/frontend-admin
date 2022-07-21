import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// 3rd party components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';

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
import { find, readMessage, replyToMessage, sendMessage, getThreadMessages, findContacts } from 'store/message-inbox-user/thunks';
import { countNewMessages } from 'store/message-inbox-user/thunks';

// Model
import { PageRequest, Sorting } from 'model/response';
import { EnumMessageSortField, ClientMessage, ClientMessageCommand, MessageQuery } from 'model/chat';

// Components
import MessageFilters from './grid/filter';
import Message from 'components/message/message';
import MessageHeader from 'components/message/message-header';
import MessageSend from 'components/message/message-send';

const styles = (theme: Theme) => createStyles({
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  },
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
  paginationToolbar: {
    paddingLeft: theme.spacing(1),
  },
  messageListContainer: {
    marginRight: theme.spacing(1),
  },
  messageList: {
    maxHeight: 'calc(100vh - 120px)',
  },
});

interface MessageManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
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
    this.props.readMessage(messageKey).then(() => {
      this.props.countNewMessages();
    });
  }

  sendMessage(userKey: string, messageKey: string, threadKey: string, subject: string, text: string): Promise<ClientMessage | null> {
    if (threadKey) {
      return this.props.replyToMessage(threadKey, { subject, text })
        .then((m) => {
          message.infoHtml(
            <FormattedMessage id="inbox.user.message-sent" />,
            () => (<Icon path={mdiSendOutline} size="2rem" />)
          );

          return m;
        })
        .then((m) => {
          this.find();
          this.props.getThreadMessages(messageKey, threadKey);

          return m;
        });
    }

    return Promise.resolve(null);
  }

  selectMessage(message: ClientMessage): void {
    this.props.resetSelection();
    this.props.addToSelection([message]);

    if (this.readTimer !== null) {
      window.clearTimeout(this.readTimer);
    }
    if (!message.read) {
      this.readTimer = window.setTimeout(() => {
        this.readMessage(message.id);
      }, 2000);
    }

    this.props.getThreadMessages(message.id, message.thread);
  }

  render() {
    const {
      classes,
      find,
      inbox,
      inbox: { contacts, messages, loading, selectedMessages, thread },
      profile,
      setPager,
    } = this.props;

    const items = messages?.result?.items || [];

    const page = (messages?.result?.pageRequest.page || 0);
    const size = messages?.result?.pageRequest.size || 10;

    return (
      <Grid container direction="row" spacing={1}>
        <Grid container item xs={12} style={{ paddingLeft: 16 }}>
          <MessageFilters
            contacts={contacts}
            query={inbox.query}
            find={this.props.find}
            findContacts={this.props.findContacts}
            resetFilter={() => this.props.resetFilter()}
            setFilter={(query: Partial<MessageQuery>) => this.props.setFilter(query)}
          />
        </Grid>
        {!loading && items.length === 0 &&
          <Grid item xs={12}>
            <Alert severity="info">No messages found</Alert>
          </Grid>
        }
        {items.length !== 0 &&
          <>
            <Grid container item xs={12}>
              <TablePagination
                classes={{
                  toolbar: classes.paginationToolbar,
                }}
                component="div"
                rowsPerPageOptions={[10]}
                count={messages?.result?.count || 0}
                rowsPerPage={10}
                page={page}
                onPageChange={(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
                  setPager(newPage, size);

                  find();
                }}
                labelDisplayedRows={({ from, to, count }) => (
                  <FormattedMessage id="inbox.messages-displayed" values={{ from, to: (to === -1 ? count : to), count }} />
                )}
              />
            </Grid>
            <Grid item xs={5}>
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

            <Grid container item xs={7} direction={'column'}>
              {thread && thread.result &&
                <PerfectScrollbar className={classes.messageList} options={{ suppressScrollX: true }}>
                  {thread.result!.messages.map((m, index) => (
                    <Grid container item key={m.id}>
                      <Message
                        align={profile!.key === m.senderId ? 'right' : 'left'}
                        message={m}
                        size={'lg'}
                        hideHeader={index !== 0}
                        selected={!!selectedMessages.find((s) => s.id === m.id)}
                      />
                    </Grid>
                  ))}
                  <Grid container item>
                    <MessageSend
                      align={'right'}
                      message={thread.result!.messages[thread.result!.messages.length - 1] || null}
                      readOnly={loading}
                      send={this.sendMessage}
                    />
                  </Grid>
                </PerfectScrollbar>
              }
            </Grid>
          </>
        }
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
  findContacts: (email: string) => findContacts(email),
  readMessage: (messageKey: string) => readMessage(messageKey),
  removeFromSelection,
  replyToMessage: (threadKey: string, command: ClientMessageCommand) => replyToMessage(threadKey, command),
  resetFilter,
  resetSelection,
  sendMessage: (userKey: string, command: ClientMessageCommand) => sendMessage(userKey, command),
  setFilter,
  setPager,
  setSorting,
  getThreadMessages: (messageKey: string, threadKey: string) => getThreadMessages(messageKey, threadKey),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(MessageManager);

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
