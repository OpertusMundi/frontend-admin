import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Outlet, Link, useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Icons
import Icon from '@mdi/react';
import {
  mdiAccountMultiple,
  mdiCogClockwise,
  mdiBadgeAccountOutline,
  mdiBellAlertOutline,
  mdiLayers,
  mdiCogOutline,
  mdiCogSyncOutline,
  mdiFaceAgent,
  mdiForumOutline,
  mdiHandshakeOutline,
  mdiLogoutVariant,
  mdiMapOutline,
  mdiPackageVariantClosed,
  mdiSignatureFreehand,
  mdiTextBoxCheckOutline,
  mdiTools,
  mdiViewDashboardOutline,
  mdiBankTransferIn,
  mdiBankTransferOut,
  mdiBugOutline,
  mdiFinance,
  mdiChartBarStacked,
  mdiTray,
  mdiTrayFull,
  mdiWalletOutline,
  mdiProgressWrench,
  mdiMenu,
  mdiAccountWrenchOutline,
} from '@mdi/js';

// Utilities
import clsx from 'clsx';

// Model
import { EnumHelpdeskRole as EnumRole } from 'model/role';
import { routes, getRoute, StaticRoutes } from 'model/routes';
import { HelpdeskAccount } from 'model/account';

// Components
import Breadcrumb from './breadcrumb';
import MapViewerConfigComponent from 'components/map-viewer-config';
import SecureContent from 'components/secure-content';

import PerfectScrollbar from 'react-perfect-scrollbar';

// Store
import { RootState } from 'store';
import { logout } from 'store/security/thunks';
import { countTasks } from 'store/process-instance-task/thunks';
import { countIncidents } from 'store/incident/thunks';
import { countProcessInstances } from 'store/process-instance/thunks';
import { countUnassignedMessages } from 'store/message-inbox-helpdesk/thunks';
import { countNewMessages } from 'store/message-inbox-user/thunks';

enum EnumSection {
  Admin = 'Admin',
  Billing = 'Billing',
  Drawer = 'Drawer',
  MapDrawer = 'MapDrawer',
  Message = 'Message',
};

const drawerWidth = 280;
const mapDrawerWidth = 280;

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    padding: 0,
  },
  userContainer: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  outletContainerWrapper: {
    height: 'calc(100vh - 64px)',
  },
  menuListWrapper: {
    height: 'calc(100vh - 170px)',
  },
  container: {
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(0),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  toolbarIconSmall: {
    justifyContent: 'center',
  },
  toolbarImage: {
    maxWidth: '80px',
  },
  menuIcon: {
    marginRight: 8,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    width: `calc(100% - ${56}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    marginLeft: -19,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    paddingLeft: 8,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
  },
  mapDrawerPaper: {
    width: mapDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  fixedHeight: {
    height: 240,
  },
  collapse: {
    background: '#ECEFF1',
  },
  childMenu: {
    borderRight: '3px solid #3f51b5',
  }
});

interface HomeState {
  open: {
    [EnumSection.Admin]: boolean;
    [EnumSection.Billing]: boolean;
    [EnumSection.Drawer]: boolean;
    [EnumSection.MapDrawer]: boolean;
    [EnumSection.Message]: boolean;
  },
  menuAnchor: HTMLElement | null,
  isMenuOpen: boolean,
  drawerInTransition: boolean;
}

interface HomeProps extends PropsFromRedux, WithStyles<typeof styles> {
  intl: IntlShape;
  navigate: NavigateFunction;
  location: Location;
}

const menuId = 'primary-search-account-menu';

class Home extends React.Component<HomeProps, HomeState> {

  private drawerRef: React.RefObject<HTMLDivElement> | null;

  private refreshCountersInterval: number | null = null;

  constructor(props: HomeProps) {
    super(props);

    this.drawerRef = React.createRef<HTMLDivElement>();
  }

  state: HomeState = {
    open: {
      [EnumSection.Admin]: false,
      [EnumSection.Billing]: false,
      [EnumSection.Drawer]: true,
      [EnumSection.MapDrawer]: false,
      [EnumSection.Message]: false,
    },
    menuAnchor: null,
    isMenuOpen: false,
    drawerInTransition: false,
  }

  get userName(): string {
    const { email, firstName, lastName } = this.props.profile as HelpdeskAccount;

    if (firstName || lastName) {
      return `${firstName} ${lastName}`;
    }

    return email;
  }

  get avatar(): string {
    const { profile } = this.props;

    if (profile?.image && profile?.imageMimeType) {
      return `data:${profile.imageMimeType};base64,${profile.image}`;
    }

    return '';
  }

  componentDidMount() {
    if (this.drawerRef?.current) {
      this.drawerRef.current.addEventListener('transitionstart', () => {
        this.setState({
          drawerInTransition: true,
        });
      }, false);

      this.drawerRef.current.addEventListener('transitionend', () => {
        this.setState({
          drawerInTransition: false,
        });
      }, false);
    }

    this.props.countTasks();
    this.props.countIncidents();
    this.props.countProcessInstances();
    this.props.countNewMessages();
    this.props.countUnassignedMessages();

    this.refreshCountersInterval = window.setInterval(() => {
      this.props.countTasks();
      this.props.countIncidents();
      this.props.countProcessInstances();
      this.props.countNewMessages();
      this.props.countUnassignedMessages();
    }, 5 * 60 * 1000);
  }

  componentWillUnmount() {
    if (this.refreshCountersInterval != null) {
      clearInterval(this.refreshCountersInterval);
    }
  }

  onDrawerOpen(section: EnumSection = EnumSection.Drawer) {
    this.setState({
      open: {
        ...this.state.open,
        [section]: true,
      },
    });
  }

  onDrawerClose(section: EnumSection = EnumSection.Drawer) {
    this.setState({
      open: {
        ...this.state.open,
        [section]: false,
      },
    });
  }

  onSectionToggle(key: EnumSection) {
    this.setState({
      ...this.state,
      open: {
        ...this.state.open,
        [EnumSection.Admin]: this.state.open[key] ? this.state.open[EnumSection.Admin] : false,
        [EnumSection.Billing]: this.state.open[key] ? this.state.open[EnumSection.Billing] : false,
        [EnumSection.Message]: this.state.open[key] ? this.state.open[EnumSection.Message] : false,
        [key]: !this.state.open[key],
      }
    });
  }

  onNavigate(e: React.MouseEvent | null, url: string) {
    if (e) {
      e.preventDefault();
    }

    this.props.navigate(url);
  }

  onMenuOpen(event: React.MouseEvent<HTMLElement>) {
    this.setState({
      menuAnchor: event.currentTarget,
      isMenuOpen: true,
    });
  };

  onMenuClose(action: 'Profile' | 'Settings' | 'Logout' | null) {
    this.setState({
      menuAnchor: null,
      isMenuOpen: false,
    });
    switch (action) {
      case 'Profile':
        this.onNavigate(null, StaticRoutes.Profile)
        break;
      case 'Settings':
        this.onNavigate(null, StaticRoutes.Settings)
        break;
      case 'Logout':
        this.props.logout();
        break;
    }
  }

  renderMenu() {
    const { classes } = this.props;

    return (
      <Menu
        anchorEl={this.state.menuAnchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={this.state.isMenuOpen}
        onClose={() => this.onMenuClose(null)}
      >
        <MenuItem onClick={() => this.onMenuClose('Profile')}>
          <Icon path={mdiBadgeAccountOutline} size="1.5rem" className={classes.menuIcon} />
          <FormattedMessage id={`menu.profile`} />
        </MenuItem>
        <MenuItem onClick={() => this.onMenuClose('Settings')}>
          <Icon path={mdiCogOutline} size="1.5rem" className={classes.menuIcon} />
          <FormattedMessage id={`menu.settings`} />
        </MenuItem>
        <Divider light />
        <MenuItem onClick={() => this.onMenuClose('Logout')}>
          <Icon path={mdiLogoutVariant} size="1.5rem" className={classes.menuIcon} />
          <FormattedMessage id={`menu.logout`} />
        </MenuItem>
      </Menu>
    );
  }

  renderToolbar() {
    const { classes, location } = this.props;

    const route = getRoute(location.pathname);
    if (!route) {
      return null;
    }

    // const { toolbarComponent: create = null } = route;
    // if (create !== null) {
    //   return (
    //     <>
    //       {create()}
    //     </>
    //   );
    // }

    return (
      <>
        {route &&
          <>
            {route.icon && route.icon()}
          </>
        }
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          {route ? <FormattedMessage id={route.title || ''} /> : ''}
        </Typography>
      </>
    );
  }

  render() {
    const { open } = this.state;
    const { classes, workflow: { incidents: { incidentCounter }, tasks: { taskCounter } }, } = this.props;

    const _t = this.props.intl.formatMessage;

    const unassigned = this.props.messages.helpdeskInbox.count;
    const unread = this.props.messages.userInbox.count;
    const total = unassigned + unread;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open[EnumSection.Drawer] && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => this.onDrawerOpen()}
              className={clsx(classes.menuButton, open[EnumSection.Drawer] && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.toolbarContent}>
              <Breadcrumb />
              <div>
                {taskCounter != null && taskCounter > 0 &&
                  <IconButton title="BPM Server Tasks" color="inherit" onClick={() => this.props.navigate(StaticRoutes.ProcessInstanceTaskManager)}>
                    <Badge overlap="rectangular" badgeContent={taskCounter} color="secondary">
                      <Icon path={mdiAccountWrenchOutline} size="1.5rem" />
                    </Badge>
                  </IconButton>
                }
                {incidentCounter != null && incidentCounter > 0 &&
                  <IconButton title="BPM Server Incidents" color="inherit" onClick={() => this.props.navigate(StaticRoutes.IncidentManager)}>
                    <Badge overlap="rectangular" badgeContent={incidentCounter} color="secondary">
                      <Icon path={mdiCogSyncOutline} size="1.5rem" />
                    </Badge>
                  </IconButton>
                }
                {this.props.location.pathname === StaticRoutes.Map &&
                  <IconButton
                    color="inherit"
                    onClick={() => this.onDrawerOpen(EnumSection.MapDrawer)}
                  >
                    <Icon path={mdiLayers} size="1.5rem" />
                  </IconButton>
                }
                <IconButton
                  edge="end"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={(e) => this.onMenuOpen(e)}
                  color="inherit"
                >
                  <Icon path={mdiMenu} size="1.5rem" />
                </IconButton>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        {this.renderMenu()}
        <Drawer
          ref={this.drawerRef}
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open[EnumSection.Drawer] && classes.drawerPaperClose),
          }}
          open={open[EnumSection.Drawer]}
        >
          <div className={clsx(classes.toolbarIcon, !open[EnumSection.Drawer] && classes.toolbarIconSmall)}>
            <img
              className={classes.toolbarImage}
              src={open[EnumSection.Drawer] ? '/images/logo-black.svg' : '/images/logo-black-sm.svg'}
              alt=""
            />
            {open[EnumSection.Drawer] &&
              <IconButton onClick={() => this.onDrawerClose()}>
                <ChevronLeftIcon />
              </IconButton>
            }
          </div>
          <Divider />
          <Grid container direction="column" className={classes.userContainer}>
            <Grid container item justifyContent="center">
              <Link to={StaticRoutes.Profile}>
                <Avatar alt={this.userName} src={this.avatar} variant="circular" className={classes.avatar} />
              </Link>
            </Grid>
            {open[EnumSection.Drawer] &&
              <Grid container item justifyContent="center">
                <Typography component="h6" color="inherit" noWrap className={classes.title} align="center">
                  {this.userName}
                </Typography>
              </Grid>
            }
          </Grid>
          <Divider light />
          <PerfectScrollbar className={classes.menuListWrapper}>
            <List>
              <div>
                <ListItem button
                  onClick={(e) => this.onNavigate(e, StaticRoutes.Dashboard)}>
                  <ListItemIcon>
                    <Icon path={mdiViewDashboardOutline} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.dashboard' })} />
                </ListItem>

                <ListItem button
                  onClick={(e) => this.onNavigate(e, StaticRoutes.Analytics)}>
                  <ListItemIcon>
                    <Icon path={mdiChartBarStacked} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.analytics' })} />
                </ListItem>

                <ListItem button
                  onClick={(e) => this.onNavigate(e, StaticRoutes.ContractManager)}>
                  <ListItemIcon>
                    <Icon path={mdiSignatureFreehand} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.contract.master.title' })} />
                </ListItem>

                <ListItem button
                  onClick={(e) => this.onNavigate(e, StaticRoutes.ConsumerManager)}>
                  <ListItemIcon>
                    <Icon path={mdiFaceAgent} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.consumer-manager' })} />
                </ListItem>

                <ListItem button
                  onClick={(e) => this.onNavigate(e, StaticRoutes.ProviderManager)}>
                  <ListItemIcon>
                    <Icon path={mdiHandshakeOutline} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.provider-manager' })} />
                </ListItem>

                <ListItem button
                  onClick={(e) => this.onNavigate(e, StaticRoutes.DraftManager)}>
                  <ListItemIcon>
                    <Icon path={mdiTextBoxCheckOutline} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.draft-manager' })} />
                </ListItem>

                <ListItem button onClick={() => this.onSectionToggle(EnumSection.Billing)}>
                  <ListItemIcon>
                    <Icon path={mdiFinance} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.orders-billing' })} />
                  {open[EnumSection.Billing] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={open[EnumSection.Billing]} timeout="auto" unmountOnExit className={classes.collapse}>
                  <List component="div" disablePadding className={open[EnumSection.Drawer] ? '' : classes.childMenu}>

                    <ListItem button
                      className={open[EnumSection.Drawer] ? classes.nested : ''}
                      onClick={(e) => this.onNavigate(e, StaticRoutes.OrderManager)}>
                      <ListItemIcon>
                        <Icon path={mdiPackageVariantClosed} size="1.5rem" />
                      </ListItemIcon>
                      <ListItemText primary={_t({ id: 'links.order-manager' })} />
                    </ListItem>

                    <ListItem button
                      className={open[EnumSection.Drawer] ? classes.nested : ''}
                      onClick={(e) => this.onNavigate(e, StaticRoutes.PayInManager)}>
                      <ListItemIcon>
                        <Icon path={mdiBankTransferIn} size="1.5rem" />
                      </ListItemIcon>
                      <ListItemText primary={_t({ id: 'links.payin-manager' })} />
                    </ListItem>

                    <ListItem button
                      className={open[EnumSection.Drawer] ? classes.nested : ''}
                      onClick={(e) => this.onNavigate(e, StaticRoutes.TransferManager)}>
                      <ListItemIcon>
                        <Icon path={mdiWalletOutline} size="1.5rem" />
                      </ListItemIcon>
                      <ListItemText primary={_t({ id: 'links.transfer-manager' })} />
                    </ListItem>

                    <ListItem button
                      className={open[EnumSection.Drawer] ? classes.nested : ''}
                      onClick={(e) => this.onNavigate(e, StaticRoutes.PayOutManager)}>
                      <ListItemIcon>
                        <Icon path={mdiBankTransferOut} size="1.5rem" />
                      </ListItemIcon>
                      <ListItemText primary={_t({ id: 'links.payout-manager' })} />
                    </ListItem>

                  </List>
                </Collapse>

                <ListItem button onClick={() => this.onSectionToggle(EnumSection.Message)}>
                  <ListItemIcon>
                    <Badge
                      overlap="rectangular"
                      badgeContent={total}
                      color={unassigned === 0 ? "primary" : "secondary"}
                      invisible={total === 0 || open[EnumSection.Message]}
                    >
                      <Icon path={mdiForumOutline} size="1.5rem" />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.message-inbox' })} />
                  {open[EnumSection.Message] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={open[EnumSection.Message]} timeout="auto" unmountOnExit className={classes.collapse}>
                  <List component="div" disablePadding className={open[EnumSection.Drawer] ? '' : classes.childMenu}>

                    <ListItem button
                      onClick={(e) => this.onNavigate(e, StaticRoutes.MessageInboxHelpdesk)}>
                      <ListItemIcon>
                        <Badge overlap="rectangular" badgeContent={unassigned} color="secondary" invisible={unassigned === 0 || !open[EnumSection.Message]}>
                          <Icon path={mdiTrayFull} size="1.5rem" />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText primary={_t({ id: 'links.message-inbox-helpdesk' })} />
                    </ListItem>

                    <ListItem button
                      onClick={(e) => this.onNavigate(e, StaticRoutes.MessageInboxUser)}>
                      <ListItemIcon>
                        <Badge overlap="rectangular" badgeContent={unread} color="primary" invisible={unread === 0 || !open[EnumSection.Message]}>
                          <Icon path={mdiTray} size="1.5rem" />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText primary={_t({ id: 'links.message-inbox-user' })} />
                    </ListItem>

                  </List>
                </Collapse>

                <ListItem button
                  onClick={(e) => this.onNavigate(e, StaticRoutes.Map)}>
                  <ListItemIcon>
                    <Icon path={mdiMapOutline} size="1.5rem" />
                  </ListItemIcon>
                  <ListItemText primary={_t({ id: 'links.map' })} />
                </ListItem>

                <SecureContent roles={[EnumRole.ADMIN]}>
                  <>
                    <ListItem button onClick={() => this.onSectionToggle(EnumSection.Admin)}>
                      <ListItemIcon>
                        <Icon path={mdiTools} size="1.5rem" />
                      </ListItemIcon>
                      <ListItemText primary={_t({ id: 'links.admin' })} />
                      {open[EnumSection.Admin] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>

                    <Collapse in={open[EnumSection.Admin]} timeout="auto" unmountOnExit className={classes.collapse}>
                      <List component="div" disablePadding className={open[EnumSection.Drawer] ? '' : classes.childMenu}>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.ProcessInstanceManager)}>
                            <ListItemIcon>
                              <Icon path={mdiCogSyncOutline} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: 'links.workflow.process-instance.manager.runtime' })} />
                          </ListItem>
                        </SecureContent>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.ProcessInstanceHistoryManager)}>
                            <ListItemIcon>
                              <Icon path={mdiCogClockwise} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: 'links.workflow.process-instance.manager.history' })} />
                          </ListItem>
                        </SecureContent>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.ProcessInstanceTaskManager)}>
                            <ListItemIcon>
                              <Icon path={mdiAccountWrenchOutline} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: 'links.workflow.process-instance.manager.tasks' })} />
                          </ListItem>
                        </SecureContent>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.IncidentManager)}>
                            <ListItemIcon>
                              <Icon path={mdiBellAlertOutline} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: 'links.workflow.incident.manager' })} />
                          </ListItem>
                        </SecureContent>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.HelpdeskAccountManager)}>
                            <ListItemIcon>
                              <Icon path={mdiFaceAgent} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: routes[StaticRoutes.HelpdeskAccountManager].title })} />
                          </ListItem>
                        </SecureContent>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.MarketplaceAccountManager)}>
                            <ListItemIcon>
                              <Icon path={mdiAccountMultiple} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: routes[StaticRoutes.MarketplaceAccountManager].title })} />
                          </ListItem>
                        </SecureContent>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.EventManager)}>
                            <ListItemIcon>
                              <Icon path={mdiBugOutline} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: routes[StaticRoutes.EventManager].title })} />
                          </ListItem>
                        </SecureContent>

                        <SecureContent roles={[EnumRole.ADMIN]}>
                          <ListItem button
                            className={open[EnumSection.Drawer] ? classes.nested : ''}
                            onClick={(e) => this.onNavigate(e, StaticRoutes.SettingsManager)}>
                            <ListItemIcon>
                              <Icon path={mdiProgressWrench} size="1.5rem" />
                            </ListItemIcon>
                            <ListItemText primary={_t({ id: routes[StaticRoutes.SettingsManager].title })} />
                          </ListItem>
                        </SecureContent>

                      </List>
                    </Collapse>
                  </>
                </SecureContent>
              </div>
            </List>
          </PerfectScrollbar>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <PerfectScrollbar className={classes.outletContainerWrapper}>
            <Container maxWidth={false} className={classes.container}>
              <Outlet />
            </Container>
          </PerfectScrollbar>
        </main>
        <Drawer
          anchor={'right'}
          open={open[EnumSection.MapDrawer]}
          classes={{
            paper: clsx(classes.mapDrawerPaper, !open[EnumSection.Drawer] && classes.drawerPaperClose),
          }}
          onClose={() => this.onDrawerClose(EnumSection.MapDrawer)}
        >
          <MapViewerConfigComponent />
        </Drawer>
      </div >
    );
  }
}

const mapState = (state: RootState) => ({
  profile: state.security.profile,
  workflow: state.workflow,
  messages: state.message,
});

const mapDispatch = {
  logout: () => logout(),
  countIncidents: () => countIncidents(),
  countTasks: () => countTasks(),
  countProcessInstances: () => countProcessInstances(),
  countUnassignedMessages: () => countUnassignedMessages(),
  countNewMessages: () => countNewMessages(),
};

const connector = connect(
  mapState,
  mapDispatch,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

// Apply styles
const styledComponent = withStyles(styles)(Home);

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
