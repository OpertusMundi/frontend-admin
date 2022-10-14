import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Model
import { PageRequest, PageResult, Sorting, ObjectResponse } from 'model/response';
import {
  EnumContractStatus,
  EnumMasterContractSortField,
  MasterContractHistory,
  MasterContractQuery,
} from 'model/contract';

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
  },
});

interface ContractFiltersProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  query: MasterContractQuery,
  setFilter: (query: Partial<MasterContractQuery>) => void,
  resetFilter: () => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumMasterContractSortField>[]
  ) => Promise<ObjectResponse<PageResult<MasterContractHistory>> | null>,
  create: () => void,
  disabled: boolean,
}

class ContractFilters extends React.Component<ContractFiltersProps> {

  statusOptions: { value: EnumContractStatus, label: string }[];

  constructor(props: ContractFiltersProps) {
    super(props);

    this.clear = this.clear.bind(this);
    this.search = this.search.bind(this);
    this.create = this.create.bind(this);

    this.statusOptions = [{
      value: EnumContractStatus.DRAFT, label: 'Draft'
    }, {
      value: EnumContractStatus.ACTIVE, label: 'Active'
    }, {
      value: EnumContractStatus.INACTIVE, label: 'Inactive'
    }];
  }

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

  create(): void {
    this.props.create();
  }

  render() {
    const { classes, disabled, query, setFilter } = this.props;
    const _t = this.props.intl.formatMessage;

    return (
      <form onSubmit={this.search} noValidate autoComplete="off">
        <Grid container spacing={3} justifyContent={'space-between'}>
          <Grid item sm={2} xs={12}>
            <TextField
              id="name"
              label={_t({ id: 'contract.filter.title' })}
              variant="standard"
              margin="normal"
              className={classes.textField}
              value={query.title || ''}
              onChange={e => setFilter({ title: e.target.value })}
            />
          </Grid>

          <Grid item sm={5} xs={12} style={{ marginTop: 9 }}>
            <Autocomplete
              multiple
              options={this.statusOptions}
              getOptionLabel={(option) => option.label}
              value={this.statusOptions.filter(o => query.status.includes(o.value)) || null}
              onChange={(event, value) => {
                setFilter({ status: value.map(v => v.value) });
                this.find();
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={_t({ id: 'contract.filter.status' })}
                />
              )}
            />
          </Grid>

          <Grid item sm={2} xs={12} style={{ alignSelf: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="defaultContract"
                  checked={query.defaultContract === true}
                  indeterminate={query.defaultContract === null}
                  onChange={e => {
                    setFilter({ defaultContract: query.defaultContract === false ? null : e.target.checked });
                    this.find();
                  }}
                  color="primary"
                />
              }
              label={_t({ id: 'contract.filter.default-contract' })}
            />
          </Grid>

          <Grid container item sm={3} xs={12} justifyContent={'flex-end'}>
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
              type="submit"
              variant="contained"
              className={classes.button}
              onClick={this.create}
              disabled={disabled}
            >
              <FormattedMessage id="view.shared.action.create" />
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
const styledComponent = withStyles(styles)(ContractFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

