import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

// Icon
import Icon from '@mdi/react';
import {
  mdiCommentAlertOutline,
  mdiDatabaseCogOutline,
  mdiTrashCanOutline,
} from '@mdi/js';

// Store
import { RootState } from 'store';

// Services
import { MaintenanceApi } from 'service/maintenance';
import message from 'service/message';

// Model
import { localizeErrorCodes } from 'utils/error';
import { Tasks } from 'model/maintenance';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: blue[500],
  },
  card: {
    minWidth: 480,
    maxWidth: 640,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  cardHeader: {
    padding: theme.spacing(1),
  },
  cardContent: {
    padding: theme.spacing(1),
  },
});

interface MaintenanceTasksState {
  tasks: Tasks;
}

interface MaintenanceTasksProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class MaintenanceTasks extends React.Component<MaintenanceTasksProps, MaintenanceTasksState> {

  private maintenanceApi: MaintenanceApi;

  constructor(props: MaintenanceTasksProps) {
    super(props);

    this.maintenanceApi = new MaintenanceApi();
  }

  state: MaintenanceTasksState = {
    tasks: {
      deleteOrphanFileSystemEntries: false,
      removeOrphanCatalogueItems: false,
      resizeImages: false,
    },
  }

  get tasksSelected(): boolean {
    const { tasks } = this.state;
    return tasks.deleteOrphanFileSystemEntries || tasks.removeOrphanCatalogueItems || tasks.resizeImages;
  }

  componentDidMount() {
  }

  onTaskChange(tasks: Partial<Tasks>) {
    this.setState((state) => ({
      tasks: {
        ...state.tasks,
        ...tasks,
      }
    }));
  }

  async cleanUpData(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const { tasks } = this.state;
    const response = await this.maintenanceApi.cleanData({ ...tasks });
    const { success } = response.data;

    if (success) {
      message.info('maintenance-tasks.message.clean-data-success');

      this.setState({
        tasks: {
          deleteOrphanFileSystemEntries: false,
          removeOrphanCatalogueItems: false,
          resizeImages: false,
        }
      });
    } else {
      const messages = localizeErrorCodes(this.props.intl, response.data);
      message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
    }
  }

  render() {
    const { classes } = this.props;
    const { tasks } = this.state;
    const _t = this.props.intl.formatMessage;

    return (
      <div>
        <Grid container>
          <Grid item xs={6}>
            <Card className={classes.card}>
              <CardHeader
                className={classes.cardHeader}
                avatar={
                  <Avatar className={classes.avatar}>
                    <Icon path={mdiDatabaseCogOutline} size="1.5rem" />
                  </Avatar>
                }
                title={_t({ id: 'maintenance-tasks.title' }, { referenceNumber: 'd' })}
                action={
                  <div>
                    <IconButton onClick={(e) => this.cleanUpData(e)} title="Start" disabled={!this.tasksSelected}>
                      <Icon path={mdiTrashCanOutline} size="1.5rem" />
                    </IconButton>
                  </div>
                }
              />
              <CardContent className={classes.cardContent}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={tasks.resizeImages}
                          onChange={
                            (event) => this.onTaskChange({ resizeImages: event.target.checked })
                          }
                          name="enabled"
                          color="primary"
                        />
                      }
                      label={_t({ id: 'maintenance-tasks.tasks.resize-images' })}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={tasks.removeOrphanCatalogueItems}
                          onChange={
                            (event) => this.onTaskChange({ removeOrphanCatalogueItems: event.target.checked })
                          }
                          name="enabled"
                          color="primary"
                        />
                      }
                      label={_t({ id: 'maintenance-tasks.tasks.remove-orphan-catalogue-items' })}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={tasks.deleteOrphanFileSystemEntries}
                          onChange={
                            (event) => this.onTaskChange({ deleteOrphanFileSystemEntries: event.target.checked })
                          }
                          name="enabled"
                          color="primary"
                        />
                      }
                      label={_t({ id: 'maintenance-tasks.tasks.delete-orphan-file-system-entries' })}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
});

const mapDispatch = {
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(MaintenanceTasks);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
