import React from 'react';

// Utilities
import clsx from 'clsx';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import {
  mdiArchiveOutline,
  mdiSendOutline,
  mdiTrayPlus,
} from '@mdi/js';

// Model
import {
  ClientContact,
  ClientMessage,
} from 'model/chat';

const styles = (theme: Theme) => createStyles({
  card: {
    margin: theme.spacing(1),
  },
  cardNone: {
    width: '100%',
  },
  cardLeft: {
    width: '100%',
    marginRight: theme.spacing(8),
  },
  cardRight: {
    width: '100%',
    marginLeft: theme.spacing(8),
  },
  cardContent: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1, 0, 1),
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
  send: (userKey: string, threadKey: string, text: string) => void,
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

    this.props.send(message!.senderId, message!.thread, text);
  }

  render() {
    const _t = this.props.intl.formatTime;
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
            rows={4}
            variant="outlined"
            value={text}
            fullWidth
            inputProps={{ maxLength }}
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
