/**
 * @module examples.main
 */
import OLCesium from 'olcs/OLCesium.js';
import MVTImageryProvider from 'olcs/MVTImageryProvider.js';

import olMap from 'ol/Map.js';
import './_proj21781.js';
import TileLayer from 'ol/layer/Tile.js';
import {get as getProjection} from 'ol/proj.js';
import View from 'ol/View.js';
import MVT from 'ol/format/MVT.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import OSMSource from 'ol/source/OSM.js';

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyNzUyYi0zY2QxLTQxZDItODRkOS1hNTA3MDU3ZTBiMDUiLCJpZCI6MjU0MSwiaWF0IjoxNTMzNjI1MTYwfQ.oHn1SUWJa12esu7XUUtEoc1BbEbuZpRocLetw6M6_AA';

const projection = getProjection('EPSG:3857');
console.assert(projection);

function createMVTStyle() {
  return [
    new Style({
      stroke: new Stroke({
        color: 'purple',
        width: 4
      })
    })
  ];
}


function createMVTLayer(url, maxZoom) {
  const source = new VectorTileSource({
    url,
    format: new MVT(),
  });
  const swissExtentDegrees = [5.2, 45.45, 11, 48];
  source.set('olcs.provider', new MVTImageryProvider({
    credit: new Cesium.Credit('Schweizmobil', false),
    urls: [url],
    rectangle: new Cesium.Rectangle(...swissExtentDegrees.map(Cesium.Math.toRadians)),
    minimumLevel: 6,
  }));
  return new VectorTileLayer({
    source,
    opacity: 0.6,
    style: createMVTStyle()
  });
}

export const mvtLayer = createMVTLayer(
    'https://map.dev.schweizmobil-hosting.ch/api/4/mvt_routes/3857/{z}/{x}/{y}.pbf?olcs',
    20);

const ol2d = new olMap({
  layers: [
    new TileLayer({source: new OSMSource()}),
    mvtLayer
  ],
  target: 'map',
  view: new View()
});

const ol3d = new OLCesium({
  map: ol2d,
});
ol3d.getCesiumScene();
ol3d.setEnabled(false);

const EXTENT = [572215, 5684416, 1277662, 6145307];
const padding = -50000;
ol2d.getView().fit([
  EXTENT[0] - padding, EXTENT[1] - padding,
  EXTENT[2] + padding, EXTENT[3] + padding,
]);


document.getElementById('enable').addEventListener('click', () => ol3d.setEnabled(!ol3d.getEnabled()));
