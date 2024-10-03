import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import "mapbox-gl-style-switcher/styles.css"
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';
import { MapEventType } from 'mapbox-gl';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss'
})
export class MapsComponent {
  map !: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  directions: any;
  markers: mapboxgl.Marker[] = []
  currentLocation!: mapboxgl.Marker
  mapMode: 1 | 2 = 1
  draw: typeof MapboxDraw

  constructor() { }

  ngOnInit() {
    mapboxgl.accessToken = environment.map.token;

    this.initilizeMap(this.lng, this.lat)

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.AttributionControl({
      customAttribution: '<a href="https://rajdipghosh.vercel.app/#contact" target="_blank">© Rajdip Ghosh</a>',
    }))

    // Create a new MapboxDirections instance
    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: {
        inputs: true,
        instructions: true,
        profileSwitcher: true,
      },
    });

    // Add the directions control to the map
    this.map.addControl(this.directions, 'top-left');
    const switcherControl: any = new MapboxStyleSwitcherControl()
    this.map.addControl(switcherControl);


    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon'
    });

    const updateArea = (e: any) => {
      const data = this.draw.getAll();
      console.log("Calling..", data)
      if (data.features.length > 0) {
        const area = turf.area(data);
        // Restrict the area to 2 decimal points.
        const rounded_area = Math.round(area * 100) / 100;
        alert(`Total calculated area : ${rounded_area}`)
      } else {
        if (e.type !== 'draw.delete')
          alert('Click the map to draw a polygon.');
      }
    }

    this.map.on('draw.create' as MapEventType, updateArea);
    this.map.on('draw.delete' as MapEventType, updateArea);
    this.map.on('draw.update' as MapEventType, updateArea);

  }

  initilizeMap(long: number, lat: number) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [long, lat],
      attributionControl: false
    });
  }

  locateMe() {
    navigator.geolocation.getCurrentPosition((location: GeolocationPosition) => {
      const coordsArr: any = [location.coords.longitude, location.coords.latitude]
      this.map.setCenter(coordsArr)
      if (this.currentLocation) this.currentLocation.remove()
      this.currentLocation = new mapboxgl
        .Marker({ color: 'red' }) // Create a new marker with specified color
        .setLngLat(coordsArr) // Set marker location to [longitude, latitude]
        .addTo(this.map) // Add marker to the map

    }, err => {

    }, { enableHighAccuracy: true })
  }

  toggle(clickFrom: 1 | 2) {
    this.mapMode = clickFrom

    if (this.mapMode === 1) {
      this.map.removeControl(this.draw)
      this.map.addControl(this.directions, 'top-left');
    } else {
      this.map.removeControl(this.directions)
      this.map.addControl(this.draw, 'top-left');
    }
  }
}

