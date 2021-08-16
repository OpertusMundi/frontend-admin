import * as React from 'react';

import OpenLayersMap from 'ol/Map';

import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';

import { Heatmap as HeatmapLayer } from 'ol/layer';

import { FeatureCollection } from 'geojson';

type FeatureLike = null | string | FeatureCollection | Feature<Geometry> | Feature<Geometry>[] | Collection<Feature<Geometry>>;

interface HeatMapLayerProps {
  blur?: number;
  radius?: number;
  features: FeatureLike;
  index?: number;
  map?: OpenLayersMap;
}

/**
 * Heatmap layer
 *
 * @class HeatMapLayer
 * @extends {React.Component}
 */
class HeatMapLayer extends React.Component<HeatMapLayerProps> {

  private _layer: HeatmapLayer | undefined;

  static defaultProps = {
    blur: 15,
    radius: 5,
  }


  get map(): OpenLayersMap | undefined {
    return this.props.map;
  }

  get layer(): HeatmapLayer | undefined {
    return this._layer;
  }

  parseFeatures(features: FeatureLike) {
    if (!this._layer) {
      return;
    }

    const source = this._layer.getSource();
    source.clear();

    if (!features) {
      return;
    }

    if (features instanceof Feature) {
      // Add a single OpenLayers feature
      source.addFeature(features);
    } else if (Array.isArray(features)) {
      // Add an array of OpenLayers features
      source.addFeatures(features);
    } else if (features instanceof Collection) {
      // Add an array of OpenLayers features
      source.addFeatures(features.getArray());
    } else if (typeof features === 'string' || typeof features === 'object') {
      // Parse a JSON string or a GeoJSON object
      const format = new GeoJSON();
      source.addFeatures(format.readFeatures(features, {
        featureProjection: 'EPSG:3857',
      }));
    }
  }

  componentDidMount() {
    const { index = 0, map = null, features, blur = 15, radius = 5 } = this.props;

    if (map) {
      const source = new VectorSource();

      this._layer = new HeatmapLayer({
        source,
        blur,
        radius,
        weight: function (feature) {
          const value = feature.get('value');

          return value;
        },
      });

      this.parseFeatures(features);

      map.getLayers().insertAt(index, this._layer);
    }
  }

  componentDidUpdate(prevProps: HeatMapLayerProps) {
    const currProps = this.props;
    if (currProps.features !== prevProps.features) {
      this.parseFeatures(currProps.features);
    }
  }

  componentWillUnmount() {
    if ((this.props.map) && (this._layer)) {
      this.props.map.removeLayer(this._layer);

      delete this._layer;
    }
  }

  render() {
    return null;
  }

}

export default HeatMapLayer;
