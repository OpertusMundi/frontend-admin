import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';

// Store
import { RootState } from 'store';

// Material UI
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import { red, blue } from '@material-ui/core/colors';

// Icons
import Icon from '@mdi/react';
import {
  mdiMapOutline,
  mdiShapeOutline,
} from '@mdi/js';

// Components
import ReactECharts from 'echarts-for-react';

import OpenLayers from 'components/map';

// Services
import AnalyticsApi from 'service/analytics';

// Model
import { EnumSalesQueryMetric, SalesQuery, DataSeries } from 'model/analytics';

const styles = (theme: Theme) => createStyles({
  container: {
    padding: 8,
  },
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: 0,
    margin: theme.spacing(2),
  },
  mapContainer: {
    height: 'calc(50vh)',
    width: 'calc(100%)',
  },
  chartContainer: {
    height: 'calc(60vh) !important',
  },
  card: {
    minWidth: 480,
    borderRadius: 0,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  avatarRed: {
    backgroundColor: red[500],
  },
  avatarBlue: {
    backgroundColor: blue[500],
  }
});

interface DashboardComponentProps extends WithStyles<typeof styles>, PropsFromRedux {
  intl: IntlShape;
}

interface DashboardComponentState {
  features: GeoJSON.FeatureCollection | null;
  segments: DataSeries | null;
}

class DashboardComponent extends React.Component<DashboardComponentProps, DashboardComponentState> {

  analyticsApi: AnalyticsApi;

  constructor(props: DashboardComponentProps) {
    super(props);

    this.analyticsApi = new AnalyticsApi();

    this.state = {
      features: null,
      segments: null,
    };
  }

  componentDidMount() {
    const areaQuery: SalesQuery = {
      areas: {
        enabled: true,
      },
      metric: EnumSalesQueryMetric.SUM_SALES,
    };

    this.analyticsApi.executeSalesQuery(areaQuery)
      .then((response) => {
        if (response.success) {
          const features = this.analyticsApi.toFeatureCollections(response.result!);

          // Get min/max values
          let min = Number.MAX_SAFE_INTEGER, max = 0;
          features.features.forEach((f) => {
            const value = f.properties.value;
            min = value < min ? value : min;
            max = value > max ? value : max;
          });
          // Normalize values to range [0,1]
          features.features.forEach((f) => {
            const value = f.properties.value;

            f.properties.value = (value - min) / (max - min);
          });
          this.setState({
            features,
          });
        }
      });

    const segmentQuery: SalesQuery = {
      segments: {
        enabled: true,
      },
      metric: EnumSalesQueryMetric.SUM_SALES,
    };

    this.analyticsApi.executeSalesQuery(segmentQuery)
      .then((response) => {
        if (response.success) {
          response.result!.points.reverse();
          this.setState({
            segments: response.result!,
          });
        }
      });
  }

  getOptions() {
    const { segments } = this.state;
    const _fm = this.props.intl.formatMessage;
    const _fn = this.props.intl.formatNumber;

    if (!segments) {
      return null;
    }
    const name = 'Sales per segment';

    return {
      title: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          return _fn(
            Array.isArray(params) ? params[0].value : params.value,
            { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }
          );
        },
      },
      legend: {
        data: [name]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number, index: number) => {
            if (value < 1000) {
              return value;
            } else if (value < 1000000) {
              return `${value / 1000} K`;
            } else {
              return `${value / 1000000} M`
            }
          }
        }
      },
      yAxis: {
        type: 'category',
        data: segments.points.map((p) => _fm({ id: `enum.category-topic.${p.segment}` })),
      },
      series: [{
        name,
        type: 'bar',
        data: segments.points.map((p) => p.value),
      }]
    };
  }
  render() {
    const { classes, config } = this.props;
    const { features } = this.state;

    const options = this.getOptions();

    return (
      <Grid container spacing={2}>
        {features &&
          <Grid item xs={6}>
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatarRed}>
                    <Icon path={mdiMapOutline} size="1.5rem" />
                  </Avatar>
                }
                title={'Sales by Region'}
                subheader="Heatmap of total sales based on customer location"
              ></CardHeader>
              <Divider />
              <CardContent>
                <div className={classes.mapContainer}>
                  <OpenLayers.Map
                    center={[1522457.20, 6393383.34]}
                    maxZoom={19}
                    minZoom={3}
                    zoom={4}
                    height={'100%'}
                  >
                    <OpenLayers.Layers>
                      <OpenLayers.Layer.BingMaps
                        applicationKey={config.bingMaps?.applicationKey}
                        imagerySet={'Road'}
                      />
                      <OpenLayers.Layer.HeatMap
                        features={features}
                        blur={65}
                        radius={55}
                      />
                    </OpenLayers.Layers>
                  </OpenLayers.Map>
                </div>
              </CardContent>
            </Card>
          </Grid>
        }
        {options &&
          <Grid item xs={6}>
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatarBlue}>
                    <Icon path={mdiShapeOutline} size="1.5rem" />
                  </Avatar>
                }
                title={'Sales by Segment'}
                subheader="Bar chart with total sales business segment"
              ></CardHeader>
              <Divider />
              <CardContent>
                <ReactECharts option={options} className={classes.chartContainer} />
              </CardContent>
            </Card>
          </Grid>
        }
      </Grid>
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
const styledComponent = withStyles(styles)(DashboardComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

// Inject state
export default connector(localizedComponent);
