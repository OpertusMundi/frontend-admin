import React from 'react';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiBugOutline,
  mdiContentCopy,
  mdiDatabaseCogOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

import { EnumIncidentSortField, Incident, IncidentQuery } from 'model/workflow';
import { PageRequest, PageResult, Sorting } from 'model/response';

const COPY = 'copy';

enum EnumAction {
  ProcessInstance = 'process-instance',
  ErrorDetails = 'error-details',
  CopyBusinessKey = 'copy-business-key',
};

function workflowColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<Incident, EnumIncidentSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'workflow.header.incident.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number,
        column: Column<Incident, EnumIncidentSortField>,
        row: Incident,
        handleAction?: cellActionHandler<Incident, EnumIncidentSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.incident.process-instance' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ProcessInstance, rowIndex, column, row) : null}
            >
              <Icon path={mdiDatabaseCogOutline} className={classes.classes.rowIconAction} />
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.incident.error-details' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ErrorDetails, rowIndex, column, row) : null}
            >
              <Icon path={mdiBugOutline} className={classes.classes.rowIconAction} />
            </i>
          </Tooltip>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.incident.process-definition-name' }),
      id: 'processDefinitionName',
      width: 250,
      sortable: true,
      sortColumn: EnumIncidentSortField.PROCESS_DEFINITION,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.incident.process-definition-version' }),
      id: 'processDefinitionVersion',
      sortable: false,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.incident.reported-on' }),
      id: 'incidentDateTime',
      sortable: true,
      sortColumn: EnumIncidentSortField.REPORTED_ON,
      cell: (
        rowIndex: number,
        column: Column<Incident, EnumIncidentSortField>,
        row: Incident,
        handleAction?: cellActionHandler<Incident, EnumIncidentSortField>
      ): React.ReactNode => (
        <FormattedTime value={row.incidentDateTime.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.incident.business-key' }),
      id: 'businessKey',
      accessor: 'businessKey',
      sortable: true,
      sortColumn: EnumIncidentSortField.BUSINESS_KEY,
      cell: (
        rowIndex: number,
        column: Column<Incident, EnumIncidentSortField>,
        row: Incident,
        handleAction?: cellActionHandler<Incident, EnumIncidentSortField>
      ): React.ReactNode => (
        <div className={classes.classes.compositeLabel}>
          <div>{row.businessKey}</div>
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyBusinessKey, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.classes.rowIconAction} />
          </i>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.incident.task-name' }),
      id: 'taskName',
      accessor: 'taskName',
      sortable: true,
      sortColumn: EnumIncidentSortField.TASK_NAME,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.incident.error-message' }),
      id: 'taskErrorMessage',
      accessor: 'taskErrorMessage',
      sortable: false
    }]);
}

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  rowIconAction: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
});

interface FieldTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumIncidentSortField>[]
  ) => Promise<PageResult<Incident> | null>,
  query: IncidentQuery,
  result: PageResult<Incident> | null,
  pagination: PageRequest,
  selected: Incident[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumIncidentSortField>[]) => void,
  addToSelection: (rows: Incident[]) => void,
  removeFromSelection: (rows: Incident[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumIncidentSortField>[];
  viewRow: (processInstanceId: string) => void;
  loading?: boolean;
}

class IncidentTable extends React.Component<FieldTableProps> {

  constructor(props: FieldTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<Incident, EnumIncidentSortField>, row: Incident): void {
    switch (action) {
      case EnumAction.CopyBusinessKey:
        const element: HTMLInputElement = document.getElementById('copy-to-clipboard') as HTMLInputElement;

        if (element && document.queryCommandSupported(COPY)) {
          console.log(COPY);
          element.focus();
          element.value = row.businessKey;
          element.select();
          document.execCommand(COPY);
        }
        break;
      default:
        // No action
        break;
    }
  }

  render() {
    const { intl, classes, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <>
        <MaterialTable<Incident, EnumIncidentSortField>
          intl={intl}
          columns={workflowColumns(intl, { classes })}
          rows={result ? result.items : []}
          pagination={{
            rowsPerPageOptions: [10, 20, 50],
            count: result ? result.count : 0,
            size: result ? result.pageRequest.size : 20,
            page: result ? result.pageRequest.page : 0,
          }}
          handleAction={this.handleAction}
          handleChangePage={(index: number) => {
            setPager(index, pagination.size);

            find();
          }}
          handleChangeRowsPerPage={(size: number) => {
            setPager(0, size);

            this.props.find();
          }}
          selected={selected}
          sorting={sorting}
          setSorting={setSorting}
          loading={loading}
        />
        <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
      </>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(IncidentTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;