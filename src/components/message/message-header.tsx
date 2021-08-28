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
  mdiReplyOutline,
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
    "&:hover": {
      borderLeftWidth: theme.spacing(1),
      borderLeftColor: theme.palette.primary.main,
      borderLeftStyle: 'solid',
      cursor: 'pointer',
    }
  },
  cardHeader: {
    padding: theme.spacing(1, 2, 1, 1),
  },
  cardContent: {
    padding: theme.spacing(1, 2, 1, 1),
    "&:last-child": {
      padding: theme.spacing(1, 2, 1, 1),
    },
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  textBold: {
    fontWeight: 700,
  },
  selected: {
    background: 'rgb(232, 244, 253)',
  },
});

interface MessageHeaderProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  message: ClientMessage;
  assign?: (id: string) => void;
  read?: (id: string) => void;
  select?: (message: ClientMessage) => void;
  selected: boolean;
}

class MessageHeader extends React.Component<MessageHeaderProps> {

  static defaultProps = {
    selected: false,
  }
  render() {
    const _t = this.props.intl.formatTime;
    const { classes, message, assign, selected } = this.props;
    const { id, createdAt, sender, text, recipientId, read, reply } = message;

    const url = sender && sender.logoImage ? `data:${sender.logoImageMimeType};base64,${sender.logoImage}` : null;

    return (
      <Card
        className={clsx(classes.card, selected && classes.selected)}
        onClick={() => this.props.select ? this.props.select(message) : null}
      >
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar className={classes.avatar} src={url || undefined}>
              {!url &&
                message.sender!.name.toUpperCase()[0]
              }
            </Avatar>
          }
          action={reply !== null &&
            <IconButton aria-label="reply">
              <Icon path={mdiReplyOutline} size="1.5rem" />
            </IconButton>
          }
          title={
            <Typography
              variant="body2" color="textPrimary" component="p"
              className={clsx(classes.text, !read && classes.textBold)}
            >
              {sender!.name}
            </Typography>
          }
          subheader={
            <Typography
              variant="caption" color="textSecondary" component="p"
              className={clsx(classes.text, !read && classes.textBold)}
            >
              {_t(createdAt.toDate(), { day: 'numeric', month: 'numeric', year: 'numeric' })}
            </Typography>
          }
        />
        <CardContent className={classes.cardContent}>
          <Typography
            variant="body2" color="textSecondary" component="p"
            className={clsx(classes.text, !read && classes.textBold)}
          >
            {text}
          </Typography>
        </CardContent>
      </Card>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(MessageHeader);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default localizedComponent;
