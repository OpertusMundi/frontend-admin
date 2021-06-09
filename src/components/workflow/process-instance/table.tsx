import React from 'react';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiDatabaseCogOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

import { EnumProcessInstanceSortField, ProcessInstance, ProcessInstanceQuery } from 'model/workflow';
import { PageRequest, PageResult, Sorting } from 'model/response';

enum EnumAction {
  View = 'view',
};

function workflowColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<ProcessInstance, EnumProcessInstanceSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'workflow.header.instance.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceSortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.instance.view' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.View, rowIndex, column, row) : null}
            >
              <Badge color="secondary" variant="dot" invisible={row.incidentCount === 0}>
                <Icon path={mdiDatabaseCogOutline} className={classes.classes.rowIcon} />
              </Badge>
            </i>
          </Tooltip>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-name' }),
      id: 'processDefinitionName',
      width: 250,
      sortable: true,
      sortColumn: EnumProcessInstanceSortField.PROCESS_DEFINITION,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-version' }),
      id: 'processDefinitionVersion',
      sortable: false,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-deployed-on' }),
      id: 'processDefinitionDeployedOn',
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceSortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceSortField>
      ): React.ReactNode => (
        <FormattedTime value={row.processDefinitionDeployedOn.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.incident-count' }),
      id: 'incidentCount',
      accessor: 'incidentCount',
      sortable: true,
      sortColumn: EnumProcessInstanceSortField.INCIDENT_COUNT,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.business-key' }),
      id: 'businessKey',
      accessor: 'businessKey',
      sortable: true,
      sortColumn: EnumProcessInstanceSortField.BUSINESS_KEY,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.started-on' }),
      id: 'startedOn',
      sortable: true,
      sortColumn: EnumProcessInstanceSortField.STARTED_ON,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceSortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceSortField>
      ): React.ReactNode => (
        <FormattedTime value={row.startedOn.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  avatarIcon: {
    width: 16,
    color: '#ffffff',
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  link: {
    color: 'inherit',
  }
});

interface FieldTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceSortField>[]
  ) => Promise<PageResult<ProcessInstance> | null>,
  query: ProcessInstanceQuery,
  result: PageResult<ProcessInstance> | null,
  pagination: PageRequest,
  selected: ProcessInstance[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumProcessInstanceSortField>[]) => void,
  addToSelection: (rows: ProcessInstance[]) => void,
  removeFromSelection: (rows: ProcessInstance[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumProcessInstanceSortField>[];
  viewRow: (processInstanceId: string) => void;
  loading?: boolean;
}

class ProcessInstanceTable extends React.Component<FieldTableProps> {

  constructor(props: FieldTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<ProcessInstance, EnumProcessInstanceSortField>, row: ProcessInstance): void {
    switch (action) {
      case EnumAction.View:
        this.props.viewRow(row.processInstanceId);
        break;
      default:
        // No action
        break;
    }
  }

  render() {
    const { intl, classes, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <MaterialTable<ProcessInstance, EnumProcessInstanceSortField>
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
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(ProcessInstanceTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;