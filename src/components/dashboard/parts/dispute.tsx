import React from 'react';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Components
import ReactECharts from 'echarts-for-react';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import { blue } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiGavel,
} from '@mdi/js';

// Model
import { DisputeStatusGroup } from 'model/dashboard';

// Service
import OrderApi from 'service/order';

const styles = (theme: Theme) => createStyles({
  avatar: {
    backgroundColor: blue[500],
  },
  card: {
    minWidth: 480,
    maxWidth: 640,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  chartContainer: {
    height: 'calc(60vh) !important',
  },
});

interface DisputesProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  disputes?: DisputeStatusGroup[]
}

class DisputeStatus extends React.Component<DisputesProps> {

  api: OrderApi;

  constructor(props: DisputesProps) {
    super(props);

    this.api = new OrderApi();
  }

  getChartOptions() {
    const { disputes } = this.props;
    const _fm = this.props.intl.formatMessage;

    const data = disputes!.map(g => ({
      value: g.count,
      name: _fm({ id: `enum.dispute-status.${g.status}` }),
      label: {
        show: true,
      },
    }));

    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: _fm({ id: 'dashboard.charts.dispute.title' }),
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data,
        },
      ],
    };
  }

  render() {
    const { classes } = this.props;
    const _t = this.props.intl.formatMessage;

    const options = this.getChartOptions();

    return (
      <Grid container item xs={12} justifyContent="flex-start">
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <Icon path={mdiGavel} size="1.5rem" />
              </Avatar>
            }
            title={_t({ id: 'dashboard.parts.dispute.card-header' })}
          ></CardHeader>
          <CardContent>
            <ReactECharts option={options} className={classes.chartContainer} />
          </CardContent>
        </Card >
      </Grid >
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(DisputeStatus);

// Inject i18n resources
const LocalizedComponent = injectIntl(styledComponent);


export default LocalizedComponent;
