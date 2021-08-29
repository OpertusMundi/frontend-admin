import { Moment } from 'moment';

import { Api } from 'utils/api';

import { AxiosObjectResponse, ObjectResponse } from 'model/response';
import { SalesQuery, DataSeries, AssetQuery } from 'model/analytics';

export default class AnalyticsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Executes a query on sales data and returns a single data series.
   *
   * Role ROLE_PROVIDER is required.
   *
   * @param query Query to execute
   * @returns
   *
   * @example
   * executeSalesQuery({
   *   "time": {
   *     "unit": "WEEK",
   *     "min": "2021-01-01",
   *     "max": "2021-12-31"
   *   },
   *   "areas": {
   *     "enabled": true
   *   },
   *   "metric": "COUNT_TRANSACTIONS"
   * });
   *
   * // Returns data grouped by date and area. Date instances will
   * // contain only year and week properties.
   *
   * {
   *   "messages": [],
   *   "result": {
   *     "timeUnit": "WEEK",
   *     "points": [{
   *       "time": {
   *         "year": 2021,
   *         "month": 5,
   *         "week": 21
   *       },
   *       "location": {
   *         "code": "GR",
   *         "lon": null,
   *         "lat": null
   *       },
   *       "value": 2
   *     }]
   *   },
   *   "success": true
   * }
   */
  public async executeSalesQuery(query: SalesQuery): Promise<ObjectResponse<DataSeries>> {
    const url = '/action/analytics/sales';

    const { time = { unit: null, min: null, max: null } } = query;

    return this.post<any, ObjectResponse<DataSeries>>(url, {
      ...query,
      time: {
        unit: time?.unit || null,
        min: time?.min ? (time!.min as Moment).format('YYYY-MM-DD') : null,
        max: time?.max ? (time!.max as Moment).format('YYYY-MM-DD') : null,
      }
    }).then((response: AxiosObjectResponse<DataSeries>) => {
      const { data } = response;

      return data;
    });
  }

  public async executeAssetQuery(query: AssetQuery): Promise<ObjectResponse<DataSeries>> {
    const url = '/action/analytics/assets';

    const { time = { unit: null, min: null, max: null } } = query;

    return this.post<any, ObjectResponse<DataSeries>>(url, {
      ...query,
      time: {
        unit: time?.unit || null,
        min: time?.min ? (time!.min as Moment).format('YYYY-MM-DD') : null,
        max: time?.max ? (time!.max as Moment).format('YYYY-MM-DD') : null,
      }
    }).then((response: AxiosObjectResponse<DataSeries>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Helper method for converting a data series to a feature collection
   * @param data
   * @returns
   */
  public toFeatureCollections(data: DataSeries): GeoJSON.FeatureCollection<GeoJSON.Point, { id: number, label: string, value: number }> {
    const result: GeoJSON.FeatureCollection<GeoJSON.Point, { id: number, label: string, value: number }> = {
      type: 'FeatureCollection',
      features: [],
    };

    data?.points.forEach((p, index) => {
      if (p.location?.lon && p.location?.lat && p.location?.code) {
        result.features.push({
          id: index,
          type: 'Feature',
          geometry: {
            type: "Point",
            coordinates: [p.location.lon, p.location.lat],
          },
          properties: {
            id: index,
            label: p.location?.code,
            value: p.value,
          }
        });
      }
    });

    return result;
  }
}