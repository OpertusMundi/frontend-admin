import React from 'react';

// Utilities
import clsx from 'clsx';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

// Icons
import Icon from '@mdi/react';
import {
  mdiSendOutline,
} from '@mdi/js';

// Model
import {
  ClientContact,
  ClientMessage,
} from 'model/chat';

const styles = (theme: Theme) => createStyles({
  card: {
  },
  cardNone: {
    width: '100%',
  },
  cardLeft: {
    width: '100%',
    marginRight: theme.spacing(12),
  },
  cardRight: {
    width: '100%',
    marginLeft: theme.spacing(12),
  },
  cardContent: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1, 1, 1),
  },
  textField: {
    fontSize: 12,
  }
});

const maxLength = 300;

type Align = 'left' | 'right' | 'none' | undefined;

interface MessageSendProps extends WithStyles<typeof styles> {
  align?: Align;
  intl: IntlShape;
  message?: ClientMessage;
  readOnly: boolean;
  recipient?: ClientContact;
  send: (userKey: string, messageKey: string, threadKey: string, subject: string, text: string) => Promise<ClientMessage | null>,
}

interface MessageSendState {
  text: string,
}

class MessageSend extends React.Component<MessageSendProps, MessageSendState> {

  constructor(props: MessageSendProps) {
    super(props);

    this.state = {
      text: '',
    };
  }

  static defaultProps = {
    align: 'none' as Align,
    readOnly: false,
  }

  send(): void {
    const { text } = this.state;
    const { message, send } = this.props;

    send(message!.senderId, message!.id, message!.thread, '', text).then(() => {
      this.setState({
        text: '',
      });
    });
  }

  render() {
    const { text } = this.state;
    const { align, classes, readOnly } = this.props;

    return (
      <Card
        className={clsx(
          classes.card,
          align === 'none' && classes.cardNone,
          align === 'right' && classes.cardRight,
          align === 'left' && classes.cardLeft,
        )}
      >
        <CardContent className={classes.cardContent}>
          <TextField
            id="outlined-multiline-static"
            label={text.length === 0 ? 'Write response ...' : 'Response'}
            multiline
            minRows={4}
            variant="outlined"
            value={text}
            fullWidth
            inputProps={{ maxLength, spellCheck: true }}
            onChange={e => this.setState({ text: e.target.value || '' })}
            helperText={`${text.length} / ${maxLength}`}
            disabled={readOnly}
            className={classes.textField}
          />
        </CardContent>
        <CardActions className={classes.cardActions}>
          <IconButton
            color="inherit"
            onClick={() => this.send()}
            disabled={text.length === 0 || readOnly}
          >
            <Icon path={mdiSendOutline} size="1.5rem" />
          </IconButton>
        </CardActions>
      </Card>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(MessageSend);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default localizedComponent;
