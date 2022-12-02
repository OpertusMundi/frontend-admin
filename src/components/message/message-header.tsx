import React from 'react';

// Utilities
import clsx from 'clsx';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, Grid, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { DateTime } from 'components/common';

// Icons
import Icon from '@mdi/react';
import {
  mdiEmailOpenOutline,
  mdiEmailOutline,
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
    padding: theme.spacing(0.5, 2, 0, 1),
  },
  cardHeaderInner: {
    padding: theme.spacing(0),
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
  textUser: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '90%',
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
  icon: {
    marginTop: theme.spacing(2),
  },
});

interface MessageHeaderProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  message: ClientMessage;
  select?: (message: ClientMessage) => void;
  selected: boolean;
}

class MessageHeader extends React.Component<MessageHeaderProps> {

  static defaultProps = {
    selected: false,
  }
  render() {
    const { classes, message, selected } = this.props;
    const { createdAt, sender, recipient, subject, text, read, threadCountUnread = 0 } = message;

    const urlSender = sender && sender.logoImage ? `data:${sender.logoImageMimeType};base64,${sender.logoImage}` : null;
    const urlRecipient = recipient && recipient.logoImage ? `data:${recipient.logoImageMimeType};base64,${recipient.logoImage}` : null;

    return (
      <Card
        className={clsx(classes.card, selected && classes.selected)}
        onClick={() => this.props.select ? this.props.select(message) : null}
      >
        <CardHeader
          className={classes.cardHeader}
          action={read && threadCountUnread === 0
            ? <Icon path={mdiEmailOpenOutline} size="1.2rem" className={classes.icon} />
            : <Icon path={mdiEmailOutline} size="1.2rem" className={classes.icon} />
          }
          title={
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <CardHeader
                  className={classes.cardHeaderInner}
                  avatar={
                    <Avatar className={classes.avatar} src={urlSender || undefined}>
                      {!urlSender &&
                        message.sender!.name.toUpperCase()[0]
                      }
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="caption" color="textSecondary" component="p"
                      className={clsx(classes.textUser, !read && classes.textBold)}
                    >
                      {sender!.email}
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="body2" color="textPrimary" component="p"
                      className={clsx(classes.textUser, !read && classes.textBold)}
                    >
                      {sender!.name}
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <CardHeader
                  className={classes.cardHeaderInner}
                  avatar={
                    <Avatar className={classes.avatar} src={urlRecipient || undefined}>
                      {!urlRecipient &&
                        message.recipient!.name.toUpperCase()[0]
                      }
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="caption" color="textSecondary" component="p"
                      className={clsx(classes.textUser, !read && classes.textBold)}
                    >
                      {recipient!.email}
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="body2" color="textPrimary" component="p"
                      className={clsx(classes.textUser, !read && classes.textBold)}
                    >
                      {recipient!.name}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          }
        />
        <CardContent className={classes.cardContent}>
          <Typography
            variant="caption" color="textSecondary" component="p"
            className={clsx(classes.text, !read && classes.textBold)}
          >
            {<DateTime value={createdAt.toDate()} day='numeric' month='numeric' year='numeric' />}
          </Typography>
          <Typography
            variant="body1" color="primary" component="p"
            className={clsx(classes.text, !read && classes.textBold)}
            gutterBottom
          >
            {subject || '<No Subject>'}
          </Typography>
          <Typography
            variant="body2" color="textSecondary" component="p"
            className={classes.text}
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
