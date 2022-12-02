import React from 'react';

import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { blue } from '@material-ui/core/colors';

import Icon from '@mdi/react';
import {
  mdiPackageVariantClosed, mdiTrashCanOutline,
} from '@mdi/js';

import {
  Deployment,
} from 'model/bpm-process-instance';

import DateTime from 'components/common/date-time';

const styles = (theme: Theme) => createStyles({
  avatarBlue: {
    backgroundColor: blue[500],
  },
  card: {
    width: 345,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  inline: {
    display: 'inline',
    marginRight: theme.spacing(2),
  },
});

interface DeploymentCardProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  allowDelete: boolean;
  deployment: Deployment,
  deleteDeployment: (deployment: Deployment) => void;
  viewDeployment: (deployment: Deployment) => void;
}

class DeploymentCard extends React.Component<DeploymentCardProps> {

  render() {
    const { classes, allowDelete, deployment } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatarBlue}>
              <Icon path={mdiPackageVariantClosed} size="1.5rem" />
            </Avatar>
          }
          title={deployment.name}
          action={
            <div>
              <IconButton onClick={(e) => this.props.deleteDeployment(deployment)} disabled={!allowDelete}>
                <Icon path={mdiTrashCanOutline} size="1.5rem" />
              </IconButton>
            </div>
          }
        />
        <CardContent >
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.inline} variant="caption">Deployment Time</Typography>
              <Typography gutterBottom>
                <DateTime value={deployment.deploymentTime.toDate()} day='numeric' month='numeric' year='numeric' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.inline} variant="caption">Source</Typography>
              <Typography gutterBottom>
                <span>{deployment.source || '-'}</span>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(DeploymentCard);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;