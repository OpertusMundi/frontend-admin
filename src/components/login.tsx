import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { toast } from 'react-toastify';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Store
import { RootState } from 'store';
import { getConfiguration } from 'store/config/thunks';
import { login, refreshProfile } from 'store/security/thunks';

// Model
import { EnumAuthProvider } from 'model/enum';

const styles = (theme: Theme) => createStyles({
  root: {
    height: '100vh',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  buttonIdP: {
    maxWidth: '272px',
    margin: theme.spacing(1, 0, 2),
    borderRadius: 0,
    textTransform: 'none',
  },
  buttonSubmit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: 0,
    textTransform: 'none',
  },
  logoImage: {
    width: '275px',
  },
  form: {
    maxWidth: '272px',
    marginTop: theme.spacing(1),
  },
  header: {
    margin: theme.spacing(2, 0),
  },
  image: {
    backgroundImage: 'url(/images/login-background.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

interface CopyrightProps {
  link: string;
  title: string;
}

const Copyright = (props: CopyrightProps) => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={props.link} target="_blank">
        {props.title}
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
};

interface LoginState {
  username: string;
  password: string;
}

interface LoginProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
}

class Login extends React.Component<LoginProps, LoginState> {

  state: LoginState = {
    username: '',
    password: '',
  }

  submit(e: React.FormEvent) {
    e.preventDefault();

    const { username, password } = this.state;

    this.props.login(username, password)
      .then(() => this.props.getConfiguration())
      .then(() => this.props.refreshProfile())
      .then(
        () => toast.dismiss(),
        () => {
          toast.dismiss();
          toast.error(<FormattedMessage id="login.failure" />);
        })
      .catch((err) => null);
  }

  render() {
    const { classes, config: { authProviders, clientId } } = this.props;
    const _t = this.props.intl.formatMessage;

    const formsEnabled = authProviders.includes(EnumAuthProvider.Forms);

    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={5} md={8} lg={9} className={classes.image} />
        <Grid item xs={12} sm={7} md={4} lg={3} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <img className={classes.logoImage} src="/images/logo-black.svg" alt="" />
            <Typography component="h1" variant="h6" className={classes.header}>
              <FormattedMessage id="login.subtitle" />
            </Typography>
            {formsEnabled &&
              <form className={classes.form} autoComplete="off" noValidate onSubmit={(e) => this.submit(e)}>
                <TextField
                  variant="standard"
                  margin="normal"
                  fullWidth
                  id="username"
                  label={_t({ id: 'login.username' })}
                  name="username"
                  autoFocus
                  defaultValue={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value })}
                />
                <TextField
                  variant="standard"
                  margin="normal"
                  fullWidth
                  name="password"
                  label={_t({ id: 'login.password' })}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  defaultValue={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.buttonSubmit}
                  disabled={!this.state.username || !this.state.password}
                >
                  <FormattedMessage id="login.login" />
                </Button>
              </form>
            }
            <br />
            {authProviders.includes(EnumAuthProvider.OpertusMundi) && clientId &&
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color={formsEnabled ? "default" : "primary"}
                className={classes.buttonIdP}
                href={`/oauth2/authorization/${clientId}`}
              >
                <FormattedMessage id={formsEnabled ? "login.login-idp" : "login.login"} />
              </Button>
            }
            <Box mt={5}>
              <Copyright title={_t({ id: 'company.title' })} link={_t({ id: 'company.website' })} />
            </Box>
          </div>
        </Grid>
      </Grid>
    );
  }
}

//
// Container component
//

const mapState = (state: RootState) => ({
  config: state.config,
});

const mapDispatch = {
  login: (username: string, password: string) => login(username, password),
  getConfiguration: () => getConfiguration(),
  refreshProfile: () => refreshProfile(),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(Login);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
