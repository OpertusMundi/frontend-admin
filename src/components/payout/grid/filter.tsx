import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Model
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumTransactionStatus, EnumPayOutSortField, PayOut, PayOutQuery } from 'model/order';

// Services
import message from 'service/message';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: 5,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing(3, 0, 2, 2),
    borderRadius: 0,
    textTransform: 'none',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
});

interface PayOutFiltersProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  query: PayOutQuery,
  setFilter: (query: Partial<PayOutQuery>) => void,
  resetFilter: () => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumPayOutSortField>[]
  ) => Promise<PageResult<PayOut> | null>,
  disabled: boolean,
}

class PayOutFilters extends React.Component<PayOutFiltersProps> {

  constructor(props: PayOutFiltersProps) {
    super(props);

    this.clear = this.clear.bind(this);
    this.search = this.search.bind(this);

    const _t = props.intl.formatMessage;

    this.statusOptions = [];
    for (const value in EnumTransactionStatus) {
      this.statusOptions.push({
        value: value as EnumTransactionStatus, label: _t({ id: `enum.transaction-status.${value}` })
      });
    }
  }

  statusOptions: { value: EnumTransactionStatus, label: string }[];

  find(): void {
    this.props.find({ page: 0, size: 10 }).then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  clear(): void {
    this.props.resetFilter();
    this.find();
  }

  search(e: React.FormEvent): void {
    e.preventDefault();

    this.find();
  }

  render() {
    const { classes, disabled, query, setFilter } = this.props;
    const _t = this.props.intl.formatMessage;

    return (
      <form onSubmit={this.search} noValidate autoComplete="off">
        <Grid container spacing={3} justify={'space-between'}>
          <Grid item sm={3} xs={12}>
            <TextField
              id="bankwireRef"
              label={_t({ id: 'billing.payout.filter.bankwire-ref' })}
              variant="standard"
              margin="normal"
              className={classes.textField}
              value={query.bankwireRef || ''}
              onChange={e => setFilter({ bankwireRef: e.target.value })}
            />
          </Grid>

          <Grid item sm={3} xs={12}>
            <TextField
              id="email"
              label={_t({ id: 'billing.payout.filter.email' })}
              variant="standard"
              margin="normal"
              className={classes.textField}
              value={query.email || ''}
              onChange={e => setFilter({ email: e.target.value })}
            />
          </Grid>

          <Grid item sm={3} xs={12}>
            <Autocomplete
              style={{ marginTop: 16 }}
              multiple
              options={this.statusOptions}
              getOptionLabel={(option) => option.label}
              value={this.statusOptions.filter(o => query.status.includes(o.value)) || null}
              onChange={(event, value) => {
                setFilter({ status: value.map(v => v.value) })
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={_t({ id: 'billing.payout.filter.status' })}
                />
              )}
            />
          </Grid>

          <Grid container item sm={3} xs={12} justify={'flex-end'}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={disabled}
            >
              <FormattedMessage id="view.shared.action.search" />
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(PayOutFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

