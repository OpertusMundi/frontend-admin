import React from 'react';
import { AxiosError } from 'axios';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCheckOutline, mdiCommentAlertOutline, mdiTrashCanOutline, mdiUndoVariant, mdiWindowClose } from '@mdi/js';

// Services
import message from 'service/message';
import DraftApi from 'service/draft';

// Store
import { RootState } from 'store';
import { addToSelection, removeFromSelection, resetFilter, resetSelection, setFilter, setPager, setSorting } from 'store/draft/actions';
import { find } from 'store/draft/thunks';

// Utilities
import { localizeErrorCodes } from 'utils/error';

// Model
import { DynamicRoutes, buildPath } from 'model/routes';
import { PageRequest, Sorting, SimpleResponse } from 'model/response';
import { EnumSortField, AssetDraft, EnumDraftStatus, EnumContractType } from 'model/draft';

// Components
import Dialog, { DialogAction, EnumDialogAction } from 'components/dialog';
import DateTime from 'components/common/date-time';

import DraftFilters from './grid/filter';
import DraftTable from './grid/table';

const styles = (theme: Theme) => createStyles({
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
  caption: {
    paddingLeft: 0,
    fontSize: '0.7rem',
  }
});

interface AccountManagerState {
  contractValidated: boolean;
  deleteDialog: boolean;
  draft: AssetDraft | null,
  reason: string,
  reasonRequired: boolean,
  reviewDialog: boolean;
}

interface AccountManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

class AssetDraftManager extends React.Component<AccountManagerProps, AccountManagerState> {

  private api: DraftApi;

  constructor(props: AccountManagerProps) {
    super(props);

    this.api = new DraftApi();

    this.deleteDraft = this.deleteDraft.bind(this)
    this.reviewDraft = this.reviewDraft.bind(this);
    this.viewContract = this.viewContract.bind(this);
    this.viewDraft = this.viewDraft.bind(this);
    this.viewProcessInstance = this.viewProcessInstance.bind(this);
  }

  state: AccountManagerState = {
    contractValidated: false,
    deleteDialog: false,
    draft: null,
    reason: '',
    reasonRequired: false,
    reviewDialog: false,
  }

  handleReasonChange(reason: string) {
    this.setState({ reason, reasonRequired: false });
  }

  handleContractValidatedChange(contractValidated: boolean) {
    this.setState({ contractValidated });
  }

  showReviewDialog(draft: AssetDraft): void {
    this.setState({
      reviewDialog: true,
      draft,
    });
  }

  hideReviewDialog(): void {
    this.setState({
      reviewDialog: false,
      draft: null,
      reason: '',
      reasonRequired: false,
    });
  }

  confirmReviewDialogHandler(action: DialogAction): void {
    const { draft, reason } = this.state;

    switch (action.key) {
      case EnumDialogAction.Accept: {
        if (draft) {
          this.api.accept(draft.publisher.id, draft.key)
            .then((response) => {
              if (response.data.success) {
                this.find();

                message.info('draft.message.accept-success');

                this.hideReviewDialog();
              } else {
                const messages = localizeErrorCodes(this.props.intl, response.data);
                message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
              }
            })
            .catch((err: AxiosError<SimpleResponse>) => {
              const messages = localizeErrorCodes(this.props.intl, err.response?.data);
              message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            });
        }
        break;
      }
      case EnumDialogAction.Reject: {
        if (!reason) {
          this.setState({ reasonRequired: true });
        }
        if (draft) {
          this.api.reject(draft.publisher.id, draft.key, reason)
            .then((response) => {
              if (response.data.success) {
                this.find();

                message.warn('draft.message.reject-success');

                this.hideReviewDialog();
              } else {
                const messages = localizeErrorCodes(this.props.intl, response.data);
                message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
              }
            })
            .catch((err: AxiosError<SimpleResponse>) => {
              const messages = localizeErrorCodes(this.props.intl, err.response?.data);
              message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            });
        }
        break;
      }
      case EnumDialogAction.Cancel:
        this.hideReviewDialog();
        break;
    }
  }

  showDeleteDialog(draft: AssetDraft): void {
    this.setState({
      deleteDialog: true,
      draft,
    });
  }

  hideDeleteDialog(): void {
    this.setState({
      deleteDialog: false,
      draft: null,
    });
  }

  confirmDeleteDialogHandler(action: DialogAction): void {
    const { draft } = this.state;

    switch (action.key) {
      case EnumDialogAction.Yes: {
        if (draft) {
          this.api.deleteDraft(draft.publisher.id, draft.key)
            .then((response) => {
              if (response.data.success) {
                this.find();

                message.info('draft.message.delete-success');

                this.hideDeleteDialog();
              } else {
                const messages = localizeErrorCodes(this.props.intl, response.data);
                message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
              }
            })
            .catch((err: AxiosError<SimpleResponse>) => {
              const messages = localizeErrorCodes(this.props.intl, err.response?.data);
              message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
            });
        }
        break;
      }
      case EnumDialogAction.Cancel:
        this.hideDeleteDialog();
        break;
    }
  }

  componentDidMount() {
    this.find();
  }

  find(): void {
    this.props.find().then((result) => {
      if (!result) {
        message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
      }
    });
  }

  reviewDraft(key: string): void {
    const { draft: { result } } = this.props;

    const record = result?.items.find(d => d.key === key);

    if (record) {
      this.showReviewDialog(record);
    }
  }

  deleteDraft(draft: AssetDraft): void {
    this.showDeleteDialog(draft);
  }

  viewDraft(asset: AssetDraft): void {
    const { config: { marketplaceUrl } } = this.props;
    const { status, assetDraft, assetPublished } = asset;

    const trailingSlash = !marketplaceUrl.endsWith('/');
    const url = status === EnumDraftStatus.PUBLISHED ?
      `${marketplaceUrl}${trailingSlash ? '/' : ''}catalogue/${assetPublished}` :
      `${marketplaceUrl}${trailingSlash ? '/' : ''}helpdesk-review/${assetDraft}`;

    window.open(url, "_blank");
  }

  viewContract(providerKey: string, draftKey: string): void {
    const path = buildPath(DynamicRoutes.DraftContractViewer, { providerKey, draftKey });
    this.props.navigate(path);
  }

  viewProcessInstance(businessKey: string, completed: boolean): void {
    const path = buildPath(
      completed ? DynamicRoutes.ProcessInstanceHistoryView : DynamicRoutes.ProcessInstanceView, null, { businessKey }
    );
    this.props.navigate(path);
  }

  setSorting(sorting: Sorting<EnumSortField>[]): void {
    this.props.setSorting(sorting);
    this.find();
  }

  render() {
    const {
      addToSelection,
      classes,
      draft: { query, result, pagination, loading, lastUpdated, selected, sorting },
      find,
      setPager,
      setFilter,
      removeFromSelection,
      resetFilter,
    } = this.props;

    return (
      <>
        <div>
          <Paper className={classes.paper}>
            <DraftFilters
              query={query}
              setFilter={setFilter}
              resetFilter={resetFilter}
              find={find}
              disabled={loading}
            />
            {lastUpdated &&
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom className={classes.caption}>
                    <FormattedMessage id="draft.manager.last-update" />
                    <DateTime value={lastUpdated.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>

          <Paper className={classes.paper}>
            <DraftTable
              find={this.props.find}
              query={query}
              result={result}
              pagination={pagination}
              selected={selected}
              setPager={setPager}
              setSorting={(sorting: Sorting<EnumSortField>[]) => this.setSorting(sorting)}
              addToSelection={addToSelection}
              deleteDraft={this.deleteDraft}
              removeFromSelection={removeFromSelection}
              resetSelection={resetSelection}
              reviewDraft={this.reviewDraft}
              viewContract={this.viewContract}
              viewDraft={this.viewDraft}
              viewProcessInstance={this.viewProcessInstance}
              sorting={sorting}
              loading={loading}
            />
          </Paper>
        </div>
        {this.renderReviewDialog()}
        {this.renderDeleteDialog()}
      </>
    );
  }

  renderReviewDialog() {
    const _t = this.props.intl.formatMessage;

    const { reviewDialog, draft: record, reason, reasonRequired, contractValidated } = this.state;

    if (!reviewDialog || !record) {
      return null;
    }
    const contractValidationRequired = record.command.contractTemplateType === EnumContractType.UPLOADED_CONTRACT;

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Accept,
            label: _t({ id: 'view.shared.action.accept' }),
            iconClass: () => (<Icon path={mdiCheckOutline} size="1.5rem" />),
            color: 'primary',
            disabled: contractValidationRequired && !contractValidated,
          }, {
            key: EnumDialogAction.Reject,
            label: _t({ id: 'view.shared.action.reject' }),
            iconClass: () => (<Icon path={mdiWindowClose} size="1.5rem" />),
            color: 'secondary',
            disabled: !reason,
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideReviewDialog()}
        handleAction={(action) => this.confirmReviewDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={reviewDialog}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormattedMessage id="draft.message.review-draft" values={{
              title: (<b>{record.title}</b>), version: (<b>{record.version}</b>)
            }} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label="Rejection reason for Provider"
              multiline
              minRows={4}
              value={reason}
              fullWidth
              onChange={
                (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => this.handleReasonChange(event.target.value)
              }
              error={reasonRequired}
            />
          </Grid>
          {contractValidationRequired &&
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={contractValidated}
                    onChange={
                      (event) => this.handleContractValidatedChange(event.target.checked)
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label={_t({ id: 'draft.form-review.contract-validated' })}
              />
            </Grid>
          }
        </Grid>
      </Dialog>
    );
  }

  renderDeleteDialog() {
    const _t = this.props.intl.formatMessage;
    const { deleteDialog, draft: record } = this.state;

    if (!deleteDialog || !record) {
      return null;
    }

    return (
      <Dialog
        actions={[
          {
            key: EnumDialogAction.Yes,
            label: _t({ id: 'view.shared.action.delete' }),
            iconClass: () => (<Icon path={mdiTrashCanOutline} size="1.5rem" />),
            color: 'secondary',
          }, {
            key: EnumDialogAction.Cancel,
            label: _t({ id: 'view.shared.action.cancel' }),
            iconClass: () => (<Icon path={mdiUndoVariant} size="1.5rem" />)
          }
        ]}
        handleClose={() => this.hideDeleteDialog()}
        handleAction={(action) => this.confirmDeleteDialogHandler(action)}
        header={
          <span>
            <i className={'mdi mdi-comment-question-outline mr-2'}></i>
            <FormattedMessage id="view.shared.dialog.title" />
          </span>
        }
        open={deleteDialog}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormattedMessage id="draft.message.delete-draft" values={{
              title: (<b>{record.title}</b>), version: (<b>{record.version}</b>)
            }} />
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

const mapState = (state: RootState) => ({
  config: state.config,
  draft: state.draft,
});

const mapDispatch = {
  addToSelection,
  find: (pageRequest?: PageRequest, sorting?: Sorting<EnumSortField>[]) => find(pageRequest, sorting),
  removeFromSelection,
  resetFilter,
  resetSelection,
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
const styledComponent = withStyles(styles)(AssetDraftManager);

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
