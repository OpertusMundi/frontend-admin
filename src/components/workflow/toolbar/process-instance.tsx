import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiReload } from '@mdi/js';

// Store
import { RootState } from 'store';
import { findOne } from 'store/process-instance/thunks'

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
  intl: IntlShape;
  route?: Route;
}

class Toolbar extends React.Component<ToolbarProps> {

  render() {
    const { classes, processInstance = null, route } = this.props;

    if (!processInstance) {
      return (
        <div></div>
      );
    }

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
            onClick={() => this.props.findOne(processInstance.instance.businessKey, processInstance.instance.id)}
          >
            <Icon path={mdiReload} size="1.5rem" />
          </IconButton>
        </div>
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  processInstance: state.workflow.instances.runtime.processInstance
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
const styledComponent = withStyles(styles)(Toolbar);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = (props: { route: Route }) => {
  return (
    <ConnectedComponent route={props.route} />
  );
}

export default RoutedComponent;
