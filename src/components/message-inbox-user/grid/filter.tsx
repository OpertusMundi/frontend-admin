import React from 'react';

// Localization
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// Icons
import Icon from '@mdi/react';
import {
  mdiCommentAlertOutline,
  mdiEmailMultipleOutline,
  mdiEmailOpenMultipleOutline,
  mdiEmailOutline,
  mdiTrayFull,
} from '@mdi/js';


// Model
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumMessageSortField, MessageQuery, ClientMessage, ClientContact, EnumMessageView } from 'model/chat';

// Services
import message from 'service/message';
import AsyncCustomerAutoComplete from 'components/common/customer-auto-complete';

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
});

interface MessageFiltersProps extends WithStyles<typeof styles> {
  intl: IntlShape,
  contacts: ClientContact[],
  disabled?: boolean,
  query: Partial<MessageQuery>,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumMessageSortField>[]
  ) => Promise<PageResult<ClientMessage> | null>,
  findContacts: (email: string) => Promise<ClientContact[]>,
  resetFilter: () => void,
  setFilter: (query: Partial<MessageQuery>) => void,
}

class MessageFilters extends React.Component<MessageFiltersProps> {

  constructor(props: MessageFiltersProps) {
    super(props);

    this.onChangeReadStatus = this.onChangeReadStatus.bind(this);
  }

  static defaultProps = {
    disabled: false,
  }

  find(): void {
    this.props.find({ page: 0, size: 10 }).then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  onChangeReadStatus(event: React.MouseEvent<HTMLElement>, view: EnumMessageView) {
    this.props.setFilter({
      view,
    });
    this.props.find();
  }

  render() {
    const { contacts, query, setFilter, find, findContacts } = this.props;

    return (
      <Grid container spacing={2} item alignItems='center'>
        <Grid item>
          <ToggleButtonGroup
            value={query.view}
            exclusive
            onChange={this.onChangeReadStatus}
            aria-label="text alignment"
          >
            <ToggleButton value={EnumMessageView.ALL} aria-label="left aligned">
              <Icon path={mdiTrayFull} size="1.65rem" title={'All'} />
            </ToggleButton>
            <ToggleButton value={EnumMessageView.UNREAD} aria-label="centered" title={'Only unread'}>
              <Icon path={mdiEmailOutline} size="1.65rem" />
            </ToggleButton>
            <ToggleButton value={EnumMessageView.THREAD_ONLY} aria-label="centered" title={'Only threads'}>
              <Icon path={mdiEmailOpenMultipleOutline} size="1.65rem" />
            </ToggleButton>
            <ToggleButton value={EnumMessageView.THREAD_ONLY_UNREAD} aria-label="centered" title={'Only threads with unread messages'}>
              <Icon path={mdiEmailMultipleOutline} size="1.65rem" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item sm={4} xs={12}>
          <AsyncCustomerAutoComplete
            error={false}
            label={'Customer'}
            loadingText={'Searching ...'}
            noOptionsText={'No data found'}
            options={contacts}
            promptText={'Type 3 characters ...'}
            getOptionKey={(option: ClientContact) => {
              return option.id;
            }}
            getOptionLabel={(option: ClientContact) => {
              return option.email;
            }}
            loadOptions={(value: string) => findContacts(value)}
            onChange={(value: ClientContact | null) => {
              setFilter({ contact: value?.id || null });
              find();
            }}
            value={query.contact || null}
          />
        </Grid>
      </Grid >
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(MessageFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

