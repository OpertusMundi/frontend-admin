import React from 'react';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Utilities
import clsx from 'clsx';

const styles = (theme: Theme) => createStyles({
  spinner: {
    position: 'relative',
    top: '30%',
    margin: '100px auto',
    width: '70px',
    height: '60px',
    textAlign: 'center',
    fontSize: '10px',
    '& > div': {
      backgroundColor: '#1e88e5',
      height: '100%',
      width: '10px',
      display: 'inline-block',
      margin: '0px 2px',
      'animation': `$stretchDelay 1.2s infinite ${theme.transitions.easing.easeInOut}`,
    },
    '& .rect2': {
      animationDelay: '-1.1s',
    },
    '& .rect3': {
      animationDelay: '-1s',
    },
    '& .rect4': {
      animationDelay: '-0.9s',
    },
    '& .rect5': {
      animationDelay: '-0.8s',
    },
  },
  '@keyframes stretchDelay': {
    '0%': {
      transform: 'scaleY(0.4)',
      opacity: 0.5,
    },
    "40%": {
      transform: 'scaleY(0.4)',
      opacity: 0.7,
    },
    '100%': {
      transform: 'scaleY(0.4)',
      opacity: 0.9,
    },
    '20%': {
      transform: 'scaleY(1)',
      opacity: 1,
    }
  },
});

interface SpinnerProps extends WithStyles<typeof styles> {
  className?: string;
}


class Spinner extends React.Component<SpinnerProps> {

  render() {
    const { classes, className } = this.props;

    return (
      <div className={clsx(classes.spinner, className && className)}>
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
    );
  }
}

// Apply styles
const styledComponent = withStyles(styles)(Spinner);

export default styledComponent;