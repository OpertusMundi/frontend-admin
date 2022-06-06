import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { useNavigate, NavigateFunction } from "react-router-dom";

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiBankTransferIn, mdiDatabaseCogOutline } from '@mdi/js';

// Store
import { RootState } from 'store';

// Model
import { buildPath, DynamicRoutes, Route } from 'model/routes';

const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
});

interface ToolbarProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  route?: Route;
  navigate: NavigateFunction;
}

class Toolbar extends React.Component<ToolbarProps> {

  viewWorkflow(): void {
    const { record } = this.props;
    const processInstance = record?.processInstance;

    if (processInstance) {
      const path = buildPath(DynamicRoutes.ProcessInstanceHistoryView, null, { processInstance });
      this.props.navigate(path);
    }
  }

  render() {
    const { classes, record } = this.props;

    if (!record) {
      return (
        <div></div>
      );
    }

    const processInstance = record?.processInstance;

    return (
      <div className={classes.container}>
        <div className={classes.container}>
          <Icon path={mdiBankTransferIn} size="1.5rem" className={classes.icon} />
          <Typography component="h6" variant="h6" color="inherit" noWrap>
            Pay Out {record.bankwireRef}
          </Typography>
        </div>
        {processInstance &&
          <div>
            <IconButton
              color="inherit"
              onClick={() => this.viewWorkflow()}
              title="Show process instance"
            >
              <Icon path={mdiDatabaseCogOutline} size="1.5rem" />
            </IconButton>
          </div>
        }
      </div>
    );
  }

}

const mapState = (state: RootState) => ({
  record: state.billing.payout.record,
});

const mapDispatch = {
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

  return (
    <ConnectedComponent route={props.route} navigate={navigate} />
  );
}

export default RoutedComponent;
