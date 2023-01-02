import React from 'react';

import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiContentCopy,
  mdiDatabaseCogOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import { EnumProcessInstanceHistorySortField, ProcessInstance, ProcessInstanceQuery } from 'model/bpm-process-instance';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyBusinessKey = 'copy-business-key',
  View = 'view',
};

function workflowColumns(props: ProcessInstanceTableProps): Column<ProcessInstance, EnumProcessInstanceHistorySortField>[] {
  const { classes, intl } = props;
  return (
    [{
      header: intl.formatMessage({ id: 'workflow.header.instance.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceHistorySortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceHistorySortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={intl.formatMessage({ id: 'workflow.tooltip.instance.view' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.View, rowIndex, column, row) : null}
            >
              <Icon path={mdiDatabaseCogOutline} className={classes.rowIconAction} />
            </i>
          </Tooltip>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-name' }),
      id: 'processDefinitionName',
      width: 250,
      sortable: true,
      sortColumn: EnumProcessInstanceHistorySortField.PROCESS_DEFINITION,
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-version' }),
      id: 'processDefinitionVersion',
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceHistorySortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceHistorySortField>
      ): React.ReactNode => (
        <span>{row.processDefinitionVersionTag} / {row.processDefinitionVersion}</span>
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.process-definition-deployed-on' }),
      id: 'processDefinitionDeployedOn',
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceHistorySortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceHistorySortField>
      ): React.ReactNode => (
        <DateTime value={row.processDefinitionDeployedOn.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.business-key' }),
      id: 'businessKey',
      accessor: 'businessKey',
      sortable: true,
      sortColumn: EnumProcessInstanceHistorySortField.BUSINESS_KEY,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceHistorySortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceHistorySortField>
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
      sortColumn: EnumProcessInstanceHistorySortField.STARTED_ON,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceHistorySortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceHistorySortField>
      ): React.ReactNode => (
        <DateTime value={row.startedOn.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'workflow.header.instance.completed-on' }),
      id: 'completedOn',
      sortable: true,
      sortColumn: EnumProcessInstanceHistorySortField.COMPLETED_ON,
      cell: (
        rowIndex: number,
        column: Column<ProcessInstance, EnumProcessInstanceHistorySortField>,
        row: ProcessInstance,
        handleAction?: cellActionHandler<ProcessInstance, EnumProcessInstanceHistorySortField>
      ): React.ReactNode => (
        row.completedOn ?
          <DateTime value={row.completedOn?.toDate()} day='numeric' month='numeric' year='numeric' />
          :
          null
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
    marginRight: 8,
    cursor: 'pointer',
  },
  rowIconAction: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
});

interface ProcessInstanceTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumProcessInstanceHistorySortField>[]
  ) => Promise<PageResult<ProcessInstance> | null>,
  query: ProcessInstanceQuery,
  result: PageResult<ProcessInstance> | null,
  pagination: PageRequest,
  selected: ProcessInstance[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumProcessInstanceHistorySortField>[]) => void,
  addToSelection: (rows: ProcessInstance[]) => void,
  removeFromSelection: (rows: ProcessInstance[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumProcessInstanceHistorySortField>[];
  viewProcessInstance: (processInstance: string, completed: boolean) => void;
  loading?: boolean;
}

class ProcessInstanceTable extends React.Component<ProcessInstanceTableProps> {

  constructor(props: ProcessInstanceTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<ProcessInstance, EnumProcessInstanceHistorySortField>, row: ProcessInstance): void {
    switch (action) {
      case EnumAction.CopyBusinessKey:
        const value = row.businessKey;

        copyToClipboard(value);
        break;

      case EnumAction.View:
        this.props.viewProcessInstance(row.processInstanceId, row.completedOn !== null);
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
        <MaterialTable<ProcessInstance, EnumProcessInstanceHistorySortField>
          intl={intl}
          columns={workflowColumns(this.props)}
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