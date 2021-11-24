import { EnumHelpdeskRole as EnumRole } from 'model/role';
import { ErrorPages, Pages } from 'model/routes';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Outlet, Navigate, RouteProps } from 'react-router-dom';
import { RootState } from 'store';

interface SecureRouteProps extends PropsFromRedux, RouteProps {
  roles: EnumRole[];
}

class SecureRoute extends React.Component<SecureRouteProps> {

  static defaultProps = {
    roles: [],
  }

  hasAnyRole(roles: EnumRole[] = []) {
    if ((!roles) || (roles.length === 0)) {
      return false;
    }

    const profile = this.props.profile;
    if (!profile) {
      return false;
    }

    for (let role of roles) {
      if (profile.roles.indexOf(role) !== -1) {
        return true;
      }
    }
    return false;
  }

  render() {
    let { roles, profile } = this.props;
    let authenticated = (profile != null);
    if (!authenticated) {
      return (
        <Navigate to={Pages.Login} />
      );
    }
    return this.hasAnyRole(roles) ? <Outlet /> : <Navigate to={ErrorPages.Forbidden} />;
  }
}

//
// Wrap into a connected component
//

const mapState = (state: RootState) => ({
  profile: state.security.profile,
});

const connector = connect(
  mapState,
);

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(SecureRoute);
