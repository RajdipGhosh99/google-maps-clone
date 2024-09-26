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
  map !: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  directions: any;
  constructor() { }

  ngOnInit() {
    mapboxgl.accessToken = environment.map.token;

    this.initilizeMap(this.lng, this.lat)

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
      // Add a marker at the new center
      const marker = new mapboxgl
        .Marker({ color: 'red' }) // Create a new marker with specified color
        .setLngLat(coordsArr) // Set marker location to [longitude, latitude]
        .addTo(this.map) // Add marker to the map

    }, err => {

    }, { enableHighAccuracy: true })
  }
}
