import _ from 'lodash';
import React from 'react';

// Components
import { injectIntl, IntlShape } from 'react-intl';

import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import ReactECharts from 'echarts-for-react';

// Model
import { EnumTemporalUnit, TimeInstant, DataSeries, DataPoint } from 'model/analytics';

const currencyFormatter = (value: number): string => {
  if (value < 1000) {
    return `${value}`;
  } else if (value < 1000000) {
    return `${(value / 1000).toFixed(0)} K`;
  } else {
    return `{(value / 1000000).toFixed(0)} M`
  }
};

const styles = (theme: Theme) => createStyles({
  root: {
    padding: 5,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chartContainer: {
    height: 'calc(70vh) !important',
  },
});

interface ChartAreaProps extends WithStyles<typeof styles> {
  data: DataSeries | null;
  intl: IntlShape,
}

class ChartArea extends React.Component<ChartAreaProps> {

  timeToString(time: TimeInstant, timeUnit?: EnumTemporalUnit): string {
    const _fm = this.props.intl.formatMessage;

    switch (timeUnit) {
      case EnumTemporalUnit.YEAR:
        return `${time.year}`;
      case EnumTemporalUnit.MONTH:
        return `${time.year} ${_fm({ id: `enum.month.${time.month}` })}`;
      case EnumTemporalUnit.WEEK:
        return `${time.year} W${time.week}`;
      default:
        return `${time.day}/${time.month}/${time.year}`;
    }
  }

  getYAxis(points: DataPoint[], timeUnit?: EnumTemporalUnit): string[] {
    const _fm = this.props.intl.formatMessage;

    if (points.length === 0) {
      return [];
    }

    const time = !!points[0].time;
    const segment = !!points[0].segment;
    const location = !!points[0].location;

    if (time) {
      return _.uniq(points.map((p) => this.timeToString(p.time!, timeUnit)));
    } else if (segment) {
      return _.uniq(points.map((p) => _fm({ id: `enum.category-topic.${p.segment}` })));
    } else if (location) {
      return _.uniq(points.map((p) => p.location!.code));
    }

    return ['All'];
  }

  getSeries(points: DataPoint[], timeUnit?: EnumTemporalUnit): any {
    const _fm = this.props.intl.formatMessage;
    const _fn = this.props.intl.formatNumber;

    if (points.length === 0) {
      return [{
        type: 'bar',
        data: [],
      }];
    }

    const time = !!points[0].time;
    const location = !!points[0].location;
    const segment = !!points[0].segment;

    const dimensions = (time ? 1 : 0) + (location ? 1 : 0) + (segment ? 1 : 0);

    const result: any = [];

    const labelFormatter = (params: any): string => {
      const p = params.data as DataPoint;

      const time = !!p.time;
      const location = !!p.location;
      const segment = !!p.segment;

      const dimensions = (time ? 1 : 0) + (location ? 1 : 0) + (segment ? 1 : 0);

      switch (dimensions) {
        case 3:
          return currencyFormatter(p.value);
        case 2:
          if (time) {
            if (location) {
              return `${p.location!.code} ${_fn(p.value, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' })}`;
            } else {
              return `${_fm({ id: `enum.category-topic.${p.segment}` })} ${_fn(p.value, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' })}`;
            }
          } else {
            return `${p.location!.code} ${_fn(p.value, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' })}`;
          }

        default:
          return _fn(p.value, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' });

      }
    }

    points.forEach((p) => {
      switch (dimensions) {
        case 3: {
          const stack = `${p.location!.code}`;
          const name = `${p.location!.code}-${p.segment!}`;

          let series = result.find((s: any) => s.name === name && s.stack === stack) || null;

          if (!series) {
            series = {
              name,
              type: 'bar',
              stack,
              data: [p],
              label: {
                show: true,
                formatter: labelFormatter,
              },
            }
            result.push(series);
          } else {
            series.data.push(p);
          }
          break;
        }

        case 2: {
          if (time) {
            if (location) {
              let series = result.find((s: any) => s.name === p.location!.code!) || null;
              if (!series) {
                series = {
                  name: p.location!.code,
                  type: 'bar',
                  data: [p],
                  label: {
                    show: true,
                    formatter: labelFormatter,
                  },
                }
                result.push(series);
              } else {
                series.data.push(p);
              }
            } else {
              let series = result.find((s: any) => s.name === p.segment!) || null;
              if (!series) {
                series = {
                  name: p.segment!,
                  type: 'bar',
                  data: [p],
                  label: {
                    show: true,
                    formatter: labelFormatter,
                  },
                }
                result.push(series);
              } else {
                series.data.push(p);
              }
            }
          } else {
            let series = result.find((s: any) => s.name === p.location!.code) || null;
            if (!series) {
              series = {
                name: p.location!.code,
                type: 'bar',
                stack: p.segment!,
                data: [p],
                label: {
                  show: true,
                  formatter: labelFormatter,
                },
              }
              result.push(series);
            } else {
              series.data.push(p);
            }
          }
          break;
        }
      }
    });

    if (dimensions < 2) {
      return [{
        type: 'bar',
        data: points.map((p) => p),
        label: {
          show: true,
          formatter: labelFormatter,
        },
      }];
    }

    return result;
  }

  getOptions() {
    const { data } = this.props;
    const _fm = this.props.intl.formatMessage;
    const _fn = this.props.intl.formatNumber;

    if (!data) {
      return null;
    }
    const { points, timeUnit } = data;

    const yAxis = this.getYAxis(points, timeUnit);

    const series = this.getSeries(points, timeUnit);

    return {
      title: {
        show: false,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any, a: any) => {
          const p = params.data as DataPoint;
          const lines: string[] = [];

          lines.push('<div style="display: flex; flex-direction: column;"/>')
          if (p.time) {
            lines.push(`<p style="margin: 4px;">${this.timeToString(p.time!, timeUnit)}`)
          }
          if (p.location) {
            lines.push(`<p style="margin: 4px;">${p.location!.code}</p>`)
          }
          if (p.segment) {
            lines.push(`<p style="margin: 4px;">${_fm({ id: `enum.category-topic.${p.segment}` })}</p>`)
          }
          lines.push(`
            <div style="display: flex; align-items: center ;">
              <div style="display: flex; color: ${params.color}; font-size: 1.5rem;">&#x25CF;</div>
              <div style="display: flex; margin-top: 4px;">${_fn(p.value, { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' })}</div>
            </div>`
          );

          lines.push('</div>');

          return lines.join('');
        },
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
        data: yAxis,
      },
      series,
    };
  }

  render() {
    const { classes } = this.props;
    const options = this.getOptions();

    return options ?
      <ReactECharts option={options} className={classes.chartContainer} />
      :
      null;
  }
}

// Apply styles
const styledComponent = withStyles(styles)(ChartArea);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;