import _ from 'lodash';
import moment, { Moment } from 'moment';
import React from 'react';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import { grey, red } from '@material-ui/core/colors';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
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
  mdiVariable,
} from '@mdi/js';

// Service
import { BpmVariable } from 'model/bpm-process-instance';

// Helper methods
import { copyToClipboard } from 'utils/clipboard';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: red[500],
  },
  card: {
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  listItem: {
    alignItems: 'flex-start',
    padding: theme.spacing(1, 0),
  },
  listAvatar: {
    paddingTop: theme.spacing(1),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  variablesList: {
    overflowY: 'scroll',
    maxHeight: '400px',
  },
  secondaryAction: {
    top: theme.spacing(3),
  },
  text: {
    marginRight: theme.spacing(6),
    wordBreak: 'break-word',
  },
  errorDetailsTitle: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  null: {
    background: grey[700],
    color: '#ffffff',
    padding: theme.spacing(0.5),
    margin: theme.spacing(0.5, 0),
    borderRadius: theme.spacing(0.5),
  }
});

interface ProcessInstanceVariablesProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  variables: BpmVariable[];
  exclude?: string[];
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

  copyValueToClipboard(value: string | number | boolean | Moment | null) {
    if (!value || typeof value === 'boolean') {
      return;
    }

    const copiedValue = moment.isMoment(value) ? value.toString() : typeof value === 'number' ? '' + value : value;

    copyToClipboard(copiedValue);
  }

  renderValue(v: BpmVariable) {
    if (moment.isMoment(v.value)) {
      return v.value!.toString();
    }

    return v.value;
  }

  renderVariableValue(v: BpmVariable) {
    const { classes } = this.props;

    switch (v.name) {
      case 'bpmnBusinessErrorDetails': {
        const details = (v.value as string)?.split('||') || null;
        return (
          <ListItemText className={classes.text} primary={v.name}
            secondary={details.map((text, index) => (
              <span key={`detail-line-${index}`} className={classes.errorDetailsTitle}>
                {text}
              </span>
            ))}
          >
          </ListItemText>
        );
      }
    }
    return (
      <ListItemText className={classes.text} primary={v.name} secondary={v.value ? this.renderValue(v) : ''} />
    );
  }

  render() {
    const _t = this.props.intl.formatMessage;
    const { classes, variables = [], exclude = [] } = this.props;

    const sortedVariables = _.uniqBy(variables, 'name')
      .filter(v => ![...exclude, 'startUserKey'].includes(v.name))
      .sort((v1, v2) => v1.name >= v2.name ? 1 : -1);

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon path={mdiVariable} size="1.5rem" />
            </Avatar>
          }
          title={_t({ id: 'workflow.instance.variables.title' }, { count: sortedVariables.length })}
        ></CardHeader>
        <CardContent>
          <PerfectScrollbar className={classes.variablesList}>
            <List disablePadding>
              {sortedVariables.map((v) => {
                const value = v.value;

                return (
                  <div key={`variable-${v.name}`}>
                    <ListItem className={classes.listItem}>
                      <ListItemAvatar className={classes.listAvatar}>
                        <Avatar className={classes.small}>
                          {this.mapVariableTypeToIcon(v.type)}
                        </Avatar>
                      </ListItemAvatar>
                      {typeof value === 'boolean' &&
                        <ListItemText primary={v.name} secondary={value === true ? 'True' : 'False'} />
                      }
                      {typeof value !== 'boolean' && !v.value &&
                        <ListItemText primary={v.name} secondary={
                          <span className={classes.null}>null</span>
                        } />
                      }
                      {typeof value !== 'boolean' && v.value &&
                        this.renderVariableValue(v)
                      }
                      <ListItemSecondaryAction className={classes.secondaryAction}>
                        <IconButton edge="end" aria-label="delete" onClick={() => this.copyValueToClipboard(v.value)}>
                          <Icon path={mdiContentCopy} size="1.2rem" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </PerfectScrollbar>
          <input type="text" id="copy-to-clipboard" defaultValue="" style={{ position: 'absolute', left: -1000 }} />
        </CardContent>
      </Card>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(ProcessInstanceVariables);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default localizedComponent;
