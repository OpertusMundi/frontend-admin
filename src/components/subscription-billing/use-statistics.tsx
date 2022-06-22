import React from 'react';

// State, routing and localization
import { injectIntl, IntlShape, FormattedDate, FormattedNumber } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import {
  mdiClose, mdiEqual,
} from '@mdi/js';

// Utilities
import clsx from 'clsx';

// Model
import { SubscriptionBilling } from 'model/order';
import { EnumPricingModel } from 'model/pricing-model';

const styles = (theme: Theme) => createStyles({
  blockTable: {
    width: '100%',
  },
  blockAlignRight: {
    textAlign: 'right',
  },
  blockTableDivider: {
    borderTop: '1px solid',
  },
  operator: {

  },
  wrapper: {
    padding: theme.spacing(2),
  },
});

interface UseStatisticsProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  record: SubscriptionBilling;
}

interface BlockRateCost {
  price: number;
  count: number;
  discount?: number;
  cost: number;
}

class UseStatistics extends React.Component<UseStatisticsProps> {

  getBlocks(): BlockRateCost[] {
    const result: BlockRateCost[] = [];

    const { record } = this.props;
    if (!record) {
      return result;
    }
    const model = record.pricingModel;

    switch (model.type) {
      case EnumPricingModel.PER_CALL:
      case EnumPricingModel.PER_ROW:
        const price = model.price;
        const blocks = model.discountRates;

        let callsLeft = record.totalCalls - record.skuTotalCalls;

        if (blocks.length !== 0) {
          for (const block of blocks) {
            const blockCount = callsLeft > block.count ? block.count : callsLeft;
            if (blockCount > 0) {
              const discount = 100 - block.discount;
              const cost = Math.round((blockCount * price * discount / 100) * 100) / 100;
              result.push({ discount: block.discount, count: blockCount, cost, price });
            }
            callsLeft -= blockCount;
          }
        }
        if (callsLeft > 0) {
          const cost = Math.round((callsLeft * price) * 100) / 100;
          result.push({ count: callsLeft, cost, price });
        }
        break;
    }
    return result;
  }

  render() {
    const { classes, record } = this.props;
    if (!record) {
      return;
    }
    const model = record.pricingModel;
    const blocks = this.getBlocks();

    return (
      <Grid container spacing={1} className={classes.wrapper}>
        <Grid item xs={12}>
          <Typography variant="h5" display="block" gutterBottom color="primary">
            Subscription
          </Typography>
        </Grid>
        <Grid container item xs={12}>
          <Grid container item xs={6} direction={'column'}>
            <Typography variant="caption" display="block" gutterBottom>
              Asset
            </Typography>
            <Typography variant="body1" display="block" gutterBottom>
              {record.subscription?.item?.title}
            </Typography>
          </Grid>
          <Grid container item xs={6} direction={'column'}>
            <Typography variant="caption" display="block" gutterBottom>
              Interval
            </Typography>
            <Typography variant="body1" display="block" gutterBottom>
              <FormattedDate value={record.fromDate.toDate()} day='numeric' month='numeric' year='numeric' />
              {' - '}
              <FormattedDate value={record.toDate.toDate()} day='numeric' month='numeric' year='numeric' />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" display="block" gutterBottom color="primary">
            Usage Statistics
          </Typography>
        </Grid>
        <Grid container item xs={4}>
          {model.type === EnumPricingModel.PER_CALL &&
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                Total Calls
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {record.totalCalls}
              </Typography>
            </Grid>
          }
          {model.type === EnumPricingModel.PER_ROW &&
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                Total rows
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {record.totalRows}
              </Typography>
            </Grid>
          }
        </Grid>
        <Grid container item xs={4}>
          {model.type === EnumPricingModel.PER_CALL &&
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                SKU calls
              </Typography>
              <Typography variant="body1" display="block" gutterBottom color="primary">
                {record.skuTotalCalls}
              </Typography>
            </Grid>
          }
          {model.type === EnumPricingModel.PER_ROW &&
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                SKU rows
              </Typography>
              <Typography variant="body1" display="block" gutterBottom color="primary">
                {record.skuTotalRows}
              </Typography>
            </Grid>
          }
        </Grid>
        <Grid container item xs={4}>
          {model.type === EnumPricingModel.PER_CALL &&
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                Charged Calls
              </Typography>
              <Typography variant="body1" display="block" gutterBottom color="secondary">
                {record.totalCalls - record.skuTotalCalls}
              </Typography>
            </Grid>
          }
          {model.type === EnumPricingModel.PER_ROW &&
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                Charged rows
              </Typography>
              <Typography variant="body1" display="block" gutterBottom color="secondary">
                {record.totalRows - record.skuTotalRows}
              </Typography>
            </Grid>
          }
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Typography variant="h5" display="block" gutterBottom color="primary">
              Analysis
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <table className={classes.blockTable}>
              <tbody>
                <tr key={'block-header'}>
                  <td>
                    <Typography variant="caption" display="block">
                      Price
                    </Typography>
                  </td>
                  <td>
                  </td>
                  <td>
                    <Typography variant="caption" display="block">
                      Rows
                    </Typography>
                  </td>
                  <td>
                  </td>
                  <td>
                    <Typography variant="caption" display="block">
                      Discount
                    </Typography>
                  </td>
                  <td>
                  </td>
                  <td className={classes.blockAlignRight}>
                    <Typography variant="caption" display="block">
                      Price
                    </Typography>
                  </td>
                </tr>
                {blocks.map((block, index) => (
                  <tr>
                    <td>
                      <Typography variant="body1" display="block" component="div">
                        <FormattedNumber value={block.price} style={'currency'} currency={'EUR'} minimumFractionDigits={3} />
                      </Typography>
                    </td>
                    <td>
                      <Icon path={mdiClose} size="1rem" className={classes.operator} />
                    </td>
                    <td>
                      <Typography variant="body1" display="block" component="div">
                        {block.count}
                      </Typography>
                    </td>
                    <td>
                      {block.discount &&
                        <Icon path={mdiClose} size="1rem" className={classes.operator} />
                      }
                    </td>
                    <td>
                      {block.discount &&
                        <Typography variant="body1" display="block" component="div">
                          {(100 - block.discount)} %
                        </Typography>
                      }
                    </td>
                    <td>
                      <Icon path={mdiEqual} size="1rem" className={classes.operator} />
                    </td>
                    <td className={classes.blockAlignRight}>
                      <Typography variant="body1" display="block" component="div">
                        <FormattedNumber value={block.cost} style={'currency'} currency={'EUR'} />
                      </Typography>
                    </td>
                  </tr>
                ))}
                <tr key={'block-total'}>
                  <td colSpan={6}>
                  </td>
                  <td className={clsx(classes.blockTableDivider, classes.blockAlignRight)} >
                    <Typography variant="body1" display="block" component="div">
                      <FormattedNumber value={record.totalPriceExcludingTax} style={'currency'} currency={'EUR'} />
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid >
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(UseStatistics);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;