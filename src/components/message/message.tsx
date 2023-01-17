import React from 'react';
import { Link } from 'react-router-dom';

// Utilities
import clsx from 'clsx';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { DateTime } from 'components/common';

// Icons
import Icon from '@mdi/react';
import {
  mdiEmailOpenOutline,
  mdiEmailOutline,
  mdiTicketConfirmationOutline,
  mdiTrayPlus,
} from '@mdi/js';

// Model
import { buildPath, DynamicRoutes } from 'model/routes';
import { ClientMessage } from 'model/chat';


const styles = (theme: Theme) => createStyles({
  avatarIcon: {
    width: 16,
    color: '#ffffff',
  },
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
  icon: {
    marginTop: theme.spacing(2),
  },
  link: {
    color: 'inherit',
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

  renderAction() {
    const _fm = this.props.intl.formatMessage;
    const { classes, message, assign } = this.props;
    const { recipientId, read, threadCountUnread = 0 } = message;

    if (recipientId === null) {
      return (
        <IconButton
          aria-label="assign"
          onClick={() => assign ? assign(message.id) : null}
          title={_fm({ id: 'inbox.helpdesk.tooltip.assign-message' })}
        >
          <Icon path={mdiTrayPlus} size="1.5rem" />
        </IconButton>
      );
    }

    return read && threadCountUnread === 0
      ? (<Icon path={mdiEmailOpenOutline} size="1.2rem" className={classes.icon} />)
      : (<Icon path={mdiEmailOutline} size="1.2rem" className={classes.icon} />);

  }

  getResourceUrlFromAttributes(message: ClientMessage): string | null {
    const { attributes } = message;
    const type = attributes!['type'];
    const key = attributes!['resourceKey'];
    switch (type) {
      case 'ORDER':
        return buildPath(DynamicRoutes.OrderView, [key]);
      case 'PAYIN':
        return buildPath(DynamicRoutes.PayInView, [key]);
    }
    return null;
  }

  renderAttributes() {
    const { classes, message, message: { attributes } } = this.props;
    if (!attributes) {
      return null;
    }
    const resourceUrl = this.getResourceUrlFromAttributes(message);
    return resourceUrl ? (
      <Grid container justifyContent={'flex-end'}>
        <Grid item>
          <Chip
            avatar={<Avatar><Icon path={mdiTicketConfirmationOutline} className={classes.avatarIcon} /></Avatar>}
            label={(
              <Link to={resourceUrl} className={classes.link}>
                {attributes['referenceNumber']}
              </Link>
            )}
            variant="outlined"
            color={'primary'}
          />
        </Grid>
      </Grid>
    ) : null;
  }

  render() {
    const { align, classes, hideHeader, message, selected, size } = this.props;
    const { createdAt, sender, subject, text, } = message;

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
          action={this.renderAction()}
          className={classes.cardHeader}
          title={sender!.name}
          subheader={
            <Typography
              variant="caption" color="textSecondary" component="p"
              className={classes.text}
            >
              {<DateTime value={createdAt.toDate()} day='numeric' month='numeric' year='numeric' />}
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
          {this.renderAttributes()}
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
