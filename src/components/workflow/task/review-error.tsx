import React from 'react';

// State, routing and localization
import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { indigo, red } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiAccountOutline,
  mdiEmailSendOutline,
  mdiRestart,
  mdiRestartOff,
  mdiUndoVariant,
} from '@mdi/js';

// Model
import { ApplicationConfiguration } from 'model/configuration';
import { MarketplaceAccountDetails } from 'model/account-marketplace';
import {
  ActiveProcessInstanceDetails,
  BpmActivity,
  CompleteTaskTaskCommand,
  ModificationCommand,
  SetPublishErrorTaskCommand,
} from 'model/bpm-process-instance';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: red[500],
  },
  avatarIndigo: {
    backgroundColor: indigo[500],
  },
  button: {
    margin: theme.spacing(3, 1, 2),
    borderRadius: 0,
    textTransform: 'none',
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  errorDetailsLine: {
    marginTop: theme.spacing(1),
    fontSize: '0.8rem',
    marginRight: theme.spacing(6),
    wordBreak: 'break-word',
  },
  item: {
    padding: theme.spacing(0, 1),
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  messageForm: {
    marginTop: theme.spacing(2),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  textField: {
    margin: 0,
    padding: 0,
    width: '100%',
  },
});

interface ReviewErrorTaskState {
  confirm: boolean;
  loading: boolean;
  providerMessage: string;
}

interface ReviewErrorTaskProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  config: ApplicationConfiguration;
  processInstance: ActiveProcessInstanceDetails;
  taskName: string;
  completeTask: (command: CompleteTaskTaskCommand) => Promise<boolean>;
  modifyProcessInstance: (command: ModificationCommand) => Promise<boolean>;
}

const validTasks = ['userTask', 'serviceTask'];

class ReviewErrorTask extends React.Component<ReviewErrorTaskProps, ReviewErrorTaskState> {

  constructor(props: ReviewErrorTaskProps) {
    super(props);

    this.state = {
      confirm: false,
      loading: false,
      providerMessage: '',
    };
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

  showConfirmDialog(): void {
    this.setState({
      confirm: true,
    });
  }

  hideConfirmDialog(): void {
    this.setState({
      confirm: false,
    });
  }

  confirmDialogHandler(action: DialogAction): void {
    const { providerMessage } = this.state;
    const { taskName } = this.props;

    switch (action.key) {
      case EnumDialogAction.Accept: {
        const command: SetPublishErrorTaskCommand = {
          taskName,
          message: providerMessage,
        };

        this.setState({ loading: true });

        this.props.completeTask(command)
          .then((success) => {
            if (success) {
              this.hideConfirmDialog();
            }
          }).finally(() => {
            this.setState({ loading: false });
          });
        break;
      }
      case EnumDialogAction.Cancel:
        this.hideConfirmDialog();
        break;
    }
  }

  resume() {
    const { processInstance, taskName } = this.props;

    this.setState({ loading: true });

    const cancelActivities = processInstance.activities
      .filter(a => a.startTime !== null && a.endTime === null)
      .filter(a => validTasks.includes(a.activityType))
      .map(a => a.activityId) || [];
    const startActivities = processInstance.activities
      .filter(a => a.canceled && validTasks.includes(a.activityType) && a.activityId !== taskName)
      .map(a => a.activityId)
      .filter((a, index, arr) => arr.indexOf(a) === index);

    this.props.modifyProcessInstance({
      startActivities,
      cancelActivities,
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  renderDeleteDialog() {
    const _t = this.props.intl.formatMessage;

    const { confirm, loading, providerMessage } = this.state;
    const { classes } = this.props;

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Accept,
            label: _t({ id: 'view.shared.action.send' }),
            iconClass: () => (<Icon path={mdiEmailSendOutline} size="1.5rem" />),
            color: 'primary',
            disabled: loading && !!providerMessage
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />),
            color: 'secondary',
          }
        ]}
        handleClose={() => this.hideConfirmDialog()}
        handleAction={(action) => this.confirmDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirm}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.item}>
            <FormattedMessage
              id="workflow.message.review-error.confirm"
              tagName={'p'}
              values={{ status: <b>{'DRAFT'}</b> }}
            />
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <Typography variant="body1" display="block" gutterBottom color="primary">
              {providerMessage}
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  render() {
    const { providerMessage } = this.state;
    const { classes, processInstance, taskName } = this.props;
    const _t = this.props.intl.formatMessage;

    // Find the most recent tasks of the specific type
    const tasks = processInstance.activities.filter(a => a.activityId === taskName) || null;
    const task = tasks ? tasks.at(-1) : null;
    const completed = !!task?.endTime;

    // Get error details
    const errorDetails = processInstance.variables.find(v => v.name === 'bpmnBusinessErrorDetails')!.value;
    const messages = (errorDetails as string)?.split('||') || null;
    const errorMessage = processInstance.variables.find(v => v.name === 'helpdeskErrorMessage')?.value;

    // Get the most recent retryable tasks. Exclude duplicate records
    const retryableTasks = processInstance.activities
      .filter(a => validTasks.includes(a.activityType) && a.activityId !== taskName) || [];
    const duplicateTasks: string[] = [];
    const cancelled = retryableTasks.reverse()
      .map(t => {
        if (duplicateTasks.includes(t.activityId)) {
          return null;
        } else {
          duplicateTasks.push(t.activityId);
          return t.canceled ? t : null;
        }
      })
      .filter(t => t !== null);

    return (
      <>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <Icon path={mdiRestartOff} size="1.5rem" />
              </Avatar>
            }
            title={_t({ id: 'workflow.review-error.set-error-and-cancel' })}
          ></CardHeader>
          <CardContent>
            <Grid container item xs={12}>
              <Typography variant="caption" display="block" gutterBottom >
                System messages:
              </Typography>
              <List disablePadding>
                {messages.map((text, index) => (
                  <ListItem key={`detail-line-${index}`} className={classes.listItem}>
                    <ListItemText primary={
                      <span className={classes.errorDetailsLine}>
                        {text}
                      </span>
                    }>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Divider />
            <Grid container item xs={12} className={classes.messageForm}>
              {!completed &&
                <TextField
                  id="outlined-multiline-static"
                  label="Message to the provider"
                  multiline
                  minRows={4}
                  value={providerMessage}
                  fullWidth
                  onChange={
                    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => this.setState({ providerMessage: event.target.value })
                  }
                  error={!providerMessage}
                />
              }
              {completed &&
                <Grid container item xs={12}>
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" gutterBottom >
                      Helpdesk error message:
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" display="block" gutterBottom>
                      {errorMessage}
                    </Typography>
                  </Grid>
                </Grid>
              }
            </Grid>
          </CardContent>
          {!completed &&
            <CardActions disableSpacing className={classes.cardActions}>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => this.showConfirmDialog()}
                disabled={!providerMessage}
              >
                <FormattedMessage id="view.shared.action.send"></FormattedMessage>
              </Button>
            </CardActions>
          }
        </Card>
        {this.renderDeleteDialog()}
        {cancelled.length === 1 &&
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar className={classes.avatarIndigo}>
                  <Icon path={mdiRestart} size="1.5rem" />
                </Avatar>
              }
              title={_t({ id: 'workflow.review-error.retry' }, { activity: (<b>{cancelled[0]!.activityName}</b>) })}
            ></CardHeader>
            <CardContent>
              <Grid container item xs={12}>
                <Typography display="block" gutterBottom >
                  Selecting this option will cause the workflow to continue from the last failed task <b>{cancelled[0]!.activityName}</b>. Any progress before this task will be preserved.
                </Typography>
              </Grid>
            </CardContent>
            {!completed &&
              <CardActions disableSpacing className={classes.cardActions}>
                <Button
                  size="small"
                  color="primary"
                  className={classes.button}
                  onClick={() => this.resume()}
                >
                  <FormattedMessage id="view.shared.action.retry"></FormattedMessage>
                </Button>
              </CardActions>
            }
          </Card>
        }
      </>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(ReviewErrorTask);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;