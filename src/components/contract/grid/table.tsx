import React from 'react';

import { Link } from 'react-router-dom';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import { mdiPencilOutline, mdiSourceBranchCheck, mdiSourceBranchMinus, mdiSourceBranchPlus, mdiTrashCanOutline, mdiContentCopy } from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

import { buildPath, DynamicRoutes } from 'model/routes';
import {
  EnumContractStatus,
  EnumMasterContractSortField,
  MasterContractHistory,
  MasterContractQuery,
} from 'model/contract';
import { PageRequest, PageResult, Sorting, ObjectResponse } from 'model/response';

enum EnumAction {
  CreateVersion = 'create-version',
  Deactivate = 'deactivate',
  Delete = 'delete',
  Edit = 'edit',
  Publish = 'publish',
  Clone = 'clone'
};

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  link: {
    color: 'inherit',
  },
  roles: {
    display: 'flex',
  },
  role: {
    display: 'flex',
    marginRight: theme.spacing(1),
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
  },
  compositeLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
  },
  labelContractStatus: {
    display: 'flex',
    background: '#0277BD',
    color: '#ffffff',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    minWidth: 80,
    justifyContent: 'center'
  },
});

const statusToBackGround = (status: EnumContractStatus): string => {
  switch (status) {
    case EnumContractStatus.ACTIVE:
      return '#2E7D32';
    case EnumContractStatus.INACTIVE:
      return '#f44336';
    case EnumContractStatus.DRAFT:
      return '#616161';
  }
  return '#0277BD';
};

function contractColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<MasterContractHistory, EnumMasterContractSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'contract.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<MasterContractHistory, EnumMasterContractSortField>, row: MasterContractHistory, handleAction?: cellActionHandler<MasterContractHistory, EnumMasterContractSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'start' }}>
          {row.status === EnumContractStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.edit' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Edit, rowIndex, column, row) : null}
              >
                <Icon path={mdiPencilOutline} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status !== EnumContractStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.create-version' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.CreateVersion, rowIndex, column, row) : null}
              >
                <Icon path={mdiSourceBranchPlus} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.delete' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Delete, rowIndex, column, row) : null}
              >
                <Icon path={mdiTrashCanOutline} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.publish' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Publish, rowIndex, column, row) : null}
              >
                <Icon path={mdiSourceBranchCheck} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.ACTIVE &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.deactivate' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Deactivate, rowIndex, column, row) : null}
              >
                <Icon path={mdiSourceBranchMinus} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.ACTIVE &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.clone' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Clone, rowIndex, column, row) : null}
              >
                <Icon path={mdiContentCopy} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'contract.header.status' }),
      headerStyle: { textAlign: 'center' },
      id: 'status',
      sortable: true,
      sortColumn: EnumMasterContractSortField.STATUS,
      width: 120,
      cell: (
        rowIndex: number, column: Column<MasterContractHistory, EnumMasterContractSortField>, row: MasterContractHistory, handleAction?: cellActionHandler<MasterContractHistory, EnumMasterContractSortField>
      ): React.ReactNode => {

        return (
          <div className={classes.classes.compositeLabel}>
            {row?.status &&
              <div
                className={classes.classes.labelContractStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.contract-status.${row.status}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'contract.header.title' }),
      id: 'title',
      width: 150,
      sortable: true,
      sortColumn: EnumMasterContractSortField.TITLE,
      cell: (
        rowIndex: number, column: Column<MasterContractHistory, EnumMasterContractSortField>, row: MasterContractHistory, handleAction?: cellActionHandler<MasterContractHistory, EnumMasterContractSortField>
      ): React.ReactNode => (
        row.status === EnumContractStatus.DRAFT ?
          <Link to={buildPath(DynamicRoutes.ContractUpdate, [row.id + ''])} className={classes.classes.link}>
            {row.title}
          </Link>
          :
          <span>{row.title}</span>
      ),
    }, {
      header: intl.formatMessage({ id: 'contract.header.subtitle' }),
      id: 'subtitle',
      accessor: 'subtitle',
      sortable: false,
    }, {
      header: intl.formatMessage({ id: 'contract.header.version' }),
      id: 'version',
      width: 80,
      accessor: 'version',
      sortable: true,
      sortColumn: EnumMasterContractSortField.VERSION,
    }, {
      header: intl.formatMessage({ id: 'contract.header.user' }),
      id: 'user',
      width: 250,
      accessor: 'owner.email',
      sortable: false,
    }, {
      header: intl.formatMessage({ id: 'contract.header.modified-on' }),
      id: 'modifiedOn',
      width: 180,
      sortable: true,
      sortColumn: EnumMasterContractSortField.MODIFIED_ON,
      cell: (
        rowIndex: number, column: Column<MasterContractHistory, EnumMasterContractSortField>, row: MasterContractHistory, handleAction?: cellActionHandler<MasterContractHistory, EnumMasterContractSortField>
      ): React.ReactNode => (
        <FormattedTime value={row.modifiedAt?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

interface ContractTableProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  addToSelection: (rows: MasterContractHistory[]) => void;
  createDraftFromTemplate: (contract: MasterContractHistory) => void;
  createClonedDraftFromTemplate: (contract: MasterContractHistory) => void;
  deactivateTemplate: (contract: MasterContractHistory) => void;
  deleteDraft: (contract: MasterContractHistory) => void;
  editDraft: (contract: MasterContractHistory) => void;
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumMasterContractSortField>[]
  ) => Promise<ObjectResponse<PageResult<MasterContractHistory>> | null>;
  publishDraft: (contract: MasterContractHistory) => void;
  setPager: (page: number, size: number) => void;
  setSorting: (sorting: Sorting<EnumMasterContractSortField>[]) => void;
  removeFromSelection: (rows: MasterContractHistory[]) => void;
  resetSelection: () => void;
  loading?: boolean;
  pagination: PageRequest;
  query: MasterContractQuery;
  result: PageResult<MasterContractHistory> | null;
  selected: MasterContractHistory[];
  sorting: Sorting<EnumMasterContractSortField>[];
}

class ContractTable extends React.Component<ContractTableProps> {

  constructor(props: ContractTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<MasterContractHistory, EnumMasterContractSortField>, row: MasterContractHistory): void {
    if (row.id) {
      switch (action) {
        case EnumAction.CreateVersion:
          this.props.createDraftFromTemplate(row);
          break;
        case EnumAction.Deactivate:
          this.props.deactivateTemplate(row);
          break;
        case EnumAction.Delete:
          this.props.deleteDraft(row);
          break;
        case EnumAction.Edit:
          this.props.editDraft(row);
          break;
        case EnumAction.Publish:
          this.props.publishDraft(row);
          break;
        case EnumAction.Clone:
          this.props.createClonedDraftFromTemplate(row);
          break;
        default:
          // No action
          break;
      }
    }
  }

  render() {
    const { intl, classes, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <MaterialTable<MasterContractHistory, EnumMasterContractSortField>
        intl={intl}
        columns={contractColumns(intl, { classes })}
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
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(ContractTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;