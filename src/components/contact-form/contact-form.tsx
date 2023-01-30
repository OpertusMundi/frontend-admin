import React from 'react';

// Utilities
import clsx from 'clsx';

// State, routing and localization
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

// Components
import { createStyles, Grid, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import { DateTime } from 'components/common';

// Icons
import Icon from '@mdi/react';
import {
  mdiCableData,
  mdiCardAccountMailOutline,
} from '@mdi/js';

// Model
import { ContactForm, EnumContactFormStatus, EnumContactFormType } from 'model/contact-form';

const styles = (theme: Theme) => createStyles({
  card: {
    margin: theme.spacing(1),
    borderRadius: 0,
    borderLeftWidth: theme.spacing(1),
    borderLeftColor: 'transparent',
    borderLeftStyle: 'solid',
    "&:hover": {
      borderLeftWidth: theme.spacing(1),
      borderLeftColor: theme.palette.primary.main,
      borderLeftStyle: 'solid',
      cursor: 'pointer',
    },
    width: 'calc(50% - 25px)',
  },
  cardHeader: {
    padding: theme.spacing(0.5, 2, 0, 1),
  },
  cardHeaderInner: {
    padding: theme.spacing(0),
  },
  cardContent: {
    padding: theme.spacing(1, 2, 1, 1),
    "&:last-child": {
      padding: theme.spacing(1, 2, 1, 1),
    },
  },
  chipAvatarIcon: {
    width: 16,
    color: '#ffffff',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  textUser: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '90%',
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  textBold: {
    fontWeight: 700,
  },
  selected: {
    background: 'rgb(232, 244, 253)',
  },
  icon: {
    marginTop: theme.spacing(2),
  },
});

interface ContactFormComponentProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  form: ContactForm;
  select?: (form: ContactForm) => void;
  selected: boolean;
}

class ContactFormComponent extends React.Component<ContactFormComponentProps> {

  static defaultProps = {
    selected: false,
  }

  renderTags() {
    const { classes, form: { status, type } } = this.props;

    return (
      <Grid container justifyContent={'flex-end'} spacing={1}>
        <Grid item>
          <Chip
            avatar={
              <Avatar>
                <Icon
                  path={type === EnumContactFormType.NONE ? mdiCardAccountMailOutline : mdiCableData}
                  className={classes.chipAvatarIcon}
                />
              </Avatar>
            }
            label={<FormattedMessage id={`enum.contact-form-type.${type}`} />}
            variant="outlined"
            color={'default'}
          />
        </Grid>
        <Grid item>
          <Chip
            label={<FormattedMessage id={`enum.contact-form-status.${status}`} />}
            variant="outlined"
            color={status === EnumContactFormStatus.COMPLETED ? 'primary' : 'secondary'}
          />
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes, form, selected } = this.props;
    const { email, firstName, lastName, message, createdAt } = form;
    const name = `${firstName} ${lastName}`;

    return (
      <Card
        className={clsx(classes.card, selected && classes.selected)}
        onClick={() => this.props.select ? this.props.select(form) : null}
      >
        <CardHeader
          className={classes.cardHeader}
          title={
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <CardHeader
                  className={classes.cardHeaderInner}
                  avatar={
                    <Avatar className={classes.avatar}>
                      {email.toUpperCase()[0]}
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="caption" color="textSecondary" component="p"
                      className={classes.textUser}
                    >
                      {email}
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="body2" color="textPrimary" component="p"
                      className={classes.textUser}
                    >
                      {name}
                    </Typography>
                  }
                />
              </Grid>
              <Grid container item xs={6} style={{ justifyContent: "flex-end" }}>
                <Grid item>
                  <Typography
                    variant="caption" color="textSecondary" component="p"
                    className={clsx(classes.text, classes.textBold)}
                  >
                    {<DateTime value={createdAt.toDate()} day='numeric' month='numeric' year='numeric' />}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          }
        />
        <CardContent className={classes.cardContent}>
          <Typography
            variant="body2" color="textSecondary" component="p"
            className={classes.text}
          >
            {message}
          </Typography>
          {this.renderTags()}
        </CardContent>
      </Card>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(ContactFormComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default localizedComponent;
