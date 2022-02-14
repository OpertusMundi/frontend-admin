import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, NavigateFunction, Location } from "react-router-dom";

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

// Store
import { RootState } from 'store';
import { setExternalProvider } from 'store/account-marketplace/thunks';

// Model
import { Route } from 'model/routes';
import { ExternalProviderCommand } from 'model/account-marketplace';

const styles = (theme: Theme) => createStyles({
  breadcrumb: {
    flexGrow: 1,
    '& li': {
      color: '#ffffff',
    }
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  actions: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

interface ToolbarProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  route?: Route;
  navigate: NavigateFunction;
  location: Location;
}

export class Toolbar extends React.Component<ToolbarProps> {

  render() {
    const { classes, route, account } = this.props;

    return (
      <Breadcrumbs separator="›" className={classes.breadcrumb}>
        <div key={'title'} style={{ display: 'flex', alignItems: 'center' }}>
          {route?.icon &&
            <div style={{ display: 'flex', marginRight: 10 }}>
              {route.icon()}
            </div>
          }
          <Typography component="h6" variant="h6" color="inherit" noWrap>
            <FormattedMessage id={'links.account.marketplace.manager'} />
          </Typography>
        </div>
        {account &&
          <div key={'user'} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography component="h6" variant="h6" color="inherit" noWrap>
              {account.email}
            </Typography>
          </div>
        }
      </Breadcrumbs>
    );
  }

}

const mapState = (state: RootState) => ({
  account: state.account.marketplace.account,
});

const mapDispatch = {
  setExternalProvider: (key: string, command: ExternalProviderCommand) => setExternalProvider(key, command),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const StyledComponent = withStyles(styles)(Toolbar);

// Inject i18n resources
const LocalizedComponent = injectIntl(StyledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = (props: { route: Route }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent route={props.route} navigate={navigate} location={location} />
  );
}

export default RoutedComponent;
