import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

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
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Icon
import Icon from '@mdi/react';
import {
  mdiCloudSyncOutline,
  mdiCommentAlertOutline,
  mdiCommentTextOutline,
  mdiTrashCanOutline,
  mdiUndoVariant,
} from '@mdi/js';

// Store
import { RootState } from 'store';

// Services
import { ConfigurationApi } from 'service/config';
import message from 'service/message';

// Model
import { localizeErrorCodes } from 'utils/error';
import { EnumService, Setting, SettingUpdate } from 'model/configuration';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: blue[500],
  },
  button: {
    margin: theme.spacing(3, 1, 2),
    borderRadius: 0,
    textTransform: 'none',
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
  cardActions: {
    justifyContent: 'flex-end',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  announcementPreviewWrapper: {
    marginTop: theme.spacing(2),
  },
});

interface SettingsManagerState {
  announcement: {
    initial: {
      content: string;
      enabled: boolean;
    };
    current: {
      content: string;
      enabled: boolean;
    };
  },
}

interface SettingsManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class SettingsManager extends React.Component<SettingsManagerProps, SettingsManagerState> {

  private configApi: ConfigurationApi;

  private settings: Setting[] = [];

  constructor(props: SettingsManagerProps) {
    super(props);

    this.configApi = new ConfigurationApi();
  }

  state: SettingsManagerState = {
    announcement: {
      initial: {
        content: '',
        enabled: false,
      },
      current: {
        content: '',
        enabled: false,
      }
    },
  }

  get announcementModified() {
    const { announcement: { initial, current } } = this.state;

    if (!initial || !current) {
      return false;
    }

    return initial.content !== current.content || initial.enabled !== current.enabled;
  }

  componentDidMount() {
    this.loadSettings();
  }

  async loadSettings() {
    const response = await this.configApi.getSettings();

    this.settings = response.data.result || [];

    this.initializeAnnouncement();
  }

  initializeAnnouncement() {
    const bannerContent = this.settings.find(s => s.key === 'banner.text' && s.service === EnumService.API_GATEWAY)?.value || '';
    const bannerEnabled = this.settings.find(s => s.key === 'banner.enabled' && s.service === EnumService.API_GATEWAY)?.value === 'true';

    this.setState({
      ...this.state,
      announcement: {
        initial: {
          content: bannerContent as string,
          enabled: bannerEnabled,
        },
        current: {
          content: bannerContent as string,
          enabled: bannerEnabled,
        },
      }
    });
  }

  onAnnouncementContentChange(content: string) {
    this.setState((state) => ({
      announcement: {
        ...state.announcement,
        current: {
          ...state.announcement.current,
          content,
        }
      }
    }));
  }

  onAnnouncementEnabledChange(enabled: boolean) {
    this.setState((state) => ({
      announcement: {
        ...state.announcement,
        current: {
          ...state.announcement.current,
          enabled,
        }
      }
    }));
  }

  createAnnouncementPreview() {
    return { __html: this.state.announcement.current.content };
  }

  async onAnnouncementSave(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const updates: SettingUpdate[] = [{
      key: 'banner.text',
      value: this.state.announcement.current.content || '',
      service: EnumService.API_GATEWAY,
    }, {
      key: 'banner.enabled',
      value: this.state.announcement.current.enabled.toString(),
      service: EnumService.API_GATEWAY,
    }];

    const response = await this.configApi.updateSetting({ updates });
    const { success } = response.data;

    if (success) {
      message.info('message.settings-changed');

      this.loadSettings();
    } else {
      const messages = localizeErrorCodes(this.props.intl, response.data);
      message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />), 10000);
    }
  }

  onAnnouncementUndo() {
    this.initializeAnnouncement();
  }

  onAnnouncementClear() {
    this.setState((state) => ({
      announcement: {
        ...state.announcement,
        current: {
          content: '',
          enabled: false,
        }
      }
    }));
  }

  render() {
    const { classes } = this.props;
    const { announcement } = this.state;
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
                    <Icon path={mdiCommentTextOutline} size="1.5rem" />
                  </Avatar>
                }
                title={_t({ id: 'settings.marketplace.announcement.title' }, { referenceNumber: 'd' })}
                action={
                  <div>
                    <IconButton onClick={(e) => this.onAnnouncementSave(e)} title="Save" disabled={!this.announcementModified}>
                      <Icon path={mdiCloudSyncOutline} size="1.5rem" />
                    </IconButton>
                    <IconButton onClick={() => this.onAnnouncementUndo()} title="Undo" disabled={!this.announcementModified}>
                      <Icon path={mdiUndoVariant} size="1.5rem" />
                    </IconButton>
                    <IconButton onClick={() => this.onAnnouncementClear()} title="Clear">
                      <Icon path={mdiTrashCanOutline} size="1.5rem" />
                    </IconButton>
                  </div>
                }
              />
              <CardContent className={classes.cardContent}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-multiline-static"
                      label={_t({ id: 'settings.marketplace.announcement.content' })}
                      multiline
                      minRows={4}
                      value={announcement.current.content || ''}
                      fullWidth
                      onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
                        this.onAnnouncementContentChange(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={announcement.current.enabled}
                          onChange={
                            (event) => this.onAnnouncementEnabledChange(event.target.checked)
                          }
                          name="enabled"
                          color="primary"
                        />
                      }
                      label={_t({ id: 'settings.marketplace.announcement.enabled' })}
                    />
                    {!announcement.initial.enabled && announcement.current.enabled &&
                      <Typography variant="caption" display="block" gutterBottom color="secondary">
                        <FormattedMessage
                          id="settings.marketplace.announcement.warning"
                          tagName={'p'}
                        />
                      </Typography>
                    }
                  </Grid>

                  <Grid item xs={12}>
                    <FormLabel component="legend">
                      <FormattedMessage id={'settings.marketplace.announcement.preview'} />
                    </FormLabel>
                    <div className={classes.announcementPreviewWrapper}>
                      <div dangerouslySetInnerHTML={this.createAnnouncementPreview()}></div>
                    </div>
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
const styledComponent = withStyles(styles)(SettingsManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
