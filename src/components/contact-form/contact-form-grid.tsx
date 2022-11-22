import React from 'react';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// 3rd party components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';

import PerfectScrollbar from 'react-perfect-scrollbar';

// Icons
import Icon from '@mdi/react';
import {
  mdiCommentAlertOutline,
} from '@mdi/js';

// Services
import message from 'service/message';

// Store
import { RootState } from 'store';
import {
  resetFilter,
  setFilter,
  setPager,
  setSorting,
} from 'store/contact-form/actions';
import {
  completeForm,
  find,
} from 'store/contact-form/thunks';
import {
  countPendingForms,
} from 'store/contact-form/thunks';

// Model
import { PageRequest, PageResult, Sorting } from 'model/response';
import { EnumContactFormSortField, ContactForm, ContactFormQuery } from 'model/contact-form';

// Components
import MessageFilters from './grid/filter';
import ContactFormComponent from 'components/contact-form/contact-form';

const styles = (theme: Theme) => createStyles({
  caption: {
    paddingLeft: 8,
    fontSize: '0.7rem',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  paginationToolbar: {
    paddingLeft: theme.spacing(1),
  },
  contactFormListContainer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  contactFormList: {
    maxHeight: 'calc(100vh - 120px)',
  },
});

interface MessageManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class MessageManager extends React.Component<MessageManagerProps> {

  componentDidMount() {
    this.find();
  }

  find(): Promise<PageResult<ContactForm> | null> {
    return this.props.find().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }

      return result;
    });
  }

  setSorting(sorting: Sorting<EnumContactFormSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  completeForm(formKey: string): void {
    this.props.completeForm(formKey).then(() => {
      this.props.countPendingForms();
    });
  }

  render() {
    const {
      classes,
      find,
      inbox,
      inbox: { forms, loading, pagination, selectedForm },
      setPager,
    } = this.props;

    const items = forms?.items || [];

    const page = pagination.page || 0;
    const size = pagination.size || 10;

    return (
      <Grid container direction="row" spacing={1}>
        <Grid container item xs={12} style={{ paddingLeft: 16 }}>
          <MessageFilters
            query={inbox.query}
            find={this.props.find}
            resetFilter={() => this.props.resetFilter()}
            setFilter={(query: Partial<ContactFormQuery>) => this.props.setFilter(query)}
          />
        </Grid>
        {!loading && items.length === 0 &&
          <Grid item xs={12}>
            <Alert severity="info">No messages found</Alert>
          </Grid>
        }
        {items.length !== 0 &&
          <>
            <Grid container item xs={12}>
              <TablePagination
                classes={{
                  toolbar: classes.paginationToolbar,
                }}
                component="div"
                rowsPerPageOptions={[10]}
                count={forms?.count || 0}
                rowsPerPage={10}
                page={page}
                onPageChange={(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
                  setPager(newPage, size);

                  find();
                }}
                labelDisplayedRows={({ from, to, count }) => (
                  <FormattedMessage id="inbox.messages-displayed" values={{ from, to: (to === -1 ? count : to), count }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <PerfectScrollbar className={classes.contactFormList} options={{ suppressScrollX: true }}>
                <div className={classes.contactFormListContainer}>
                  {items.map((f) => (
                    <ContactFormComponent
                      key={f.key}
                      form={f}
                      select={(form: ContactForm) => console.log(form)}
                      selected={f.key === selectedForm?.key}
                    />
                  ))}
                </div>
              </PerfectScrollbar>
            </Grid>
          </>
        }
      </Grid>
    );

  }

}

const mapState = (state: RootState) => ({
  config: state.config,
  inbox: state.message.contactForms,
  profile: state.security.profile,
});

const mapDispatch = {
  completeForm: (formKey: string) => completeForm(formKey),
  countPendingForms: () => countPendingForms(),
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumContactFormSortField>[]) => find(pageRequest, sorting),
  resetFilter,
  setFilter,
  setPager,
  setSorting,
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(MessageManager);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConnectedComponent navigate={navigate} location={location} />
  );
}

export default RoutedComponent;
