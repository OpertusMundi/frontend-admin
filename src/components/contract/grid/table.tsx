import React from 'react';

import { Link } from 'react-router-dom';

import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Icon from '@mdi/react';
import { mdiPencilOutline, mdiSourceBranchCheck, mdiSourceBranchRemove, mdiSourceBranchPlus, mdiTrashCanOutline, mdiContentCopy, mdiDownload, mdiPinOutline } from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import { buildPath, DynamicRoutes } from 'model/routes';
import {
  EnumContractStatus,
  EnumMasterContractSortField,
  MasterContractHistory,
  MasterContractHistoryResult,
  MasterContractQuery,
} from 'model/contract';
import { PageRequest, PageResult, Sorting, ObjectResponse } from 'model/response';

enum EnumAction {
  Clone = 'clone',
  CreateVersion = 'create-version',
  Deactivate = 'deactivate',
  Delete = 'delete',
  Download = 'download',
  Edit = 'edit',
  Publish = 'publish',
  SetDefault = 'set-default',
};

const styles = (theme: Theme) => createStyles({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  inline: {
    display: 'inline',
    marginRight: theme.spacing(2),
  },
  rowIcon: {
    width: 18,
    marginRight: 8,
    cursor: 'pointer',
  },
  rowIconInactive: {
    opacity: 0.5,
  },
  link: {
    color: 'inherit',
  },
  mr12: {
    marginRight: theme.spacing(1.5),
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

function contractColumns(props: ContractTableProps): Column<MasterContractHistory, EnumMasterContractSortField>[] {
  const { intl, classes, result } = props;
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
                <Icon path={mdiPencilOutline} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status !== EnumContractStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.create-version' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.CreateVersion, rowIndex, column, row) : null}
              >
                <Icon path={mdiSourceBranchPlus} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.delete' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Delete, rowIndex, column, row) : null}
              >
                <Icon path={mdiTrashCanOutline} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.publish' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Publish, rowIndex, column, row) : null}
              >
                <Icon path={mdiSourceBranchCheck} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.ACTIVE &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.deactivate' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Deactivate, rowIndex, column, row) : null}
              >
                <Icon path={mdiSourceBranchRemove} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.ACTIVE &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.clone' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Clone, rowIndex, column, row) : null}
              >
                <Icon path={mdiContentCopy} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.ACTIVE &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.download' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.Download, rowIndex, column, row) : null}
              >
                <Icon path={mdiDownload} className={classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumContractStatus.ACTIVE && !row.defaultContract && result &&
            <Tooltip title={intl.formatMessage({ id: 'contract.tooltip.set-default' })}>
              <i
                onClick={() => handleAction && !result.operationPending
                  ? handleAction(EnumAction.SetDefault, rowIndex, column, row)
                  : null
                }
              >
                <Icon path={mdiPinOutline} className={result.operationPending ? classes.rowIconInactive : classes.rowIcon} />
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
          <div className={classes.compositeLabel}>
            {row?.status &&
              <div
                className={classes.labelContractStatus}
                style={{ background: statusToBackGround(row.status) }}
              >
                {intl.formatMessage({ id: `enum.contract-status.${row.status}` })}
              </div>
            }
          </div>
        )
      },
    }, {
      header: intl.formatMessage({ id: 'contract.header.provider' }),
      id: 'provider',
      sortable: false,
      width: 300,
      cell: (
        rowIndex: number, column: Column<MasterContractHistory, EnumMasterContractSortField>, row: MasterContractHistory, handleAction?: cellActionHandler<MasterContractHistory, EnumMasterContractSortField>
      ): React.ReactNode => {
        const provider = row.provider;
        if (!provider) {
          return null;
        }
        const avatar = provider.logoImage && provider.logoImageMimeType
          ? `data:${provider.logoImageMimeType};base64,${provider.logoImage}`
          : '';

        return (
          <Grid container>
            <Grid item xs={2}>
              <Avatar alt={provider.name} src={avatar} variant="circular" className={classes.avatar} />
            </Grid>
            <Grid container item xs={10} direction={'column'}>
              <Typography className={classes.inline}>{provider.name}</Typography>
              <Typography className={classes.inline} variant="caption">{provider.email}</Typography>
            </Grid>
          </Grid>
        );
      },
    }, {
      header: intl.formatMessage({ id: 'contract.header.title' }),
      id: 'title',
      sortable: true,
      sortColumn: EnumMasterContractSortField.TITLE,
      cell: (
        rowIndex: number, column: Column<MasterContractHistory, EnumMasterContractSortField>, row: MasterContractHistory, handleAction?: cellActionHandler<MasterContractHistory, EnumMasterContractSortField>
      ): React.ReactNode => (
        row.status === EnumContractStatus.DRAFT ?
          <>
            <>
              {row.defaultContract &&
                <Chip
                  label={'Default'}
                  className={classes.mr12}
                />
              }
            </>
            <Link to={buildPath(DynamicRoutes.ContractUpdate, [row.id + ''])} className={classes.link}>
              {row.title}
            </Link>
          </>
          :
          <>
            {row.defaultContract &&
              <Chip
                label={'Default'}
                color={row.status === EnumContractStatus.ACTIVE ? 'primary' : 'secondary'}
                className={classes.mr12}
              />
            }
            <span>{row.title}</span>
          </>
      ),
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
        <DateTime value={row.modifiedAt?.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }]);
}

interface ContractTableProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  addToSelection: (rows: MasterContractHistory[]) => void;
  createDraftForTemplate: (contract: MasterContractHistory) => void;
  cloneDraftFromTemplate: (contract: MasterContractHistory) => void;
  downloadPublishedTemplate: (contract: MasterContractHistory) => void;
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
  setDefaultContract: (contract: MasterContractHistory) => void;
  loading?: boolean;
  pagination: PageRequest;
  query: MasterContractQuery;
  result: MasterContractHistoryResult | null;
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
          this.props.createDraftForTemplate(row);
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
          this.props.cloneDraftFromTemplate(row);
          break;
        case EnumAction.Download:
          this.props.downloadPublishedTemplate(row);
          break;
        case EnumAction.SetDefault:
          this.props.setDefaultContract(row);
          break;
        default:
          // No action
          break;
      }
    }
  }

  render() {
    const { intl, result, setPager, pagination, find, selected, sorting, setSorting, loading } = this.props;

    return (
      <MaterialTable<MasterContractHistory, EnumMasterContractSortField>
        intl={intl}
        columns={contractColumns(this.props)}
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