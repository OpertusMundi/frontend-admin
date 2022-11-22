import React from 'react';

// Localization
import { injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

// Icons
import Icon from '@mdi/react';
import {
  mdiCommentAlertOutline,
} from '@mdi/js';


// Model
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumContactFormSortField, ContactFormQuery, ContactForm } from 'model/contact-form';

// Services
import message from 'service/message';

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
  disabled?: boolean,
  query: Partial<ContactFormQuery>,
  find: (
    pageRequest?: PageRequest, sorting?: Sorting<EnumContactFormSortField>[]
  ) => Promise<PageResult<ContactForm> | null>,
  resetFilter: () => void,
  setFilter: (query: Partial<ContactFormQuery>) => void,
}

class MessageFilters extends React.Component<MessageFiltersProps> {

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

  render() {
    return (
      <Grid container spacing={2} item alignItems='center'>
      </Grid >
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(MessageFilters);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;

