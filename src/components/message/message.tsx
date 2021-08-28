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
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import {
  mdiArchiveOutline,
  mdiTrayPlus,
} from '@mdi/js';

// Model
import {
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
  avatar: {
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
});

type Align = 'left' | 'right' | 'none' | undefined;
type Size = 'sm' | 'lg' | undefined;

interface MessageProps extends WithStyles<typeof styles> {
  align?: Align;
  intl: IntlShape;
  message: ClientMessage;
  assign?: (id: string) => void;
  read?: (id: string) => void;
  size?: Size,
}

class Message extends React.Component<MessageProps> {

  static defaultProps = {
    align: 'none' as Align,
    size: 'sm' as Size,
  }

  render() {
    const _t = this.props.intl.formatTime;
    const { align, classes, message, assign, size } = this.props;
    const { createdAt, sender, text, recipientId } = message;

    const url = sender && sender.logoImage ? `data:${sender.logoImageMimeType};base64,${sender.logoImage}` : null;

    return (
      <Card
        className={clsx(
          classes.card,
          align === 'none' && classes.cardNone,
          align === 'right' && classes.cardRight,
          align === 'left' && classes.cardLeft,
        )}
      >
        <CardHeader
          avatar={
            <Avatar className={classes.avatar} src={url || undefined}>
              {!url &&
                message.sender!.name.toUpperCase()[0]
              }
            </Avatar>
          }
          action={recipientId === null &&
            <IconButton aria-label="assign" onClick={() => assign ? assign(message.id) : null}>
              <Icon path={mdiTrayPlus} size="1.5rem" />
            </IconButton>
          }
          title={sender!.name}
          subheader={
            <Typography
              variant="caption" color="textSecondary" component="p"
              className={classes.text}
            >
              {_t(createdAt.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' })}
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" className={clsx(size === 'sm' && classes.text)}>
            {text}
          </Typography>
        </CardContent>
      </Card>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(Message);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default localizedComponent;
