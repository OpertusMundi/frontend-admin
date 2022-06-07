import qs from 'qs';
import moment from 'moment';
import React from 'react';
import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';

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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { red } from '@material-ui/core/colors';

import PerfectScrollbar from 'react-perfect-scrollbar';

import Spinner from 'components/spinner';

import {
  ProcessDefinitionDiagram,
  ProcessInstanceTimeline,
  ProcessInstanceVariables,
} from './common';

// Icons
import Icon from '@mdi/react';
import {
  mdiTimelineClockOutline,
  mdiDatabaseCogOutline,
  mdiClockFast,
  mdiAccountOutline,
  mdiXml,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/process-instance-history/thunks'

// Model
import { MarketplaceAccount } from 'model/account-marketplace';

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
  timeline: {
    height: 'calc(100vh - 395px)',
  },
});

interface ProcessInstanceState {
  initialized: boolean;
  tabIndex: number;
}

interface ProcessInstanceHistoryProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class ProcessInstanceHistory extends React.Component<ProcessInstanceHistoryProps, ProcessInstanceState> {

  constructor(props: ProcessInstanceHistoryProps) {
    super(props);

    this.state = {
      initialized: false,
      tabIndex: 0,
    };
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

  getAccountAvatar(account: MarketplaceAccount | null): React.ReactElement {
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
    const { processInstance: instance } = this.props;

    if (!instance) {
      return null;
    }

    const { variables } = instance;

    return (
      <ProcessInstanceVariables
        variables={variables}
      />
    );
  }

  render() {
    const { initialized, tabIndex } = this.state;
    const { classes, config, processInstance = null } = this.props;
    const _t = this.props.intl.formatMessage;

    if (!processInstance || !initialized) {
      return (<Spinner />);
    }

    return (
      <Grid container>
        <Grid item xs={12}>
          <Tabs
            value={tabIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, tabIndex) => this.setState({ tabIndex })}
            variant="fullWidth"
          >
            <Tab icon={<Icon path={mdiDatabaseCogOutline} size="1.5rem" />} label="Process" />
            <Tab icon={<Icon path={mdiXml} size="1.5rem" />} label="Workflow" />
          </Tabs>
        </Grid>
        {tabIndex === 0 &&
          <Grid container item xs={12}>
            <Grid container item xs={12} lg={5} justifyContent="space-around">
              <Grid item xs={12}>
                {this.renderDetails()}
              </Grid>
              <Grid item xs={12}>
                {this.renderVariables()}
              </Grid>
            </Grid>
            <Grid item xs={12} lg={7}>
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <Icon path={mdiTimelineClockOutline} size="1.5rem" />
                    </Avatar>
                  }
                  title={_t({ id: 'workflow.instance.timeline' })}
                ></CardHeader>
                <CardContent>
                  <PerfectScrollbar className={classes.timeline}>
                    <ProcessInstanceTimeline historyProcessInstance={processInstance} />
                  </PerfectScrollbar>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        }
        {tabIndex === 1 && processInstance.bpmn2Xml &&
          <Grid item xs={12}>
            <ProcessDefinitionDiagram config={config} instance={processInstance} />
          </Grid>
        }
      </Grid>
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
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent navigate={navigate} location={location} />
  );
}

export default RoutedComponent;
