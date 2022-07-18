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
  mdiTrayPlus,
} from '@mdi/js';

// Model
import {
  ClientMessage,
} from 'model/chat';

const styles = (theme: Theme) => createStyles({
  card: {
    margin: theme.spacing(1),
    borderRadius: 0,
    borderLeftWidth: theme.spacing(1),
    borderLeftColor: 'transparent',
    borderLeftStyle: 'solid',
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
  cardHeader: {
    padding: theme.spacing(1, 2, 0.5),
  },
  cardContent: {
    padding: theme.spacing(1, 2, 0.5),
  },
  selected: {
    borderRadius: 0,
    borderLeftWidth: theme.spacing(1),
    borderLeftColor: theme.palette.primary.main,
    borderLeftStyle: 'solid',
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
  hideHeader?: boolean;
  intl: IntlShape;
  message: ClientMessage;
  selected?: boolean;
  size?: Size,
  assign?: (id: string) => void;
  read?: (id: string) => void;
}

class Message extends React.Component<MessageProps> {

  static defaultProps = {
    align: 'none' as Align,
    hideHeader: false,
    selected: false,
    size: 'sm' as Size,
  }

  render() {
    const _fm = this.props.intl.formatMessage;
    const _ft = this.props.intl.formatTime;
    const { align, classes, hideHeader, message, assign, selected, size } = this.props;
    const { createdAt, sender, subject, text, recipientId } = message;

    const url = sender && sender.logoImage ? `data:${sender.logoImageMimeType};base64,${sender.logoImage}` : null;

    return (
      <Card
        className={clsx(
          classes.card,
          align === 'none' && classes.cardNone,
          align === 'right' && classes.cardRight,
          align === 'left' && classes.cardLeft,
          selected && classes.selected
        )}
      >
        <CardHeader
          avatar={
            <Avatar src={url || undefined}>
              {!url &&
                message.sender!.name.toUpperCase()[0]
              }
            </Avatar>
          }
          action={recipientId === null &&
            <IconButton
              aria-label="assign"
              onClick={() => assign ? assign(message.id) : null}
              title={_fm({ id: 'inbox.helpdesk.tooltip.assign-message' })}
            >
              <Icon path={mdiTrayPlus} size="1.5rem" />
            </IconButton>
          }
          className={classes.cardHeader}
          title={sender!.name}
          subheader={
            <Typography
              variant="caption" color="textSecondary" component="p"
              className={classes.text}
            >
              {_ft(createdAt.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' })}
            </Typography>
          }
        />
        <CardContent className={classes.cardContent}>
          {!hideHeader &&
            <Typography variant="body1" color="primary" component="p" className={clsx(size === 'sm' && classes.text)} gutterBottom>
              {subject || '<No Subject>'}
            </Typography>
          }
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
