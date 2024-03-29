// Icons
import Icon from '@mdi/react';
import {
  mdiBank,
  mdiBankOffOutline,
  mdiCreditCardOffOutline,
  mdiCreditCardOutline,
  mdiPiggyBankOutline,
} from '@mdi/js';

// Model
import { EnumPaymentMethod } from 'model/enum';
import { PayIn } from 'model/order';

export function mapPaymentMethodToIcon(payin: PayIn, className?: string) {
  switch (payin.paymentMethod) {
    case EnumPaymentMethod.FREE:
      return (<Icon path={mdiPiggyBankOutline} size="1.5rem" className={className} />);
    case EnumPaymentMethod.BANKWIRE:
      return payin.refund
        ? (<Icon path={mdiBankOffOutline} size="1.5rem" className={className} />)
        : (<Icon path={mdiBank} size="1.5rem" className={className} />);
    case EnumPaymentMethod.CARD_DIRECT:
      return payin.refund
        ? (<Icon path={mdiCreditCardOffOutline} size="1.5rem" className={className} />)
        : (<Icon path={mdiCreditCardOutline} size="1.5rem" className={className} />);
  }
}
