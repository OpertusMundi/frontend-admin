import qs from 'qs';
import moment from 'moment';
import React from 'react';
import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import { red } from '@material-ui/core/colors';

import Spinner from 'components/spinner';
import ProcessInstanceTimeline from './timeline';
import ProcessInstanceVariables from './variable-list';

// Icons
import Icon from '@mdi/react';
import {
  mdiTimelineClockOutline,
  mdiDatabaseCogOutline,
  mdiClockFast,
  mdiVariable,
  mdiAccountOutline,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/process-instance-history/thunks'

// Service
import AccountApi from 'service/account-marketplace';
import { MarketplaceAccountDetails } from 'model/account-marketplace';

const styles = (theme: Theme) => createStyles({
  item: {
    width: '100%',
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  avatar: {
    backgroundColor: red[500],
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  title: {
    marginTop: theme.spacing(2),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
});

interface RouteParams {
  businessKey?: string | undefined;
  processInstance?: string | undefined;
}

interface ProcessInstanceState {
  initialized: boolean;
}

interface ProcessInstanceHistoryProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape,
}

class ProcessInstanceHistory extends React.Component<ProcessInstanceHistoryProps, ProcessInstanceState> {

  api: AccountApi;

  constructor(props: ProcessInstanceHistoryProps) {
    super(props);

    this.state = {
      initialized: false,
    };

    this.api = new AccountApi();
  }

  componentDidMount() {
    const params = qs.parse(this.props.location.search.substr(1));

    if (params['businessKey'] || params['processInstance']) {
      this.props.findOne(params['businessKey'] as string, params['processInstance'] as string)
        .catch((err: AxiosError) => {
          console.log(err);
          // TODO: Redirect to grid view?
        })
        .finally(() => this.setState({ initialized: true }));
    } else {
      // TODO: Redirect to grid view?
    }
  }

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

  renderDetails(): React.ReactElement | null {
    const { classes, processInstance } = this.props;

    if (!processInstance) {
      return null;
    }

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
          title={instance.processDefinitionName}
        ></CardHeader>
        <CardContent>
          <List disablePadding>
            <ListItem className={classes.listItem}>
              <ListItemAvatar>
                {this.getAccountAvatar(owner || null)}
              </ListItemAvatar>
              <ListItemText primary={'Owner'} secondary={owner ? owner.username : 'System'} />
            </ListItem>
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

  renderVariables(): React.ReactElement | null {
    const { classes, processInstance: instance } = this.props;

    if (!instance) {
      return null;
    }

    const _t = this.props.intl.formatMessage;
    const { variables } = instance;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiVariable} size="1.5rem" />
            </Avatar>
          }
          title={_t({ id: 'workflow.instance.variables.title' }, { count: variables.length })}
        ></CardHeader>
        <CardContent>
          <ProcessInstanceVariables variables={variables} />
        </CardContent>
      </Card >
    );
  }

  render() {
    const { initialized } = this.state;
    const { classes, processInstance = null } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!processInstance || !initialized) {
      return (<Spinner />);
    }

    return (
      <>
        <Grid container>
          <Grid container item xs={12} lg={5}>
            <Grid item xs={12} className={classes.item}>
              {this.renderDetails()}
            </Grid>
            <Grid item xs={12} className={classes.item}>
              {this.renderVariables()}
            </Grid>
          </Grid>
          <Grid container item xs={12} lg={7}>
            <Grid item className={classes.item}>
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <Icon path={mdiTimelineClockOutline} size="1.5rem" />
                    </Avatar>
                  }
                  title={_t({ id: 'billing.order.timeline.timeline-header' })}
                ></CardHeader>
                <CardContent>
                  <ProcessInstanceTimeline historyProcessInstance={processInstance} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  processInstance: state.workflow.instances.history.processInstance,
});

const mapDispatch = {
  findOne: (businessKey: string | null, processInstance: string | null) => findOne(businessKey, processInstance),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(ProcessInstanceHistory);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
