import React from 'react';

// State, routing and localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Model
import { CallPrePaidQuotationParameters, EnumPricingModel } from 'model/pricing-model';
import { OrderItem } from 'model/order';

const styles = (theme: Theme) => createStyles({
});

interface PricingModelDetailsProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  item: OrderItem;
}

function numberFormatter(value: number): string {
  if (value < 1000) {
    return value.toFixed();
  } if (value < 1000000) {
    return (value / 1000).toFixed() + 'K';
  } else {
    return (value / 1000000).toFixed() + 'M';
  }
}

class PricingModelDetails extends React.Component<PricingModelDetailsProps> {

  render() {
    const { item } = this.props;
    const model = item.pricingModel.model;
    const systemParameters = item.pricingModel.systemParameters;
    const userParameters = item.pricingModel.userParameters;

    switch (model.type) {
      case EnumPricingModel.FREE:
      case EnumPricingModel.PER_CALL_WITH_BLOCK_RATE:
      case EnumPricingModel.PER_ROW_WITH_BLOCK_RATE:
      case EnumPricingModel.SENTINEL_HUB_IMAGES:
      case EnumPricingModel.SENTINEL_HUB_SUBSCRIPTION:
        return (
          <FormattedMessage id={`enum.effective-pricing-model.${model.type}`} />
        );

      case EnumPricingModel.FIXED: {
        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ years: model.yearsOfUpdates }}
          />
        );
      }

      case EnumPricingModel.FIXED_PER_ROWS: {
        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ years: systemParameters.rows }}
          />
        );
      }

      case EnumPricingModel.FIXED_FOR_POPULATION: {
        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ population: systemParameters.populationPercent }}
          />
        );
      }

      case EnumPricingModel.PER_CALL_WITH_PREPAID: {
        const typedUserParams = userParameters as CallPrePaidQuotationParameters;
        const tier = model.prePaidTiers[typedUserParams.prePaidTier];

        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ count: (<b>{numberFormatter(tier.count)}</b>), discount: (<b>{`${tier.discount}%`}</b>) }}
          />
        );
      }

      case EnumPricingModel.PER_ROW_WITH_PREPAID: {
        const typedUserParams = userParameters as CallPrePaidQuotationParameters;
        const tier = model.prePaidTiers[typedUserParams.prePaidTier];

        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ count: (<b>{numberFormatter(tier.count)}</b>), discount: (<b>{`${tier.discount}%`}</b>) }}
          />
        );
      }
    }
  }
}

// Apply styles
const styledComponent = withStyles(styles)(PricingModelDetails);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;
