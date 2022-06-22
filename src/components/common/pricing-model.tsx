import React from 'react';

// State, routing and localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Model
import { PerCallQuotationParameters, EnumPricingModel, SHSubscriptionQuotationParameters } from 'model/pricing-model';
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

      case EnumPricingModel.PER_CALL: {
        const typedUserParams = userParameters as PerCallQuotationParameters;
        const tier = model.prePaidTiers[typedUserParams.prePaidTier];

        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ count: (<b>{numberFormatter(tier.count)}</b>), discount: (<b>{`${tier.discount}%`}</b>) }}
          />
        );
      }

      case EnumPricingModel.PER_ROW: {
        const typedUserParams = userParameters as PerCallQuotationParameters;
        const tier = model.prePaidTiers[typedUserParams.prePaidTier];

        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ count: (<b>{numberFormatter(tier.count)}</b>), discount: (<b>{`${tier.discount}%`}</b>) }}
          />
        );
      }

      case EnumPricingModel.SENTINEL_HUB_IMAGES:
        return (
          <FormattedMessage id={`enum.effective-pricing-model.${model.type}`} />
        );


      case EnumPricingModel.SENTINEL_HUB_SUBSCRIPTION:
        const typedUserParams = userParameters as SHSubscriptionQuotationParameters;
        const frequency = typedUserParams.frequency;
        return (
          <FormattedMessage
            id={`enum.effective-pricing-model.${model.type}`}
            values={{ frequency: <FormattedMessage id={`enum.subscription.${frequency}`}></FormattedMessage> }}
          />
        );

    }
  }
}

// Apply styles
const styledComponent = withStyles(styles)(PricingModelDetails);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;
