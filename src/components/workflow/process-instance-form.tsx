import qs from 'qs';
import React from 'react';
import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { useNavigate, useLocation, useParams, NavigateFunction, Location } from 'react-router-dom';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { red } from '@material-ui/core/colors';

import PerfectScrollbar from 'react-perfect-scrollbar';

import Spinner from 'components/spinner';
import {
  ExecutionDetails,
  ProcessDefinitionDiagram,
  ProcessInstanceTimeline,
  ProcessInstanceVariables,
} from './common';

// Icons
import Icon from '@mdi/react';
import {
  mdiDatabaseCogOutline,
  mdiTimelineClockOutline,
  mdiXml,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/process-instance/thunks'

// Model
import { BasicMessageCode } from 'model/error-code';
import { buildPath, DynamicRoutes } from 'model/routes';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: red[500],
  },
  item: {
    width: '100%',
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
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
    height: 'calc(100vh - 300px)',
  },
});

interface RouteParams {
  businessKey?: string | undefined;
  processInstance?: string | undefined;
}

interface ProcessInstanceState {
  initialized: boolean;
  tabIndex: number;
}

interface ProcessInstanceProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

class ProcessInstance extends React.Component<ProcessInstanceProps, ProcessInstanceState> {

  constructor(props: ProcessInstanceProps) {
    super(props);

    this.state = {
      initialized: false,
      tabIndex: 0,
    };
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
            this.props.navigate(path, { replace: true });
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
                <ExecutionDetails config={config} processInstance={processInstance} />
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
                    <ProcessInstanceTimeline activeProcessInstance={processInstance} />
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
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params: RouteParams = useParams();

  return (
    <ConnectedComponent navigate={navigate} location={location} params={params} />
  );
}

export default RoutedComponent;