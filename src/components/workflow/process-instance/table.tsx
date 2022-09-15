import React from 'react';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiAccountAlertOutline,
  mdiContentCopy,
  mdiDatabaseCogOutline,
  mdiDeleteAlertOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import { ProcessInstanceHeader } from 'components/workflow/common';

import {
  SET_ERROR_TASKS,
  EnumProcessInstanceSortField,
  ProcessInstance,
  ProcessInstanceQuery,
} from 'model/bpm-process-instance';

import { PageRequest, PageResult, Sorting } from 'model/response';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyBusinessKey = 'copy-business-key',
  Delete = 'delete',
  View = 'view',
};

function workflowColumns(intl: IntlShape, props: ProcessInstanceTableProps): Column<ProcessInstance, EnumProcessInstanceSortField>[] {
  const { classes } = props;

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
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.instance.view' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.View, rowIndex, column, row) : null}
            >
              <Badge overlap="rectangular" color="secondary" variant="dot" invisible={row.incidentCount === 0}>
                <Icon path={mdiDatabaseCogOutline} className={classes.rowIconActionWithBadge} />
              </Badge>
            </i>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.instance.delete' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.Delete, rowIndex, column, row) : null}
            >
              <Badge overlap="rectangular" color="secondary" variant="dot" invisible={true}>
                <Icon path={mdiDeleteAlertOutline} className={classes.rowIconAction} />
              </Badge>
            </i>
          </Tooltip>
          {row.taskNames.length === 1 && row.taskNames.some(t => SET_ERROR_TASKS.includes(t)) &&
            <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.instance.view-task' })}>
              <i
                onClick={() => {
                  props.viewProcessInstanceTask(row.processInstanceId, row.taskNames[0]);
                }}
              >
                <Badge overlap="rectangular" color="secondary" variant="dot" invisible={true}>
                  <Icon path={mdiAccountAlertOutline} className={classes.rowIconAction} />
                </Badge>
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-name' }),
      id: 'processDefinitionName',
      width: 350,
      sortable: true,
      sortColumn: EnumProcessInstanceSortField.PROCESS_DEFINITION,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceSortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceSortField>
      ): React.ReactNode => (
        <ProcessInstanceHeader instance={row} />
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-version' }),
      id: 'processDefinitionVersion',
      width: 110,
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceSortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceSortField>
      ): React.ReactNode => (
        <span>{row.processDefinitionVersionTag} / {row.processDefinitionVersion}</span>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-deployed-on' }),
      id: 'processDefinitionDeployedOn',
      width: 130,
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
      header: intl.formatMessage({ id: 'workflow.header.instance.task-count' }),
      id: 'taskCount',
      accessor: 'taskCount',
      sortable: true,
      sortColumn: EnumProcessInstanceSortField.TASK_COUNT,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.business-key' }),
      id: 'businessKey',
      accessor: 'businessKey',
      sortable: true,
      sortColumn: EnumProcessInstanceSortField.BUSINESS_KEY,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceSortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabel}>
          <div>{row.businessKey}</div>
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyBusinessKey, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.rowIconAction} />
          </i>
        </div>
      ),
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
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowIcon: {
    width: 18,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
  },
  rowIconAction: {
    width: 18,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
  },
  rowIconActionWithBadge: {
    width: 18,
    marginRight: theme.spacing(2),
    cursor: 'pointer',
  }
});

interface ProcessInstanceTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  loading?: boolean;
  pagination: PageRequest,
  query: ProcessInstanceQuery,
  result: PageResult<ProcessInstance> | null,
  selected: ProcessInstance[],
  sorting: Sorting<EnumProcessInstanceSortField>[];
  addToSelection: (rows: ProcessInstance[]) => void,
  deleteInstance: (processInstance: ProcessInstance) => void;
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceSortField>[]
  ) => Promise<PageResult<ProcessInstance> | null>,
  removeFromSelection: (rows: ProcessInstance[]) => void,
  resetSelection: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumProcessInstanceSortField>[]) => void,
  viewProcessInstance: (processInstance: string) => void;
  viewProcessInstanceTask: (processInstance: string, taskName: string) => void;
}

class ProcessInstanceTable extends React.Component<ProcessInstanceTableProps> {

  constructor(props: ProcessInstanceTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<ProcessInstance, EnumProcessInstanceSortField>, row: ProcessInstance): void {
    switch (action) {
      case EnumAction.CopyBusinessKey:
        const value = row.businessKey;

        copyToClipboard(value);
        break;

      case EnumAction.View:
        this.props.viewProcessInstance(row.processInstanceId);
        break;

      case EnumAction.Delete:
        this.props.deleteInstance(row);
        break;

      default:
        // No action
        break;
    }
  }

  render() {
    const { intl, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <>
        <MaterialTable<ProcessInstance, EnumProcessInstanceSortField>
          intl={intl}
          columns={workflowColumns(intl, this.props)}
          rows={result ? result.items : []}
          pagination={{
            rowsPerPageOptions: [10, 20, 50],
            count: result ? result.count : 0,
            size: result ? result.pageRequest.size : 20,
            page: result ? result.pageRequest.page : 0,
          }}
          handleAction={this.handleAction}
          handlePageChange={(index: number) => {
            setPager(index, pagination.size);

            find();
          }}
          handleRowsPerPageChange={(size: number) => {
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
const styledComponent = withStyles(styles)(ProcessInstanceTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;