import React from 'react';

// Localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// Icons
import Icon from '@mdi/react';
import { mdiCommentAlertOutline } from '@mdi/js';

// Model
import { PageRequest, PageResult, Sorting } from 'model/response';
import {
  EnumProcessInstanceHistorySortField,
  ProcessDefinition,
  ProcessInstance,
  ProcessInstanceQuery,
} from 'model/bpm-process-instance';

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
  formControl: {
    minWidth: 240,
  },
});

interface WorkflowInstanceProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  query: ProcessInstanceQuery,
  setFilter: (query: Partial<ProcessInstanceQuery>) => void,
  resetFilter: () => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceHistorySortField>[]
  ) => Promise<PageResult<ProcessInstance> | null>,
  disabled: boolean,
  processDefinitions: ProcessDefinition[],
}

class ProcessInstanceFilters extends React.Component<WorkflowInstanceProps> {

  constructor(props: WorkflowInstanceProps) {
    super(props);

    this.clear = this.clear.bind(this);
    this.search = this.search.bind(this);
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

  search(e: React.FormEvent | null = null): void {
    e?.preventDefault();

    this.find();
  }

  render() {
    const { classes, disabled, query, setFilter, processDefinitions } = this.props;

    return (
      <form onSubmit={this.search} noValidate autoComplete="off">
        <Grid container spacing={3} justifyContent={'space-between'}>
          <Grid item md={4} xs={12}>
            <TextField
              id="businessKey"
              label="Business Key"
              value={query.businessKey}
              fullWidth
              onChange={
                (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => setFilter({ businessKey: event.target.value })
              }
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id="processDefinitionKey-label">Process Definition</InputLabel>
              <Select
                labelId="processDefinitionKey-label"
                id="processDefinitionKey"
                value={query.processDefinitionKey}
                onChange={
                  (event: React.ChangeEvent<{ value: unknown }>): void => setFilter({ processDefinitionKey: event.target.value as string })
                }
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {processDefinitions.map((def) => (
                  <MenuItem key={def.key} value={def.key}>{def.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid container item md={4} xs={12} justifyContent={'flex-end'}>
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
const styledComponent = withStyles(styles)(ProcessInstanceFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

