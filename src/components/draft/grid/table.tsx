import React from 'react';

import { injectIntl, IntlShape, FormattedTime } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '@mdi/react';
import {
  mdiCommentTextOutline,
  mdiCogTransferOutline,
  mdiBookOpenVariant,
  mdiTrayFull,
  mdiCloseOctagon,
  mdiLeadPencil,
  mdiLink,
  mdiDatabaseCogOutline,
  mdiShoppingOutline,
  mdiFileSign,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';

import { EnumSortField, AssetDraft, AssetDraftQuery, EnumDraftStatus, EnumContractType } from 'model/draft';
import { PageRequest, PageResult, Sorting } from 'model/response';

enum EnumAction {
  Review = 'review',
  View = 'view',
  ViewContract = 'contract',
  ViewProcessInstance = 'view-process-instance',
};

function statusToChip(value: EnumDraftStatus, classes: WithStyles<typeof styles>, intl: IntlShape): React.ReactElement | undefined {
  let path: string;
  let color: 'default' | 'primary' | 'secondary' = 'default';

  switch (value) {
    case EnumDraftStatus.DRAFT:
      path = mdiLeadPencil;
      break;
    case EnumDraftStatus.SUBMITTED:
      path = mdiTrayFull;
      break;
    case EnumDraftStatus.PENDING_HELPDESK_REVIEW:
      path = mdiCommentTextOutline;
      color = 'primary';
      break;
    case EnumDraftStatus.PENDING_PROVIDER_REVIEW:
      path = mdiCommentTextOutline;
      break;
    case EnumDraftStatus.HELPDESK_REJECTED:
    case EnumDraftStatus.PROVIDER_REJECTED:
      path = mdiCloseOctagon;
      color = 'secondary';
      break;
    case EnumDraftStatus.POST_PROCESSING:
      path = mdiCogTransferOutline;
      break;
    case EnumDraftStatus.PUBLISHED:
      path = mdiBookOpenVariant;
      break;
  }

  return (
    <Chip
      avatar={<Avatar><Icon path={path} className={classes.classes.avatarIcon} /></Avatar>}
      label={intl.formatMessage({ id: `draft.manager.chip.${value}` })}
      variant="outlined"
      color={color}
    />
  );
}

function draftColumns(intl: IntlShape, classes: WithStyles<typeof styles>): Column<AssetDraft, EnumSortField>[] {
  return (
    [{
      header: intl.formatMessage({ id: 'draft.manager.header.actions' }),
      id: 'actions',
      width: 80,
      cell: (
        rowIndex: number, column: Column<AssetDraft, EnumSortField>, row: AssetDraft, handleAction?: cellActionHandler<AssetDraft, EnumSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          {row.status !== EnumDraftStatus.DRAFT &&
            <Tooltip title={intl.formatMessage({ id: 'draft.manager.tooltip.view-process-instance' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.ViewProcessInstance, rowIndex, column, row) : null}
              >
                <Icon path={mdiDatabaseCogOutline} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumDraftStatus.PUBLISHED &&
            <Tooltip title={intl.formatMessage({ id: 'draft.manager.tooltip.view' })}>
              <i
                onClick={() => handleAction ? handleAction(EnumAction.View, rowIndex, column, row) : null}
              >
                <Icon path={mdiShoppingOutline} className={classes.classes.rowIcon} />
              </i>
            </Tooltip>
          }
          {row.status === EnumDraftStatus.PENDING_HELPDESK_REVIEW &&
            <>
              <Tooltip title={intl.formatMessage({ id: 'draft.manager.tooltip.preview' })}>
                <i
                  onClick={() => handleAction ? handleAction(EnumAction.View, rowIndex, column, row) : null}
                >
                  <Icon path={mdiLink} className={classes.classes.rowIcon} />
                </i>
              </Tooltip>
              <Tooltip title={intl.formatMessage({ id: 'draft.manager.tooltip.review' })}>
                <i
                  onClick={() => handleAction ? handleAction(EnumAction.Review, rowIndex, column, row) : null}
                >
                  <Icon path={mdiCommentTextOutline} className={classes.classes.rowIcon} />
                </i>
              </Tooltip>
              {row.command.contractTemplateType === EnumContractType.UPLOADED_CONTRACT &&
                <Tooltip title={intl.formatMessage({ id: 'draft.manager.tooltip.view-contract' })}>
                  <i
                    onClick={() => handleAction ? handleAction(EnumAction.ViewContract, rowIndex, column, row) : null}
                  >
                    <Icon path={mdiFileSign} className={classes.classes.rowIcon} />
                  </i>
                </Tooltip>
              }
            </>
          }
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'draft.manager.header.status' }),
      id: 'status',
      width: 250,
      sortable: true,
      sortColumn: EnumSortField.STATUS,
      cell: (
        rowIndex: number, column: Column<AssetDraft, EnumSortField>, row: AssetDraft, handleAction?: cellActionHandler<AssetDraft, EnumSortField>
      ): React.ReactNode => statusToChip(row.status, classes, intl)
    }, {
      header: intl.formatMessage({ id: 'draft.manager.header.provider' }),
      id: 'account.profile.provider.name',
      accessor: 'publisher.name',
      sortable: true,
      sortColumn: EnumSortField.PROVIDER,
    }, {
      header: intl.formatMessage({ id: 'draft.manager.header.title' }),
      id: 'title',
      accessor: 'title',
      sortable: true,
      sortColumn: EnumSortField.TITLE,
    }, {
      header: intl.formatMessage({ id: 'draft.manager.header.version' }),
      id: 'version',
      accessor: 'version',
      sortable: true,
      sortColumn: EnumSortField.VERSION,
    }, {
      header: intl.formatMessage({ id: 'draft.manager.header.modifiedOn' }),
      id: 'modifiedOn',
      accessor: 'modifiedOn',
      sortable: true,
      sortColumn: EnumSortField.MODIFIED_ON,
      cell: (
        rowIndex: number, column: Column<AssetDraft, EnumSortField>, row: AssetDraft, handleAction?: cellActionHandler<AssetDraft, EnumSortField>
      ): React.ReactNode => (
        <FormattedTime value={row.modifiedOn.toDate()} day='numeric' month='numeric' year='numeric' />
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
});

interface AssetDraftTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumSortField>[]
  ) => Promise<PageResult<AssetDraft> | null>,
  query: AssetDraftQuery,
  result: PageResult<AssetDraft> | null,
  pagination: PageRequest,
  selected: AssetDraft[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumSortField>[]) => void,
  addToSelection: (rows: AssetDraft[]) => void,
  removeFromSelection: (rows: AssetDraft[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumSortField>[];
  reviewDraft: (key: string) => void;
  viewContract: (providerKey: string, draftKey: string) => void;
  viewDraft: (asset: AssetDraft) => void;
  viewProcessInstance: (businessKey: string, completed: boolean) => void;
  loading?: boolean;
}

class AssetDraftTable extends React.Component<AssetDraftTableProps> {

  constructor(props: AssetDraftTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<AssetDraft, EnumSortField>, row: AssetDraft): void {
    if (row.key) {
      switch (action) {
        case EnumAction.Review:
          this.props.reviewDraft(row.key);
          break;
        case EnumAction.View:
          this.props.viewDraft(row);
          break;
        case EnumAction.ViewProcessInstance:
          this.props.viewProcessInstance(
            row.assetDraft,
            [EnumDraftStatus.PUBLISHED, EnumDraftStatus.HELPDESK_REJECTED, EnumDraftStatus.PROVIDER_REJECTED].includes(row.status)
          );
          break;
        case EnumAction.ViewContract:
          this.props.viewContract(row.publisher.id, row.key);
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
      <MaterialTable<AssetDraft, EnumSortField>
        intl={intl}
        columns={draftColumns(intl, { classes })}
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
const styledComponent = withStyles(styles)(AssetDraftTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;