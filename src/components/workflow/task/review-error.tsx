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

import { red } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiAccountOutline,
  mdiAccountWrenchOutline,
  mdiEmailSendOutline,
  mdiUndoVariant,
} from '@mdi/js';

// Model
import { ApplicationConfiguration } from 'model/configuration';
import { MarketplaceAccountDetails } from 'model/account-marketplace';
import { ActiveProcessInstanceDetails, CompleteTaskTaskCommand, SetPublishErrorTaskCommand } from 'model/bpm-process-instance';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: red[500],
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
}

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

    const task = processInstance.activities.find(a => a.activityId === taskName) || null;
    const errorDetails = processInstance.variables.find(v => v.name === 'bpmnBusinessErrorDetails')!.value;
    const messages = (errorDetails as string)?.split('||') || null;
    const completed = !!task?.endTime;
    const errorMessage = processInstance.variables.find(v => v.name === 'helpdeskErrorMessage')?.value;


    return (
      <>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <Icon path={mdiAccountWrenchOutline} size="1.5rem" />
              </Avatar>
            }
            title={_t({ id: `enum.process-instance.task.${taskName}` })}
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
      </>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(ReviewErrorTask);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;