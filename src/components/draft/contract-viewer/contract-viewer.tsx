import React from 'react';

import { saveAs } from 'file-saver';

// State, routing and localization
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useLocation, useParams, NavigateFunction, Location } from 'react-router-dom';
import { FormattedTime, injectIntl, IntlShape } from 'react-intl';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import { mdiCloudDownload, mdiCommentAlertOutline, mdiFileSign, mdiPaperclip } from '@mdi/js';

// Services
import message from 'service/message';
import DraftApi from 'service/draft';

// Store
import { RootState } from 'store';

// Utilities
import { localizeErrorCodes } from 'utils/error';

// Model
import { StaticRoutes } from 'model/routes';
import { ObjectResponse } from 'model/response';
import { AssetDraft } from 'model/draft';

import { formatFileSize } from 'utils/file';

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
  reportViewer: {
    height: '80vh',
  },
  reportViewerFrame: {
    width: '100%',
    height: '100%',
    border: 0,
  },
});

interface AccountManagerState {
  document: { viewer: string, url: string, index: number | null } | null
  draft: AssetDraft | null;
  loading: boolean;
}

interface RouteParams {
  providerKey?: string | undefined;
  draftKey?: string | undefined;
}

interface AccountManagerProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
  params: RouteParams;
}

class DraftContractViewer extends React.Component<AccountManagerProps, AccountManagerState> {

  private api: DraftApi;

  constructor(props: AccountManagerProps) {
    super(props);

    this.api = new DraftApi();
  }

  state: AccountManagerState = {
    document: null,
    draft: null,
    loading: false,
  }

  get providerKey(): string | null {
    const { providerKey } = this.props.params;

    return providerKey || null;
  }

  get draftKey(): string | null {
    const { draftKey } = this.props.params;

    return draftKey || null;
  }

  componentDidMount() {
    if (this.providerKey && this.draftKey) {
      this.api.findOne(this.providerKey, this.draftKey)
        .then((response: ObjectResponse<AssetDraft>) => {
          if (response.success) {
            this.setState({ draft: response.result! });
          } else {
            const messages = localizeErrorCodes(this.props.intl, response, false);
            message.errorHtml(messages, () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));

            this.props.navigate(StaticRoutes.DraftManager);
          }
        })
        .catch(() => {
          message.errorHtml("Find operation has failed", () => (<Icon path={mdiCommentAlertOutline} size="3rem" />));
          this.props.navigate(StaticRoutes.DraftManager);
        });
    } else {
      this.props.navigate(StaticRoutes.DraftManager);
    }
  }

  componentWillUnmount() {
    const { document } = this.state;

    if (document) {
      URL.revokeObjectURL(document.url);
    }
  }

  onDocumentSelect(download: boolean, index: number | null = null) {
    const { draft, document: prevDocument } = this.state;

    if (!draft) {
      this.setState({ document: null });
      return;
    }

    const providerKey = draft.publisher.id;
    const draftKey = draft.key;
    const annexKey = index === null ? '' : draft.command.contractAnnexes![index].id;
    const fileName = index === null ? 'contract.pdf' : draft.command.contractAnnexes![index].fileName;

    const request = index === null ?
      this.api.downloadContract(providerKey, draftKey) :
      this.api.downloadContractAnnex(providerKey, draftKey, annexKey);


    this.setState({ loading: true, document: null });

    if (prevDocument) {
      URL.revokeObjectURL(prevDocument.url);
    }

    request
      .then((response) => {
        if (download) {
          console.log(fileName);
          saveAs(response.result!, fileName);
        } else {
          const nextDocument = window.URL.createObjectURL(response.result!);

          this.setState({
            document: {
              viewer: `vendors/mozilla/pdf-js-viewer/web/viewer.html?file=${nextDocument}`,
              url: nextDocument,
              index,
            },
          });
        }
      })
      .finally(() => {
        setTimeout(() => this.setState({ loading: false }), 250);
      });
  };

  render() {
    const { draft, document } = this.state;

    if (!draft) {
      return null;
    }

    const { classes } = this.props;

    return (
      <Grid container spacing={3} alignItems="flex-start">
        <Grid container item xs={4}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" gutterBottom>
                    Title
                  </Typography>
                  <Typography variant="body1">
                    {draft.title}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" gutterBottom>
                    Modified On
                  </Typography>
                  <Typography variant="body1">
                    <FormattedTime value={draft.modifiedOn.toDate()} day='numeric' month='numeric' year='numeric' />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" gutterBottom>
                    Publisher
                  </Typography>
                  <Typography variant="body1">
                    {draft.publisher.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" gutterBottom>
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {draft.type}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {draft.command.abstract}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {this.renderFileList()}
            </Paper>
          </Grid>
        </Grid>

        {document &&
          <Grid item xs={8}>
            <Paper className={classes.paper + ' ' + classes.reportViewer}>
              <iframe title="Report Viewer" src={document.viewer} className={classes.reportViewerFrame}>
              </iframe>
            </Paper>
          </Grid>
        }
      </Grid>
    );
  }

  renderFileList() {
    const { draft, loading, document } = this.state;

    if (!draft) {
      return null;
    }
    const files = [
      <ListItem
        key="contract"
        button
        disabled={loading}
        selected={document?.index === null}
        onClick={(event) => this.onDocumentSelect(false)}
      >
        <ListItemAvatar>
          <Avatar>
            <Icon path={mdiFileSign} size="1.5rem" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Contract" />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => this.onDocumentSelect(true)}>
            <Icon path={mdiCloudDownload} size="1.5rem" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ];

    draft.command.contractAnnexes?.forEach((a, index) => {
      files.push(
        <ListItem
          key={a.id}
          button
          disabled={loading}
          selected={document?.index === index}
          onClick={(event) => this.onDocumentSelect(false, index)}
        >
          <ListItemAvatar>
            <Avatar>
              <Icon path={mdiPaperclip} size="1.5rem" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={a.description || a.fileName} secondary={formatFileSize(a.size)} />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => this.onDocumentSelect(true, index)}>
              <Icon path={mdiCloudDownload} size="1.5rem" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    })

    return (
      <List>
        {files}
      </List>
    );
  }

}

const mapState = (state: RootState) => ({
  config: state.config,
});

const mapDispatch = {
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>

// Apply styles
const styledComponent = withStyles(styles)(DraftContractViewer);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);

// Inject state
const ConnectedComponent = connector(LocalizedComponent);

const RoutedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params: RouteParams = useParams();

  return (
    <ConnectedComponent navigate={navigate} location={location} params={params} />
  );
}

export default RoutedComponent;
