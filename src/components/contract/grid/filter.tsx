import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Model
import { PageRequest, PageResult, Sorting, ObjectResponse } from 'model/response';
import { EnumMasterContractSortField, MasterContractHistory, MasterContractQuery } from 'model/contract';

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

  constructor(props: ContractFiltersProps) {
    super(props);

    this.clear = this.clear.bind(this);
    this.search = this.search.bind(this);
    this.create = this.create.bind(this);
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
          <Grid item sm={4} xs={12}>
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

          <Grid container item sm={8} xs={12} justifyContent={'flex-end'}>
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

