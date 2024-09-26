import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss'
})
export class MapsComponent {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  directions: any;
  constructor() { }

  ngOnInit() {
    mapboxgl.accessToken = environment.map.token;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
      attributionControl: false
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.AttributionControl({
      customAttribution: '© Rajdip Ghosh',
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
  }

  locateMe() {
    navigator.geolocation.getCurrentPosition((success) => {

    }, err => {

    })
  }
}
