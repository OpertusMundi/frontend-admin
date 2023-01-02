import React from 'react';

import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Icon from '@mdi/react';
import {
  mdiAlertOctagramOutline,
  mdiAlertOutline,
  mdiBugOutline,
  mdiCogOutline,
  mdiContentCopy,
  mdiInformationOutline,
} from '@mdi/js';

import MaterialTable, { cellActionHandler, Column } from 'components/material-table';
import DateTime from 'components/common/date-time';

import { EnumEventLevel, EnumEventSortField, Event, EventQuery } from 'model/event';
import { PageRequest, PageResult, Sorting } from 'model/response';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

enum EnumAction {
  CopyException = 'copy-business-key',
  ViewErrorDetails = 'error-details',
};

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
  message: {

  },
  chipIcon: {
    width: 16,
    color: '#ffffff',
  },
});

function applicationToChip(value: string, props: EventTableProps): React.ReactElement | undefined {
  const { classes, intl } = props;
  return (
    <Chip
      avatar={<Avatar><Icon path={mdiCogOutline} className={classes.chipIcon} /></Avatar>}
      label={intl.formatMessage({ id: `event.application.${value}` })}
      variant="outlined"
      color={'primary'}
    />
  );
}

function levelToChip(value: EnumEventLevel, props: EventTableProps): React.ReactElement | undefined {
  const { classes, intl } = props;
  let path: string;
  let color: 'default' | 'primary' | 'secondary' = 'default';

  switch (value) {
    case EnumEventLevel.DEBUG:
      path = mdiBugOutline;
      break;
    case EnumEventLevel.INFO:
      path = mdiInformationOutline;
      color = 'primary';
      break;
    case EnumEventLevel.WARN:
      path = mdiAlertOutline;
      color = 'secondary';
      break;
    case EnumEventLevel.ERROR:
      path = mdiAlertOctagramOutline;
      color = 'secondary';
      break;
  }

  return (
    <Chip
      avatar={<Avatar><Icon path={path} className={classes.chipIcon} /></Avatar>}
      label={intl.formatMessage({ id: `event.level.${value}` })}
      variant="outlined"
      color={color}
    />
  );
}

function eventColumns(props: EventTableProps): Column<Event, EnumEventSortField>[] {
  const { classes, intl } = props;
  return (
    [{
      header: intl.formatMessage({ id: 'event.header.actions' }),
      id: 'actions',
      width: 50,
      cell: (
        rowIndex: number,
        column: Column<Event, EnumEventSortField>,
        row: Event,
        handleAction?: cellActionHandler<Event, EnumEventSortField>
      ): React.ReactNode => (
        <div style={{ display: 'flex', justifyContent: 'start' }}>
          <Tooltip title={intl.formatMessage({ id: 'event.header.exception' })}>
            <i
              onClick={() => handleAction ? handleAction(EnumAction.ViewErrorDetails, rowIndex, column, row) : null}
            >
              <Icon path={mdiBugOutline} className={classes.rowIconAction} />
            </i>
          </Tooltip>
        </div>
      ),
    }, {
      header: intl.formatMessage({ id: 'event.header.level' }),
      id: 'level',
      width: 70,
      sortable: false,
      cell: (
        rowIndex: number, column: Column<Event, EnumEventSortField>, row: Event, handleAction?: cellActionHandler<Event, EnumEventSortField>
      ): React.ReactNode => levelToChip(row.level, props)
    }, {
      header: intl.formatMessage({ id: 'event.header.application' }),
      id: 'application',
      width: 250,
      sortable: true,
      sortColumn: EnumEventSortField.APPLICATION,
      cell: (
        rowIndex: number, column: Column<Event, EnumEventSortField>, row: Event, handleAction?: cellActionHandler<Event, EnumEventSortField>
      ): React.ReactNode => applicationToChip(row.application, props)
    }, {
      header: intl.formatMessage({ id: 'event.header.user-name' }),
      id: 'userName',
      width: 250,
      sortable: false,
    }, {
      header: intl.formatMessage({ id: 'event.header.client-address' }),
      id: 'clientAddress',
      width: 180,
      sortable: true,
      sortColumn: EnumEventSortField.CLIENT_ADDRESS,
    }, {
      header: intl.formatMessage({ id: 'event.header.timestamp' }),
      id: 'timestamp',
      sortable: true,
      sortColumn: EnumEventSortField.TIMESTAMP,
      width: 180,
      cell: (
        rowIndex: number,
        column: Column<Event, EnumEventSortField>,
        row: Event,
        handleAction?: cellActionHandler<Event, EnumEventSortField>
      ): React.ReactNode => (
        <DateTime value={row.timestamp.toDate()} day='numeric' month='numeric' year='numeric' />
      ),
    }, {
      header: intl.formatMessage({ id: 'event.header.message' }),
      id: 'message',
      sortable: false,
      cell: (
        rowIndex: number,
        column: Column<Event, EnumEventSortField>,
        row: Event,
        handleAction?: cellActionHandler<Event, EnumEventSortField>
      ): React.ReactNode => (
        <div className={classes.compositeLabel}>
          <div>
            <Typography variant="caption" gutterBottom className={classes.message}>
              {row.message}
            </Typography>
          </div>
          <i
            onClick={() => handleAction ? handleAction(EnumAction.CopyException, rowIndex, column, row) : null}
          >
            <Icon path={mdiContentCopy} className={classes.rowIconAction} />
          </i>
        </div>

      ),
    }]);
}

interface EventTableProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumEventSortField>[]
  ) => Promise<PageResult<Event> | null>,
  viewException: (event: Event | null) => void,
  query: Partial<EventQuery>,
  result: PageResult<Event> | null,
  pagination: PageRequest,
  selected: Event[],
  setPager: (page: number, size: number) => void,
  setSorting: (sorting: Sorting<EnumEventSortField>[]) => void,
  addToSelection: (rows: Event[]) => void,
  removeFromSelection: (rows: Event[]) => void,
  resetSelection: () => void;
  sorting: Sorting<EnumEventSortField>[];
  loading?: boolean;
}

class EventTable extends React.Component<EventTableProps> {

  constructor(props: EventTableProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(action: string, index: number, column: Column<Event, EnumEventSortField>, row: Event): void {
    switch (action) {
      case EnumAction.CopyException:
        const value = row.exception.replaceAll('|', '\n').replaceAll('#011', '\t');

        copyToClipboard(value);
        break;

      case EnumAction.ViewErrorDetails:
        this.props.viewException(row);
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
        <MaterialTable<Event, EnumEventSortField>
          intl={intl}
          columns={eventColumns(this.props)}
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
const styledComponent = withStyles(styles)(EventTable);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;