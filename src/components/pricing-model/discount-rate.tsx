import React from 'react';

// Localization
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, InputAdornment, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// Components
import { DiscountRate } from 'model/pricing-model';

const styles = (theme: Theme) => createStyles({
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  textField: {
    width: 120,
    margin: 0,
    padding: 0,
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
});

interface PricingModelEditorProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  count: number;
  discount: number;
  onChange: (r: DiscountRate) => void;
}

class PricingModelEditor extends React.Component<PricingModelEditorProps> {

  static defaultProps = {
    count: 10000,
    discount: 5,
  }

  private parseNumber(value: string, defaultValue: number, min?: number, max?: number): number {
    if (value === '' || value === '-') {
      return -1;
    }
    const numValue = +value;
    if (min) {
      return numValue < min ? defaultValue : numValue;
    }
    if (max) {
      return numValue > max ? defaultValue : numValue;
    }
    return numValue;
  }

  render() {
    const _t = this.props.intl.formatMessage;
    const { count, discount } = this.props;
    const {
      classes,
    } = this.props;

    return (
      <Grid container spacing={4}>
        <Grid item>
          <TextField
            className={classes.textField}
            type={'number'}
            id="count"
            name="count"
            InputProps={{
              inputProps: { min: 1 },
            }}
            label={_t({ id: 'pricing-model.discount-rate.count-calls' })}
            value={count === -1 ? '' : count}
            onChange={(e) => {
              const value = this.parseNumber(e.target.value, count, 1);
              this.props.onChange({ count: value, discount });
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.textField}
            type={'number'}
            id="discount"
            name="discount"
            InputProps={{
              inputProps: { min: 1, max: 99 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            label={_t({ id: 'pricing-model.discount-rate.discount' })}
            value={discount === -1 ? '' : discount}
            onChange={(e) => {
              const value = this.parseNumber(e.target.value, discount, 1, 99);
              this.props.onChange({ count, discount: value });
            }}
          />
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

