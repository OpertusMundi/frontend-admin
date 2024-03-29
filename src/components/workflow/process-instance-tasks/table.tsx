import React from 'react';

import { injectIntl, IntlShape, FormattedMessage } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiAccountWrenchOutline,
  mdiContentCopy,
  mdiDatabaseCogOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import { EnumProcessInstanceTaskSortField, ProcessInstanceTask, ProcessInstanceTaskQuery, SET_ERROR_TASKS } from 'model/bpm-process-instance';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyBusinessKey = 'copy-business-key',
  View = 'view',
};

function workflowColumns(intl: IntlShape, props: ProcessInstanceTableProps): Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>[] {
  const { classes } = props;

  return (
    [{
      header: intl.formatMessage({ id: 'workflow.header.task.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>,
        row: ProcessInstanceTask,
        handleAction?: cellActionHandler<ProcessInstanceTask, EnumProcessInstanceTaskSortField>
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
          {SET_ERROR_TASKS.includes(row.taskName) &&
            <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.instance.view-task' })}>
              <i
                onClick={() => {
                  props.viewProcessInstanceTask(row.processInstanceId, row.taskName);
                }}
              >
                <Badge overlap="rectangular" color="secondary" variant="dot" invisible={true}>
                  <Icon path={mdiAccountWrenchOutline} className={classes.rowIconAction} />
                </Badge>
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.task.process-definition-name' }),
      id: 'processDefinitionName',
      width: 250,
      sortable: true,
      sortColumn: EnumProcessInstanceTaskSortField.PROCESS_DEFINITION,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.task.process-definition-version' }),
      id: 'processDefinitionVersion',
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>,
        row: ProcessInstanceTask,
        handleAction?: cellActionHandler<ProcessInstanceTask, EnumProcessInstanceTaskSortField>
      ): React.ReactNode => (
        <span>{row.processDefinitionVersionTag} / {row.processDefinitionVersion}</span>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.task.task-name' }),
      id: 'taskName',
      width: 250,
      sortable: true,
      sortColumn: EnumProcessInstanceTaskSortField.TASK_NAME,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>,
        row: ProcessInstanceTask,
        handleAction?: cellActionHandler<ProcessInstanceTask, EnumProcessInstanceTaskSortField>
      ): React.ReactNode => (
        <FormattedMessage id={`workflow.tasks.${row.taskName}`} />
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.task.process-definition-deployed-on' }),
      id: 'processDefinitionDeployedOn',
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>,
        row: ProcessInstanceTask,
        handleAction?: cellActionHandler<ProcessInstanceTask, EnumProcessInstanceTaskSortField>
      ): React.ReactNode => (
        <DateTime value={row.processDefinitionDeployedOn.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.task.business-key' }),
      id: 'businessKey',
      accessor: 'businessKey',
      sortable: true,
      sortColumn: EnumProcessInstanceTaskSortField.BUSINESS_KEY,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>,
        row: ProcessInstanceTask,
        handleAction?: cellActionHandler<ProcessInstanceTask, EnumProcessInstanceTaskSortField>
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
      header: intl.formatMessage({ id: 'workflow.header.task.started-on' }),
      id: 'startedOn',
      sortable: true,
      sortColumn: EnumProcessInstanceTaskSortField.STARTED_ON,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>,
        row: ProcessInstanceTask,
        handleAction?: cellActionHandler<ProcessInstanceTask, EnumProcessInstanceTaskSortField>
      ): React.ReactNode => (
        <DateTime value={row.startedOn.toDate()} day='numeric' month='numeric' year='numeric' />
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
  query: ProcessInstanceTaskQuery,
  result: PageResult<ProcessInstanceTask> | null,
  pagination: PageRequest,
  selected: ProcessInstanceTask[],
  sorting: Sorting<EnumProcessInstanceTaskSortField>[];
  loading?: boolean;
  addToSelection: (rows: ProcessInstanceTask[]) => void,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceTaskSortField>[]
  ) => Promise<PageResult<ProcessInstanceTask> | null>,
  removeFromSelection: (rows: ProcessInstanceTask[]) => void,
  resetSelection: () => void;
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumProcessInstanceTaskSortField>[]) => void,
  viewProcessInstance: (processInstance: string) => void;
  viewProcessInstanceTask: (processInstance: string, taskName: string) => void;
}

class ProcessInstanceTable extends React.Component<ProcessInstanceTableProps> {

  constructor(props: ProcessInstanceTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<ProcessInstanceTask, EnumProcessInstanceTaskSortField>, row: ProcessInstanceTask): void {
    switch (action) {
      case EnumAction.CopyBusinessKey:
        const value = row.businessKey;

        copyToClipboard(value);
        break;

      case EnumAction.View:
        this.props.viewProcessInstance(row.processInstanceId);
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
        <MaterialTable<ProcessInstanceTask, EnumProcessInstanceTaskSortField>
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