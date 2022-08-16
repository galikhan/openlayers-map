import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Map, View, Overlay, Feature } from 'ol';
import MapProperty from 'ol/MapProperty';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import * as olProj from 'ol/proj';
import Control from 'ol/control/Control';
import { Circle, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Text, Fill } from 'ol/style';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import IconOrigin from 'ol/style/IconOrigin';
import EventType from 'ol/render/EventType';

// import BingMaps from 'ol/source/BingMaps';
// import BingMaps from 'ol/source/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {


  @ViewChild('marker') htmlElement: ElementRef<HTMLInputElement>;
  @ViewChild('control') controlElement: ElementRef<HTMLInputElement>;

  title = 'openlayers-map';
  map: Map;
  alarmIconStyle;


  ngAfterViewInit(): void {

    const feature = new Feature({
      // geometry: new Circle([12127398.797692968, 4063894.123105166], 50)
      geometry: new Point([12127398.797692968, 4063894.123105166], 50)
    });

    this.alarmIconStyle = new Style({
      image: new Icon(({
        anchor: [1.2, 30],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        offset: [0, 0],
        offsetOrigin: IconOrigin.BOTTOM_LEFT,
        src: '../assets/red_circle.png',
        imgSize: [24, 24],
      }))
    });

    feature.setStyle(this.alarmIconStyle);
    const view = new View({
      center: [12127398.797692968, 4063894.123105166],
      zoom: 19,
      // rotation: 2
    });


    this.map = new Map({
      view,
      target: 'ol-map',
    });
    this.map.addChangeListener(MapProperty.VIEW, () => { console.log('sf'); });

    this.map.getView().addEventListener('click', () => { console.log('sf'); });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature]
      }),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });


    this.map.setLayers([
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer
    ]);


    this.map.getView().addEventListener('change', () => {
      console.log('simply');
      feature.setStyle(this.updateStyle(this.map.getView().getResolution()));

    });

    // vl.setStyle(this.updateStyle(this.map.getView().getResolution()));


    const pos = olProj.fromLonLat([16.3725, 48.208889]);

    const marker = new Overlay({
      position: pos,
      positioning: 'center-center',
      element: this.htmlElement.nativeElement,
      stopEvent: false
    });

    const control = new Control({
      element: this.controlElement.nativeElement,
    });
    this.map.addControl(control);

    this.map.addOverlay(marker);

  }

  updateStyle(resolution): Style {
    const vall = this.map.getView().getResolutionForZoom(3) / resolution;
// 
    return new Style({
      image: new Icon(({
        anchor: [1.2, 30],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        offset: [0, 0],
        offsetOrigin: IconOrigin.BOTTOM_LEFT,
        src: '../assets/red_circle.png',
        imgSize: [24, 24],
        scale: vall
      }))
    });

    // console.log('vall', vall);
    // this.alarmIconStyle.getImage().setScale(vall);
    // return this.alarmIconStyle;


  }


  ngOnInit(): void {

  }


}
