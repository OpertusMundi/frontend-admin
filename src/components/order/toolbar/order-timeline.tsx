import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

// Store
import { RootState } from 'store';

const styles = (theme: Theme) => createStyles({
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  }
});

interface ToolbarProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape,
}

class Toolbar extends React.Component<ToolbarProps> {

  render() {
    const { timeline } = this.props;
    if (!timeline?.order) {
      return (
        <div></div>
      );
    }
    return (
      <Typography component="h6" variant="h6" color="inherit" noWrap>
        Order {timeline.order.referenceNumber}
      </Typography>
    );
  }

}

const mapState = (state: RootState) => ({
  timeline: state.billing.order.timeline,
});

const mapDispatch = {
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

// Inject state
export default connector(localizedComponent);
