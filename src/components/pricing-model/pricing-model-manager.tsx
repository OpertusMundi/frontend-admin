import React from 'react';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

// Components
import PrivateServicePricingModel from './private-service-pricing-model';

const styles = (theme: Theme) => createStyles({
  button: {
    borderRadius: 0,
    textTransform: 'none',
    margin: theme.spacing(0, 1, 0, 0),
    padding: theme.spacing(1),
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  dateField: {
    margin: 0,
    padding: 0,
    width: 120,
  },
  divider: {
    margin: 0,
    padding: 0,
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  textField: {
    margin: 0,
    padding: 0,
    width: 120,
  },
});

interface PricingModelEditorProps extends WithStyles<typeof styles> {
  intl: IntlShape;
}

class PricingModelEditor extends React.Component<PricingModelEditorProps> {

  render() {
    return (
      <Grid container>
        <Grid item sm={12} md={6}>
          <PrivateServicePricingModel />
        </Grid>
      </Grid>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(PricingModelEditor);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;
