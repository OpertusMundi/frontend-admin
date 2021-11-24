import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Icons

// Services

// Store
import { RootState } from 'store';

// Model

// Components

const styles = (theme: Theme) => createStyles({
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
  paperTable: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
    overflowX: 'auto',
  },
  caption: {
    paddingLeft: 0,
    fontSize: '0.7rem',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  drawer: {
    padding: theme.spacing(1),
    minHeight: 200,
  },
  drawerContent: {
    padding: 0,
    minHeight: 200,
  },
  exception: {
    maxHeight: 400,
  }
});

interface MaintenanceManagerState {
}

interface MaintenanceManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class MaintenanceManager extends React.Component<MaintenanceManagerProps, MaintenanceManagerState> {

  state: MaintenanceManagerState = {
  }

  render() {
    return (
      <div>
      </div >
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
const styledComponent = withStyles(styles)(MaintenanceManager);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
