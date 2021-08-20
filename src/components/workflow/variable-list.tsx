import _ from 'lodash';
import React from 'react';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import PerfectScrollbar from 'react-perfect-scrollbar';

// Icons
import Icon from '@mdi/react';
import {
  mdiContentCopy,
  mdiNumeric,
  mdiText,
  mdiCheckboxMarkedOutline,
} from '@mdi/js';

// Service
import { BpmVariable } from 'model/bpm-process-instance';

const COPY = 'copy';

const styles = (theme: Theme) => createStyles({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  variablesList: {
    overflowY: 'scroll',
    maxHeight: '400px',
  },
});

interface ProcessInstanceVariablesProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  variables: BpmVariable[];
}

class ProcessInstanceVariables extends React.Component<ProcessInstanceVariablesProps> {

  mapVariableTypeToIcon(type: string) {
    switch (type.toLocaleLowerCase()) {
      case 'number':
      case 'numeric':
      case 'integer':
      case 'float':
      case 'long':
        return (
          <Icon path={mdiNumeric} size="1rem" />
        );
      case 'boolean':
        return (
          <Icon path={mdiCheckboxMarkedOutline} size="1rem" />
        );
    }
    return (
      <Icon path={mdiText} size="1rem" />
    );
  }

  copyValueToClipboard(value: string | number | boolean | null) {
    if (!value || typeof value === 'boolean') {
      return;
    }
    const element: HTMLInputElement = document.getElementById('copy-to-clipboard') as HTMLInputElement;

    if (element && document.queryCommandSupported(COPY)) {
      element.focus();
      element.value = typeof value === 'number' ? '' + value : value;
      element.select();
      document.execCommand(COPY);
    }
  }

  render() {
    const _t = this.props.intl.formatMessage;
    const { classes, variables = [] } = this.props;

    return (
      <>
        <PerfectScrollbar className={classes.variablesList}>
          <List disablePadding>
            {_.uniqBy(variables, 'name').filter(v => !['startUserKey'].includes(v.name)).sort().map((v) => {
              const value = v.value;

              return (
                <div key={`variable-${v.name}`}>
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar className={classes.small}>
                        {this.mapVariableTypeToIcon(v.type)}
                      </Avatar>
                    </ListItemAvatar>
                    {typeof value === 'boolean' &&
                      <ListItemText primary={v.name} secondary={value === true ? 'True' : 'False'} />
                    }
                    {typeof value !== 'boolean' &&
                      <ListItemText primary={v.name} secondary={value} />
                    }
                    {typeof value !== 'boolean' && v.value &&
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => this.copyValueToClipboard(v.value)}>
                          <Icon path={mdiContentCopy} size="1.2rem" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    }
                  </ListItem>
                </div>
              );
            })}
          </List>
        </PerfectScrollbar>
        <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
      </>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(ProcessInstanceVariables);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default localizedComponent;
