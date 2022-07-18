import React from 'react';

// State, routing and localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// 3rd party components
import { createStyles, Grid, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Icon from '@mdi/react';
import { mdiEmailFastOutline, mdiEmailOffOutline, mdiSendOutline, mdiUndoVariant } from '@mdi/js';

// Services
import message from 'service/message';
import MessageApi from 'service/chat';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

// Model
import { ClientContact } from 'model/chat';

const maxLengthSubject = 80;
const maxLengthText = 300;

const styles = (theme: Theme) => createStyles({
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  avatarContainer: {
    paddingTop: '6px !important',
  },
  dialog: {
    minWidth: 520,
  },
  inline: {
    display: 'inline',
    marginRight: theme.spacing(2),
  },
  textField: {
    fontSize: 12,
  },
});

interface MessageDialogState {
  sending: boolean;
  subject: string;
  text: string;
}

interface MessageDialogProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  defaultSubject?: string;
  contact: ClientContact;
  open: boolean;
  close: () => void;
}

class MessageDialogComponent extends React.Component<MessageDialogProps, MessageDialogState> {

  private api: MessageApi;

  constructor(props: MessageDialogProps) {
    super(props);
    const { defaultSubject: subject = '' } = props;

    this.api = new MessageApi();

    this.state = {
      sending: false,
      subject,
      text: '',
    };
  }

  async send(): Promise<boolean> {
    const { subject, text } = this.state;
    const { contact } = this.props;

    this.setState({ sending: true });

    return this.api.sendMessageToUser(contact.id, { subject, text })
      .then((response) => {
        if (response.data.success) {
          message.infoHtml(
            <FormattedMessage
              id={'send-message-dialog.message.success'}
              values={{ recipient: (<b>{contact.name}</b>) }}
            />,
            () => (<Icon path={mdiEmailFastOutline} size="3rem" />),
          );

          this.props.close();
        } else {
          message.errorHtml(
            <FormattedMessage
              id={'send-message-dialog.message.failure'}
              values={{ recipient: (<b>{contact.name}</b>) }}
            />,
            () => (<Icon path={mdiEmailOffOutline} size="3rem" />),
          );
        }

        return response.data.success;
      })
      .finally(() => {
        this.setState({ sending: true });
      });
  }

  handleAction(action: DialogAction): void {
    switch (action.key) {
      case EnumDialogAction.Yes:
        this.send();
        break;

      default:
        this.props.close();
        break;
    }
  }

  render() {
    const { subject, text, sending } = this.state;
    const { classes, contact, open } = this.props;
    const _t = this.props.intl.formatMessage;

    const imageUrl = contact.logoImage && contact.logoImageMimeType
      ? `data:${contact.logoImageMimeType};base64,${contact.logoImage}`
      : '';

    return (
      <Dialog
        className={classes.dialog}
        handleClose={() => this.props.close()}
        handleAction={(action) => this.handleAction(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="send-message-dialog.title" />
          </span>
        }
        open={open}
        actions={[
          {
            key: EnumDialogAction.No,
            label: _t({ id: 'send-message-dialog.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }, {
            key: EnumDialogAction.Yes,
            label: _t({ id: 'send-message-dialog.action.send' }),
            iconClass: () => (<Icon path={mdiSendOutline} size="1.5rem" />),
            color: 'primary',
            disabled: sending || !subject || !message,
          }
        ]}
      >
        <Grid container spacing={2}>
          <Grid container item xs={12} spacing={1}>
            <Grid item className={classes.avatarContainer}>
              <Avatar alt={contact.name} src={imageUrl} variant="circular" className={classes.avatar} />
            </Grid>
            <Grid item>
              <Typography variant="caption" component={'p'}>
                {contact.name}
              </Typography>
              <Typography variant="caption" component={'p'}>
                {contact.email}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="title"
              label={subject.length === 0 ? 'Write title ...' : 'Title'}
              variant="outlined"
              value={subject}
              fullWidth
              inputProps={{ maxLength: maxLengthSubject }}
              onChange={e => this.setState({ subject: e.target.value || '' })}
              helperText={`${subject.length} / ${maxLengthSubject}`}
              className={classes.textField}
              autoFocus
              error={!subject}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="message"
              label={text.length === 0 ? 'Write message ...' : 'Message'}
              multiline
              minRows={4}
              variant="outlined"
              value={text}
              fullWidth
              inputProps={{ maxLength: maxLengthText }}
              onChange={e => this.setState({ text: e.target.value || '' })}
              helperText={`${text.length} / ${maxLengthText}`}
              className={classes.textField}
              error={!text}
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(MessageDialogComponent);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);


export default LocalizedComponent;
