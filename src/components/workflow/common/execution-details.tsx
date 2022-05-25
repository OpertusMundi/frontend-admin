import _ from 'lodash';
import moment from 'moment';
import React from 'react';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import { red } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiAccountOutline,
  mdiClockFast,
  mdiDatabaseCogOutline,
} from '@mdi/js';

// Model
import { ApplicationConfiguration } from 'model/configuration';
import { MarketplaceAccountDetails } from 'model/account-marketplace';
import { ActiveProcessInstanceDetails } from 'model/bpm-process-instance';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: red[500],
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
});

interface ExecutionDetailsProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  config: ApplicationConfiguration;
  processInstance: ActiveProcessInstanceDetails;
}

class ExecutionDetails extends React.Component<ExecutionDetailsProps> {

  getAccountAvatar(account: MarketplaceAccountDetails | null): React.ReactElement {
    const { classes } = this.props;

    if (account) {
      const { email, profile, profile: { firstName, lastName } } = account;
      const alt = (firstName || lastName) ? `${firstName} ${lastName}` : email;
      const url = (profile?.image && profile?.imageMimeType) ? `data:${profile.imageMimeType};base64,${profile.image}` : null;

      if (url) {
        return (
          <Avatar
            alt={alt}
            src={url}
            variant="circular"
            className={classes.small}
          />
        );
      }
    }

    return (
      <Avatar className={classes.small}>
        <Icon path={mdiAccountOutline} size="1.2rem" />
      </Avatar>
    );
  }

  render() {
    const { classes, config, processInstance } = this.props;

    if (!processInstance) {
      return null;
    }

    const processDefinition = config.processDefinitions!.find(d => d.id === processInstance.instance.processDefinitionId) || null;

    const { instance, owner = null } = processInstance;
    const duration = moment.duration(
      1000 * ((instance.endTime ? instance.endTime.unix() : moment().unix()) - instance.startTime.unix())
    ).humanize();

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiDatabaseCogOutline} size="1.5rem" />
            </Avatar>
          }
          title={`${instance.processDefinitionName.split(' ').map(w => _.capitalize(w)).join(' ')} ${processDefinition ? processDefinition.versionTag : ''}`}
        ></CardHeader>
        <CardContent>
          <List disablePadding>
            {owner &&
              <ListItem className={classes.listItem}>
                <ListItemAvatar>
                  {this.getAccountAvatar(owner || null)}
                </ListItemAvatar>
                <ListItemText primary={'Owner'} secondary={owner ? owner.username : 'System'} />
              </ListItem>
            }
            <ListItem className={classes.listItem}>
              <ListItemAvatar>
                <Avatar className={classes.small}>
                  <Icon path={mdiClockFast} size="1.2rem" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={'Duration'} secondary={duration} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(ExecutionDetails);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;