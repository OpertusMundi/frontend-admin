import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, NavigateFunction, Location } from "react-router-dom";

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import {
  mdiDomain,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { toggleProviderDialog } from 'store/contract/actions';

// Model
import { Route } from 'model/routes';

const styles = (theme: Theme) => createStyles({
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
  intl: IntlShape,
  route?: Route,
  navigate: NavigateFunction;
  location: Location;
}

class Toolbar extends React.Component<ToolbarProps> {

  toggleProviderDialog(): void {
    this.props.toggleProviderDialog();
  }

  render() {
    const { classes, route, contract } = this.props;

    return (
      <div className={classes.root}>
        {route?.icon &&
          <div style={{ display: 'flex', marginRight: 10 }}>
            {route.icon()}
          </div>
        }
        <Typography component="h6" variant="h6" color="inherit" noWrap>
          <FormattedMessage id={route?.title} defaultMessage={route?.defaultTitle} />
        </Typography>
        <div className={classes.actions}>
          <IconButton
            color="inherit"
            onClick={() => this.toggleProviderDialog()}
          >
            {contract?.provider &&
              <span style={{ paddingRight: 16 }}>{contract.provider.name}</span>
            }
            <Icon path={mdiDomain} size="1.5rem" />
          </IconButton>
        </div>
      </div >
    );
  }

}

const mapState = (state: RootState) => ({
  contract: state.contract.contractViewModel,
});

const mapDispatch = {
  toggleProviderDialog,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(Toolbar);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

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