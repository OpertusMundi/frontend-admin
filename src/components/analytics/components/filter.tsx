import moment from 'utils/moment-localized';

import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

// Handle Moment dates for material UI pickers
import DateFnsUtils from '@date-io/moment';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Model
import { ObjectResponse } from 'model/response';
import { EnumTopicCategory } from 'model/catalogue';
import { SalesQuery, DataSeries, EnumTemporalUnit } from 'model/analytics';

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
  item: {
    padding: theme.spacing(1),
  },
});

interface QueryEditorFiltersProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  query: SalesQuery,
  setFilter: (query: Partial<SalesQuery>) => void,
  resetFilter: () => void,
  executeQuery?: () => Promise<ObjectResponse<DataSeries> | null>,
  disabled: boolean,
}

class QueryEditorFilters extends React.Component<QueryEditorFiltersProps> {

  private segments: { value: EnumTopicCategory, label: string }[];
  private countries: { value: string, label: string }[] = [
    { label: 'Austria', value: 'AT' },
    { label: 'Belgium', value: 'BE' },
    { label: 'Bulgaria', value: 'BG' },
    { label: 'Croatia', value: 'HR' },
    { label: 'Cyprus', value: 'CY' },
    { label: 'Czech Republic', value: 'CZ' },
    { label: 'Denmark', value: 'DK' },
    { label: 'Estonia', value: 'EE' },
    { label: 'Finland', value: 'FI' },
    { label: 'France', value: 'FR' },
    { label: 'Germany', value: 'DE' },
    { label: 'Greece', value: 'GR' },
    { label: 'Hungary', value: 'HU' },
    { label: 'Ireland, Republic of (EIRE)', value: 'IE' },
    { label: 'Italy', value: 'IT' },
    { label: 'Latvia', value: 'LV' },
    { label: 'Lithuania', value: 'LT' },
    { label: 'Luxembourg', value: 'LU' },
    { label: 'Malta', value: 'MT' },
    { label: 'Netherlands', value: 'NL' },
    { label: 'Poland', value: 'PL' },
    { label: 'Portugal', value: 'PT' },
    { label: 'Romania', value: 'RO' },
    { label: 'Slovakia', value: 'SK' },
    { label: 'Slovenia', value: 'SI' },
    { label: 'Spain', value: 'ES' },
    { label: 'Sweden', value: 'SE' },
    { label: 'United Kingdom', value: 'UK' },
  ];

  constructor(props: QueryEditorFiltersProps) {
    super(props);

    const _fm = props.intl.formatMessage;

    this.clear = this.clear.bind(this);
    this.executeQuery = this.executeQuery.bind(this);

    this.segments = [];
    for (const value in EnumTopicCategory) {
      this.segments.push({ value: value as EnumTopicCategory, label: _fm({ id: `enum.category-topic.${value}` }) });
    }
  }

  executeQuery(e?: React.FormEvent): void {
    if (e) {
      e.preventDefault();
    }

    const { executeQuery = null } = this.props;

    if (executeQuery) {
      executeQuery().then((result) => {
        if (!result) {
          message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
        }
      });
    }
  }

  clear(): void {
    this.props.resetFilter();
    this.executeQuery();
  }

  render() {
    const _t = this.props.intl.formatMessage;
    const { setFilter, classes, disabled, query, executeQuery = null } = this.props;

    return (
      <form onSubmit={this.executeQuery} noValidate autoComplete="off">
        <MuiPickersUtilsProvider libInstance={moment} utils={DateFnsUtils}>
          <Grid container spacing={3} justifyContent={'space-between'} alignItems={'flex-end'}>
            <Grid item sm={2} xs={12} className={classes.item}>
              <InputLabel htmlFor="groupBySegment">Group By Segment</InputLabel>
              <Switch
                checked={query.segments?.enabled || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                  setFilter(
                    { segments: { enabled: checked, segments: query.segments?.segments || [] } }
                  );
                }}
                name="groupBySegment"
                color="primary"
              />
            </Grid>
            <Grid item sm={4} xs={12} className={classes.item}>
              <Autocomplete
                fullWidth
                style={{ marginTop: 16 }}
                multiple
                options={this.segments}
                getOptionLabel={(option) => option.label}
                value={this.segments.filter(o => query.segments!.segments!.includes(o.value)) || null}
                onChange={(event, value) => {
                  setFilter({ segments: { enabled: query.segments?.enabled || false, segments: value.map(v => v.value) } });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={_t({ id: 'analytics.filter.segments' })}
                  />
                )}
              />
            </Grid>
            <Grid item sm={2} xs={12} className={classes.item}>
              <InputLabel htmlFor="groupByCountry">Group By Country</InputLabel>
              <Switch
                checked={query.areas?.enabled || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                  setFilter(
                    { areas: { enabled: checked, codes: query.areas?.codes || [] } }
                  );
                }}
                name="groupByCountry"
                color="primary"
              />
            </Grid>
            <Grid item sm={4} xs={12} className={classes.item}>
              <Autocomplete
                fullWidth
                style={{ marginTop: 16 }}
                multiple
                options={this.countries}
                getOptionLabel={(option) => option.label}
                value={this.countries.filter(o => query.areas!.codes!.includes(o.value)) || null}
                onChange={(event, value) => {
                  setFilter({ areas: { enabled: query.areas?.enabled || false, codes: value.map(v => v.value) } });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={_t({ id: 'analytics.filter.countries' })}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} justifyContent={'space-between'} alignItems={'flex-end'}>
            <Grid item sm={6} xs={12} className={classes.item}>
              <RadioGroup
                row name="timeUnit"
                value={query?.time?.unit ? query.time!.unit! as string : ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string): void => {
                  if (value) {
                    setFilter({ time: { ...query.time, unit: value as EnumTemporalUnit } });
                  } else {
                    setFilter({ time: { ...query.time, unit: undefined } });
                  }
                }}
              >
                <FormControlLabel
                  value=""
                  control={<Radio color="primary" />}
                  label="None"
                />
                <FormControlLabel
                  value={EnumTemporalUnit.YEAR as string}
                  control={<Radio color="primary" />}
                  label="Year"
                />
                <FormControlLabel
                  value={EnumTemporalUnit.MONTH as string}
                  control={<Radio color="primary" />}
                  label="Month"
                />
                <FormControlLabel
                  value={EnumTemporalUnit.WEEK as string}
                  control={<Radio color="primary" />}
                  label="Week"
                />
                <FormControlLabel
                  value={EnumTemporalUnit.DAY as string}
                  control={<Radio color="primary" />}
                  label="Day"
                />
              </RadioGroup>
            </Grid>
            {query?.time?.unit &&
              <>
                <Grid item sm={3} xs={12} className={classes.item}>
                  <DatePicker
                    clearable
                    id="time-min"
                    label="Date From"
                    format={'DD/MM/YYYY'}
                    value={query.time?.min || null}
                    onChange={(date: MaterialUiPickersDate): void => {
                      if (date) {
                        setFilter({ time: { ...query.time, min: date } });
                      } else {
                        setFilter({ time: { ...query.time, min: undefined } });
                      }
                    }}
                  />
                </Grid>
                <Grid item sm={3} xs={12} className={classes.item}>
                  <DatePicker
                    clearable
                    id="time-max"
                    label="Date To"
                    format={'DD/MM/YYYY'}
                    value={query.time?.max || null}
                    onChange={(date: MaterialUiPickersDate): void => {
                      if (date) {
                        setFilter({ time: { ...query.time, max: date } });
                      } else {
                        setFilter({ time: { ...query.time, max: undefined } });
                      }
                    }}
                  />
                </Grid>
              </>
            }
          </Grid>
          {executeQuery &&
            <Grid container item xs={12} justifyContent={'flex-end'}>
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
          }
        </MuiPickersUtilsProvider>
      </form>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(QueryEditorFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

