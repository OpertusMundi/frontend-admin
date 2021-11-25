import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Model
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumEventSortField, EnumEventLevel, Event, EventQuery, ApplicationDeploymentNames } from 'model/event';

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

interface EventFiltersProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  query: Partial<EventQuery>,
  setFilter: (query: Partial<EventQuery>) => void,
  resetFilter: () => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumEventSortField>[]
  ) => Promise<PageResult<Event> | null>,
  disabled: boolean,
}

class EventFilters extends React.Component<EventFiltersProps> {

  constructor(props: EventFiltersProps) {
    super(props);

    const _t = props.intl.formatMessage;

    this.clear = this.clear.bind(this);
    this.search = this.search.bind(this);

    this.applicationOptions = [];
    this.levelOptions = [];

    ApplicationDeploymentNames.forEach((value: string) => {
      this.applicationOptions.push({ value, label: _t({ id: `event.application.${value}` }) });
    });
    for (const value in EnumEventLevel) {
      this.levelOptions.push({ value: value as EnumEventLevel, label: _t({ id: `event.level.${value}` }) });
    }
  }

  applicationOptions: { value: string, label: string }[];
  levelOptions: { value: EnumEventLevel, label: string }[];

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

  search(e: React.FormEvent | null = null): void {
    e?.preventDefault();

    this.find();
  }

  render() {
    const _t = this.props.intl.formatMessage;
    const { classes, disabled, query, setFilter } = this.props;

    return (
      <form onSubmit={this.search} noValidate autoComplete="off">
        <Grid container spacing={3} justifyContent={'space-between'} alignItems={'flex-end'}>
          {/* <Grid item md={3} xs={12}>
            <TextField
              label={_t({ id: 'event.filter.user' })}
              value={query.userNames}
              fullWidth
              onChange={
                (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => setFilter({ userNames: [event.target.value] })
              }
            />
          </Grid> */}
          <Grid item sm={6} xs={12}>
            <Autocomplete
              multiple
              options={this.applicationOptions}
              getOptionLabel={(option) => option.label}
              value={this.applicationOptions.filter(o => query.applications ? query.applications.includes(o.value) : null) || null}
              onChange={(event, value) => {
                setFilter({ applications: value.map(v => v.value) });
                this.search();
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={_t({ id: 'event.filter.applications' })}
                />
              )}
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <Autocomplete
              multiple
              options={this.levelOptions}
              getOptionLabel={(option) => option.label}
              value={this.levelOptions.filter(o => query.levels ? query.levels.includes(o.value) : null) || null}
              onChange={(event, value) => {
                setFilter({ levels: value.map(v => v.value) });
                this.search();
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={_t({ id: 'event.filter.levels' })}
                />
              )}
            />
          </Grid>
          <Grid container item md={3} xs={12} justifyContent={'flex-end'}>
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
                this.search();
              }}
            >
              <FormattedMessage id="view.shared.action.reset" />
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(EventFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

