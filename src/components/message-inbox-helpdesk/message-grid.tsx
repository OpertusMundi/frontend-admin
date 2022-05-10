import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

// Icons
import Icon from '@mdi/react';
import {
  mdiCommentAlertOutline,
} from '@mdi/js';

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
import Message from 'components/message/message';

const styles = (theme: Theme) => createStyles({
});

interface MessageManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class MessageManager extends React.Component<MessageManagerProps> {

  private api: MessageApi;

  constructor(props: MessageManagerProps) {
    super(props);

    this.api = new MessageApi();
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
    const { inbox: { messages } } = this.props;

    const items = messages?.result?.items || [];

    return (
      <Grid container direction="row" spacing={1}>
        {items.map((m) => (
          <Message message={m} key={m.id} assign={(id: string) => this.assign(id)} />
        ))}

        {items.length === 0 &&
          <Grid item xs={12}>
            <Alert severity="info">No new messages found</Alert>
          </Grid>
        }
      </Grid>
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
