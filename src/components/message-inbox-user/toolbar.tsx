import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import {
  mdiReload,
} from '@mdi/js';

// Store
import { RootState } from 'store';
import { find } from 'store/message-inbox-user/thunks';

// Model
import { PageRequest, Sorting } from 'model/response';
import { Route } from 'model/routes';
import { EnumMessageSortField } from 'model/chat';

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

interface ToolbarProps extends PropsFromRedux, RouteComponentProps, WithStyles<typeof styles> {
  intl: IntlShape,
  route?: Route,
}

class Toolbar extends React.Component<ToolbarProps> {

  refresh(): void {
    this.props.find();
  }


  render() {
    const { classes, route } = this.props;

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
            onClick={() => this.refresh()}
          >
            <Icon path={mdiReload} size="1.5rem" />
          </IconButton>
        </div>
      </div>
    );
  }

}

const mapState = (state: RootState) => ({
});

const mapDispatch = {
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumMessageSortField>[]) => find(pageRequest, sorting),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(Toolbar);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject routing
const routedComponent = withRouter(localizedComponent);

// Inject state
export default connector(routedComponent);
