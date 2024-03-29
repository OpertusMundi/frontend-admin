
import * as React from 'react';

import Map from 'ol/Map';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Collection from 'ol/Collection';
import Draw, { DrawEvent } from 'ol/interaction/Draw';

import { Type as GeometryType } from 'ol/geom/Geometry';
import { StyleLike } from 'ol/style/Style';

interface DrawProps {
  // Enable/Disable interaction
  active?: boolean;
  // Map instance
  map?: Map;
  // Allow drawing only a single feature
  single?: boolean;
  // Geometry type
  type: GeometryType;
  // Event handlers
  onDrawStart?: (feature: Feature<Geometry>) => void;
  onDrawEnd?: (feature: Feature<Geometry>) => void;
  // Style
  style?: StyleLike;
}

/**
 * Draw interaction
 *
 * @class DrawInteraction
 * @extends {React.Component}
 */
class DrawInteraction extends React.Component<DrawProps> {

  private interaction: Draw | undefined;

  // Feature collection for the OpenLayers Draw interaction
  private features = new Collection<Feature<Geometry>>();

  static defaultProps = {
    active: true,
    single: true,
    type: 'Polygon'
  }

  createInteraction(type: GeometryType, active: boolean) {
    const { map = null, onDrawEnd, onDrawStart, single, style } = this.props;

    this.removeInteraction();

    this.interaction = new Draw({
      features: this.features,
      type,
      style,
    });

    this.interaction.on('drawstart', (e: DrawEvent) => {
      if (single) {
        this.features.clear();
      }
      if (typeof onDrawStart === 'function') {
        onDrawStart(e.feature);
      }
    });

    this.interaction.on('drawend', (e: DrawEvent) => {
      if (e.feature) {
        this.features.push(e.feature);
      }
      if (typeof onDrawEnd === 'function') {
        onDrawEnd(e.feature);
      }
    });

    if (map) {
      this.interaction.setActive(active);
      map.addInteraction(this.interaction);
    }
  }

  removeInteraction() {
    const { map } = this.props;

    if (map) {
      if (this.interaction) {
        map.removeInteraction(this.interaction);
      }
      this.interaction = undefined;
    }
  }

  componentDidMount() {
    const { active = true, map, type } = this.props;

    // Wait for map instance to initialize
    if (!map) {
      return;
    }

    this.createInteraction(type || 'Polygon', active);
  }

  componentDidUpdate(prevProps: DrawProps) {
    const {
      active: currActive = true,
      type: currType = 'Polygon',
    } = this.props;

    const {
      active: prevActive = true,
      type: prevType = 'Polygon',
    } = prevProps;

    if (currActive !== prevActive) {
      this.interaction?.setActive(currActive);
    }
    if (currType !== prevType) {
      this.createInteraction(currType, currActive);
    }
  }

  componentWillUnmount() {
    this.removeInteraction();

    this.features.clear();
  }

  render() {
    return null;
  }

}

export default DrawInteraction;
