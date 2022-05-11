import { FormattedMessage } from 'react-intl';

// Icons
import Icon from '@mdi/react';
import {
  mdiBankTransfer,
  mdiCreditCardOutline,
  mdiPiggyBankOutline,
} from '@mdi/js';

// Model
import { EnumPaymentMethod } from 'model/enum';
import { OrderItem, PayIn } from 'model/order';
import {
  CallPrePaidQuotationParameters,
  EnumPricingModel,
} from 'model/pricing-model';

export function mapPaymentMethodToIcon(payin: PayIn, className?: string) {
  switch (payin.paymentMethod) {
    case EnumPaymentMethod.FREE:
      return (<Icon path={mdiPiggyBankOutline} size="1.5rem" className={className} />);
    case EnumPaymentMethod.BANKWIRE:
      return (<Icon path={mdiBankTransfer} size="1.5rem" className={className} />);
    case EnumPaymentMethod.CARD_DIRECT:
      return (<Icon path={mdiCreditCardOutline} size="1.5rem" className={className} />);
  }
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

export function renderPricingModel(item: OrderItem): React.ReactNode {
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