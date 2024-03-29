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
import { EnumDisputeStatus, EnumDisputeSortField, Dispute, DisputeQuery } from 'model/dispute';

// Services
import message from 'service/message';

const styles = (theme: Theme) => createStyles({
  button: {
    margin: theme.spacing(3, 0, 2, 2),
    borderRadius: 0,
    textTransform: 'none',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    paddingTop: 7,
  },
});

interface DisputeFiltersProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  query: DisputeQuery,
  setFilter: (query: Partial<DisputeQuery>) => void,
  resetFilter: () => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumDisputeSortField>[]
  ) => Promise<PageResult<Dispute> | null>,
  disabled: boolean,
}

class DisputeFilters extends React.Component<DisputeFiltersProps> {

  constructor(props: DisputeFiltersProps) {
    super(props);

    this.clear = this.clear.bind(this);
    this.search = this.search.bind(this);

    const _t = props.intl.formatMessage;

    this.statusOptions = [];
    for (const value in EnumDisputeStatus) {
      this.statusOptions.push({
        value: value as EnumDisputeStatus, label: _t({ id: `enum.dispute-status.${value}` })
      });
    }
  }

  statusOptions: { value: EnumDisputeStatus, label: string }[];

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
        <Grid container spacing={3} justifyContent={'space-between'}>
          <Grid item sm={4} xs={12}>
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
                  label={_t({ id: 'billing.dispute.filter.status' })}
                />
              )}
            />
          </Grid>

          <Grid container item sm={2} xs={12} justifyContent={'flex-end'}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={disabled}
            >
              <FormattedMessage id="view.shared.action.search" />
            </Button>
            <Button
              type="button"
              variant="contained"
              color="default"
              className={classes.button}
              disabled={disabled}
              onClick={() => {
                this.props.resetFilter();
                this.find();
              }}
            >
              <FormattedMessage id="view.shared.action.clear" />
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(DisputeFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

