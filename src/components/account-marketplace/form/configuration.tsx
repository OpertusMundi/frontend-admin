import React from 'react';

// State, routing and localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { red } from '@material-ui/core/colors';

import Icon from '@mdi/react';
import {
  mdiCheck,
  mdiCreativeCommons,
  mdiTransitConnectionVariant,
  mdiUndoVariant,
} from '@mdi/js';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';

// Service
import { MarketplaceAccount } from 'model/account-marketplace';

// Model
import { ApplicationConfiguration, EnumDataProvider } from 'model/configuration';

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
    minWidth: 480,
    maxWidth: 640,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  textField: {
    margin: 0,
    padding: 0,
    width: '100%',
  },
});

interface MarketplaceAccountConfigurationProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  account: MarketplaceAccount;
  config: ApplicationConfiguration;
  initialExternalProvider: EnumDataProvider;
  initialOpenDatasetProvider: boolean;
  loading: boolean;
  setExternalProvider: (key: string, provider: EnumDataProvider) => Promise<boolean>;
  setOpenDatasetProvider: (key: string, enabled: boolean) => Promise<boolean>;
}

interface MarketplaceAccountConfigurationState {
  confirmCompanyName: string;
  confirmExternalProviderUpdate: boolean;
  confirmOpenDatasetProviderUpdate: boolean;
  externalProvider: EnumDataProvider;
  openDatasetProvider: boolean;
}

class MarketplaceAccountConfiguration extends React.Component<MarketplaceAccountConfigurationProps, MarketplaceAccountConfigurationState> {

  constructor(props: MarketplaceAccountConfigurationProps) {
    super(props);

    this.state = {
      confirmCompanyName: '',
      confirmExternalProviderUpdate: false,
      confirmOpenDatasetProviderUpdate: false,
      externalProvider: props.initialExternalProvider,
      openDatasetProvider: props.initialOpenDatasetProvider,
    };
  }

  showExternalProviderConfirmDialog(): void {
    this.setState({
      confirmCompanyName: '',
      confirmExternalProviderUpdate: true,
    });
  }

  hideExternalProviderConfirmDialog(): void {
    this.setState({
      confirmCompanyName: '',
      confirmExternalProviderUpdate: false,
    });
  }

  showOpenDatasetProviderConfirmDialog(): void {
    this.setState({
      confirmCompanyName: '',
      confirmOpenDatasetProviderUpdate: true,
    });
  }

  hideOpenDatasetProviderConfirmDialog(): void {
    this.setState({
      confirmCompanyName: '',
      confirmOpenDatasetProviderUpdate: false,
    });
  }

  confirmExternalProviderDialogHandler(action: DialogAction): void {
    const { account } = this.props;
    const { externalProvider: provider } = this.state;

    switch (action.key) {
      case EnumDialogAction.Accept:
        this.props.setExternalProvider(account.key, provider).then((success) => {
          if (success) {
            this.hideExternalProviderConfirmDialog();
          }
        });
        break;

      case EnumDialogAction.Cancel:
        this.hideExternalProviderConfirmDialog();
        break;
    }
  }

  confirmOpenDatasetProviderDialogHandler(action: DialogAction): void {
    const { account } = this.props;
    const { openDatasetProvider } = this.state;

    switch (action.key) {
      case EnumDialogAction.Accept:
        this.props.setOpenDatasetProvider(account.key, openDatasetProvider).then((success) => {
          if (success) {
            this.hideOpenDatasetProviderConfirmDialog();
          }
        });
        break;

      case EnumDialogAction.Cancel:
        this.hideOpenDatasetProviderConfirmDialog();
        break;
    }
  }

  onAssignExternalProvider(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    this.showExternalProviderConfirmDialog();
  }

  onAssignOpenDatasetProvider(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    this.showOpenDatasetProviderConfirmDialog();
  }

  onOpenDatasetProviderChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState((state) => ({ openDatasetProvider: !state.openDatasetProvider }));
  }

  renderExternalProviderDialog() {
    const _t = this.props.intl.formatMessage;

    const { confirmExternalProviderUpdate, confirmCompanyName, externalProvider } = this.state;
    const { account, classes, config } = this.props;

    const providers = config.externalProviders!.filter(p => p.id === externalProvider);
    const provider = providers[0];

    if (!confirmExternalProviderUpdate || !account || !provider) {
      return null;
    }

    const companyName = account?.profile.provider.current?.name || '';

    const confirmMessage = externalProvider === EnumDataProvider.UNDEFINED ?
      'account-marketplace.message.reset-external-provider-confirm' :
      'account-marketplace.message.set-external-provider-confirm';
    const warningMessage = externalProvider === EnumDataProvider.UNDEFINED ?
      "account-marketplace.message.reset-external-provider-warning" :
      "account-marketplace.message.set-external-provider-warning";
    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Accept,
            label: _t({ id: 'view.shared.action.save' }),
            iconClass: () => (<Icon path={mdiCheck} size="1.5rem" />),
            color: 'primary',
            disabled: companyName !== confirmCompanyName
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideExternalProviderConfirmDialog()}
        handleAction={(action) => this.confirmExternalProviderDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirmExternalProviderUpdate}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormattedMessage
              id={confirmMessage}
              tagName={'p'}
              values={{ company: <b>{companyName}</b>, provider: <b>{provider.name}</b> }}
            />
            <Typography variant="h5" display="block" gutterBottom color="secondary">
              <FormattedMessage
                id={warningMessage}
                tagName={'p'}
              />
            </Typography>
            <FormattedMessage
              id="account-marketplace.message.external-provider-notes"
              tagName={'p'}
            />
          </Grid>
          <Grid item xs={12} >
            <TextField
              id="name"
              label={_t({ id: 'account-marketplace.form.field.provider.name' })}
              variant="standard"
              margin="normal"
              className={classes.textField}
              value={confirmCompanyName || ''}
              onChange={e => this.setState({ confirmCompanyName: e.target.value })}
              error={confirmCompanyName !== companyName}
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  renderOpenDatasetProviderDialog() {
    const _t = this.props.intl.formatMessage;

    const { confirmOpenDatasetProviderUpdate, confirmCompanyName, openDatasetProvider } = this.state;
    const { account, classes } = this.props;

    if (!confirmOpenDatasetProviderUpdate || !account) {
      return null;
    }

    const companyName = account?.profile.provider.current?.name || '';

    const confirmMessage = openDatasetProvider ?
      'account-marketplace.message.set-open-dataset-provider-confirm' :
      'account-marketplace.message.reset-open-dataset-provider-confirm';
    const warningMessage = openDatasetProvider ?
      "account-marketplace.message.set-open-dataset-provider-warning" :
      "account-marketplace.message.reset-open-dataset-provider-warning";
    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Accept,
            label: _t({ id: 'view.shared.action.save' }),
            iconClass: () => (<Icon path={mdiCheck} size="1.5rem" />),
            color: 'primary',
            disabled: companyName !== confirmCompanyName
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideOpenDatasetProviderConfirmDialog()}
        handleAction={(action) => this.confirmOpenDatasetProviderDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={confirmOpenDatasetProviderUpdate}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormattedMessage
              id={confirmMessage}
              tagName={'p'}
              values={{ company: <b>{companyName}</b> }}
            />
            <Typography variant="h5" display="block" gutterBottom color="secondary">
              <FormattedMessage
                id={warningMessage}
                tagName={'p'}
              />
            </Typography>
            <FormattedMessage
              id="account-marketplace.message.external-provider-notes"
              tagName={'p'}
            />
          </Grid>
          <Grid item xs={12} >
            <TextField
              id="name"
              label={_t({ id: 'account-marketplace.form.field.provider.name' })}
              variant="standard"
              margin="normal"
              className={classes.textField}
              value={confirmCompanyName || ''}
              onChange={e => this.setState({ confirmCompanyName: e.target.value })}
              error={confirmCompanyName !== companyName}
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }

  render() {
    const {
      account = null,
      classes,
      config,
      loading,
    } = this.props;
    const {
      externalProvider,
      openDatasetProvider,
    } = this.state;
    const _t = this.props.intl.formatMessage;

    if (!account) {
      return null;
    }

    return (
      <>
        <Grid container>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar className={classes.avatar}>
                  <Icon path={mdiTransitConnectionVariant} size="1.5rem" />
                </Avatar>
              }
              title={
                <FormattedMessage id={'account-marketplace.form.section.external-provider'} />
              }
            ></CardHeader>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <RadioGroup
                    value={externalProvider}
                    name="external-provider-group"
                    onChange={(e) => this.setState({ externalProvider: e.target.value as EnumDataProvider })}
                  >
                    {config.externalProviders!.map((p) => (
                      <FormControlLabel key={p.id} value={p.id} control={<Radio />} label={p.name} />
                    ))}
                  </RadioGroup>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions disableSpacing className={classes.cardActions}>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                disabled={loading || this.props.initialExternalProvider === this.state.externalProvider}
                onClick={(e) => this.onAssignExternalProvider(e)}
              >
                <FormattedMessage id="view.shared.action.save"></FormattedMessage>
              </Button>
            </CardActions>
          </Card>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar className={classes.avatar}>
                  <Icon path={mdiCreativeCommons} size="1.5rem" />
                </Avatar>
              }
              title={
                <FormattedMessage id={'account-marketplace.form.section.open-dataset-provider'} />
              }
            ></CardHeader>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={openDatasetProvider}
                        onChange={
                          (event) => this.onOpenDatasetProviderChange(event)
                        }
                        name="enabled"
                        color="primary"
                      />
                    }
                    label={_t({ id: 'account-marketplace.form.field.open-dataset-provider' })}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions disableSpacing className={classes.cardActions}>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                disabled={loading || this.props.initialOpenDatasetProvider === this.state.openDatasetProvider}
                onClick={(e) => this.onAssignOpenDatasetProvider(e)}
              >
                <FormattedMessage id="view.shared.action.save"></FormattedMessage>
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {this.renderExternalProviderDialog()}
        {this.renderOpenDatasetProviderDialog()}
      </>
    );
  }
}

// Apply styles
const StyledComponent = withStyles(styles)(MarketplaceAccountConfiguration);

// Inject i18n resources
const LocalizedComponent = injectIntl(StyledComponent);

export default LocalizedComponent;
