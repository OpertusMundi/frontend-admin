import moment from 'moment';
import qs from 'qs';
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
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { red } from '@material-ui/core/colors';

import Spinner from 'components/spinner';
import ProcessInstanceTimeline from './timeline';

// Icons
import Icon from '@mdi/react';
import {
  mdiAccountOutline,
  mdiCheckboxMarkedOutline,
  mdiClockFast,
  mdiContentCopy,
  mdiDatabaseCogOutline,
  mdiNumeric,
  mdiText,
  mdiTimelineClockOutline,
  mdiVariable,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/process-instance/thunks'

// Model
import { BasicMessageCode } from 'model/error-code';
import { buildPath, DynamicRoutes } from 'model/routes';

// Service
import AccountApi from 'service/account-marketplace';
import { MarketplaceAccountDetails } from 'model/account-marketplace';

const COPY = 'copy';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  item: {
    width: '100%',
  },
  paper: {
    padding: '6px 16px',
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  avatar: {
    backgroundColor: red[500],
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
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

interface ProcessInstanceProps extends PropsFromRedux, WithStyles<typeof styles>, RouteComponentProps<RouteParams> {
  intl: IntlShape,
}

class ProcessInstance extends React.Component<ProcessInstanceProps, ProcessInstanceState> {

  api: AccountApi;

  constructor(props: ProcessInstanceProps) {
    super(props);

    this.state = {
      initialized: false,
    };

    this.api = new AccountApi();
  }

  componentDidMount() {
    const params = qs.parse(this.props.location.search.substr(1));
    const businessKey = params['businessKey'] as string || null;
    const processInstance = params['processInstance'] as string || null;

    if (businessKey || processInstance) {
      this.props.findOne(businessKey, processInstance)
        .then((response) => {
          if (!response.success && response.messages.some(m => m.code === BasicMessageCode.NotFound)) {
            // Record not found, redirect to history page
            const path = buildPath(DynamicRoutes.ProcessInstanceHistoryView, null, { businessKey, processInstance });
            this.props.history.replace(path);
          }
        })
        .catch((err: AxiosError) => {
          // TODO: Redirect to grid view?
        })
        .finally(() => this.setState({ initialized: true }));
    } else {
      // TODO: Redirect to grid view?
    }
  }

  mapVariableTypeToIcon(type: string) {
    switch (type.toLocaleLowerCase()) {
      case 'number':
      case 'numeric':
      case 'integer':
      case 'float':
      case 'long':
        return (
          <Icon path={mdiNumeric} size="1rem" />
        );
      case 'boolean':
        return (
          <Icon path={mdiCheckboxMarkedOutline} size="1rem" />
        );
    }
    return (
      <Icon path={mdiText} size="1rem" />
    );
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

  copyValueToClipboard(value: string | number | boolean | null) {
    if (!value || typeof value === 'boolean') {
      return;
    }
    const element: HTMLInputElement = document.getElementById('copy-to-clipboard') as HTMLInputElement;

    if (element && document.queryCommandSupported(COPY)) {
      element.focus();
      element.value = typeof value === 'number' ? '' + value : value;
      element.select();
      document.execCommand(COPY);
    }
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
          title={_t({ id: 'workflow.instance.variables.title' })}
        ></CardHeader>
        <CardContent>
          <List disablePadding>
            {Object.keys(variables).filter(name => !['startUserKey'].includes(name)).sort().map((name, index) => {
              const value = variables[name].value;

              return (
                <div key={`variable-${name}`}>
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar className={classes.small}>
                        {this.mapVariableTypeToIcon(variables[name].type)}
                      </Avatar>
                    </ListItemAvatar>
                    {typeof value === 'boolean' &&
                      <ListItemText primary={name} secondary={value === true ? 'True' : 'False'} />
                    }
                    {typeof value !== 'boolean' &&
                      <ListItemText primary={name} secondary={value} />
                    }
                    {typeof value !== 'boolean' && variables[name].value &&
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => this.copyValueToClipboard(variables[name].value)}>
                          <Icon path={mdiContentCopy} size="1.2rem" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    }
                  </ListItem>
                </div>
              );
            })}
          </List>
        </CardContent>
      </Card>
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
                  <ProcessInstanceTimeline activeProcessInstance={processInstance} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
      </>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  processInstance: state.workflow.instances.runtime.processInstance,
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
const styledComponent = withStyles(styles)(ProcessInstance);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
