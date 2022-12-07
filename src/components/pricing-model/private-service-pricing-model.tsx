import _ from 'lodash';
import React from 'react';
import { NumericFormat } from 'react-number-format';

// State, routing and localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import { blue } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiCloseOutline,
  mdiCartPercent,
  mdiCheckOutline,
  mdiTrashCanOutline,
  mdiCommentAlertOutline,
  mdiCashClock,
} from '@mdi/js';

// Model
import { Message } from 'model/message';
import { DiscountRate, EnumPricingModel, PerCallPricingModelCommand } from 'model/pricing-model';

// Services
import message from 'service/message';
import SubscriptionBillingApi from 'service/subscription-billing';
import { FieldMapperFunc, localizeErrorCodes } from 'utils/error';

// Components
import DiscountRateComponent from './discount-rate';

const MAX_DISCOUNT_RATES = 3;

const defaultPricingModel: PerCallPricingModelCommand = {
  type: EnumPricingModel.PER_CALL,
  price: 0.001,
  discountRates: [],
  prePaidTiers: [],
};

const fieldMapper: FieldMapperFunc = (field: string): string | null => {
  switch (field) {
    case 'price':
      return 'Price';
    case 'prePaidTiers':
      return 'Prepaid tiers';
    case 'discountRates':
      return 'Discount rates';
  }
  return null;
};

const customerErrorMapper = (intl: IntlShape, message: Message, fieldMapper?: FieldMapperFunc) => {
  switch (message.description) {
    case 'DISCOUNT_RATE_COUNT_ORDER':
      return intl.formatMessage({ id: `error.QuotationMessageCode.${message.description}` });
    case 'DISCOUNT_RATE_DISCOUNT_ORDER':
      return intl.formatMessage({ id: `error.QuotationMessageCode.${message.description}` });
    case 'PREPAID_COUNT_ORDER':
      return intl.formatMessage({ id: `error.QuotationMessageCode.${message.description}` });
    case 'PREPAID_DISCOUNT_ORDER':
      return intl.formatMessage({ id: `error.QuotationMessageCode.${message.description}` });
  }


  return null;
}

const styles = (theme: Theme) => createStyles({
  avatarBlue: {
    backgroundColor: blue[500],
  },
  button: {
    borderRadius: 0,
    textTransform: 'none',
    margin: theme.spacing(0, 1, 0, 0),
    padding: theme.spacing(1),
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  card: {
    minWidth: 480,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  divider: {
    margin: 0,
    padding: 0,
  },
  textField: {
    margin: 0,
    padding: 0,
    width: 120,
  },
});

interface PrivateServicePricingModelProps extends WithStyles<typeof styles> {
  intl: IntlShape;
}

interface PrivateServicePricingModelState {
  loading: boolean;
  pricingModel: PerCallPricingModelCommand | null;
}

class PrivateServicePricingModel extends React.Component<PrivateServicePricingModelProps, PrivateServicePricingModelState> {

  private initialValue: PerCallPricingModelCommand | null = null;

  private billingService: SubscriptionBillingApi;

  public constructor(props: PrivateServicePricingModelProps) {
    super(props);

    this.state = {
      loading: false,
      pricingModel: null,
    };

    this.billingService = new SubscriptionBillingApi();
  }

  public get isModified(): boolean {
    return !_.isEqual(this.initialValue, this.state.pricingModel);
  }

  componentDidMount() {
    this.getPricingModel();
  }

  async getPricingModel() {
    try {
      this.setState({ loading: true });

      const response = await this.billingService.getDefaultPricingModel();
      if (response.success) {
        const pricingModel = response.result || _.cloneDeep(defaultPricingModel);
        this.initialValue = _.cloneDeep(pricingModel);
        this.setState({ pricingModel });
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  async setPricingModel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const { pricingModel } = this.state;

    if (!pricingModel) {
      return;
    }
    try {
      this.setState({ loading: true });

      const response = await this.billingService.setDefaultPricingModel(pricingModel);

      if (response.success) {
        this.initialValue = _.cloneDeep(this.state.pricingModel);
        message.info('message.settings-changed');
      } else {
        const messages = localizeErrorCodes(this.props.intl, response, true, fieldMapper, customerErrorMapper);
        message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  setDiscountRate(index: number, value: DiscountRate) {
    const { pricingModel } = this.state;

    if (pricingModel) {
      this.setState((state) => ({
        pricingModel: {
          ...state.pricingModel!, discountRates: state.pricingModel!.discountRates.map((r, i) => i === index ? value : r)
        }
      }));
    }
  }

  addDiscountRate() {
    const { pricingModel } = this.state;

    if (pricingModel) {
      this.setState((state) => ({
        pricingModel: {
          ...state.pricingModel!,
          discountRates: [...state.pricingModel!.discountRates, { count: 1, discount: 5 }]
        },
      }));
    }
  }

  removeDiscountRate(index: number) {
    const { pricingModel } = this.state;

    if (pricingModel) {
      this.setState((state) => ({
        pricingModel: {
          ...state.pricingModel!,
          discountRates: [...state.pricingModel!.discountRates.filter((r, i) => index !== i)],
        },
      }));
    }
  }

  discard() {
    this.getPricingModel();
  }

  render() {
    const _t = this.props.intl.formatMessage;
    const { loading, pricingModel: model } = this.state;
    const { classes } = this.props;

    if (!model) {
      return null;
    }

    const textFieldProps = {
      id: 'name',
      label: _t({ id: 'pricing-model.price-per-call' }),
      className: classes.textField,
      error: !model.price,
    };

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatarBlue}>
              <Icon path={mdiCashClock} size="1.5rem" />
            </Avatar>
          }
          title={'Private OGC services'}
          subheader="Set pricing model for private OGC services"
        ></CardHeader>
        <Divider />
        <CardContent>
          <Grid container item spacing={2}>
            <Grid item xs={6}>
              <NumericFormat
                allowNegative={false}
                value={model.price}
                customInput={TextField}
                decimalSeparator={','}
                decimalScale={3}
                suffix={' €'}
                onValueChange={(values, sourceInfo) => this.setState((state) => ({
                  pricingModel: { ...state.pricingModel!, price: values.floatValue === undefined ? 0 : values.floatValue }
                }))}
                {...textFieldProps}
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={6}>
                <Button
                  type="button"
                  variant="contained"
                  color="default"
                  className={classes.button}
                  onClick={() => this.addDiscountRate()}
                  disabled={model.discountRates.length >= MAX_DISCOUNT_RATES}
                >
                  <Icon path={mdiCartPercent} size="1.5rem" className={classes.buttonIcon} />
                  <FormattedMessage id="pricing-model.add-discount-rate" />
                </Button>
              </Grid>
              <Grid container item xs={6} justifyContent="flex-end">
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={() => this.discard()}
                  disabled={!this.isModified || loading}
                >
                  <Icon path={mdiCloseOutline} size="1.5rem" className={classes.buttonIcon} />
                  <FormattedMessage id="view.shared.action.cancel" />
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={(e) => this.setPricingModel(e)}
                  disabled={!this.isModified || loading}
                >
                  <Icon path={mdiCheckOutline} size="1.5rem" className={classes.buttonIcon} />
                  <FormattedMessage id="view.shared.action.save" />
                </Button>
              </Grid>
            </Grid>
            {model.discountRates.length !== 0 &&
              <Grid item xs={12} className={classes.divider}>
                <Divider variant={'fullWidth'} className={classes.divider} />
              </Grid>
            }
            {model.discountRates.map((r, index) => (
              <Grid container item key={`discount-rate-${index}`} alignItems={'center'}>
                <Grid item xs={6}>
                  <DiscountRateComponent
                    count={r.count}
                    discount={r.discount}
                    onChange={(r) => this.setDiscountRate(index, r)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    aria-label={_t({ id: 'pricing-model.remove-discount-rate' })}
                    color="secondary"
                    onClick={() => this.removeDiscountRate(index)}
                  >
                    <Icon path={mdiTrashCanOutline} size="1.5rem" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(PrivateServicePricingModel);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

export default LocalizedComponent;
