import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';

import { DirectionsApiClient } from '../api/directionsApiClient';

import { Feature } from '../interfaces/places.interface';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map:Map | undefined;
  private markers: Marker[] =[]

  get isMapReady(){
    return !!this.map;
  }

  constructor(
    private directionsApi:DirectionsApiClient,
  ){}

  setMap( map:Map ){
    this.map = map;
  }

  flyTo( coords:LngLatLike ){
    if(!this.isMapReady) throw Error('El mapa no esta listo');

    this.map?.flyTo({
      zoom: 18,
      center: coords,
    });
  }

  createMarkersFromPlaces(places:Feature[], userLocation: [number, number]) {
    // inicializar todo en vacio y ver si el mapa existe
    if( !this.map ) throw Error('El mapa no existe');

    this.markers.forEach( marker => marker.remove() );

    const newMarkers = [];

    for (const place of places) {

      const [ lng, lat ] = place.center;
      const popup = new Popup()
        .setHTML(`
        <h6>${place.text}</h6>
        <span>${place.place_name}</span>
        `);

        // Crear el marcador
      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      // agregar todos lo s marcadores que se encontraron
      newMarkers.push(newMarker)
    }

    // agregarlo al arreglo donde despues se limpian si es necesario
    this.markers = newMarkers;
    // aca si no hay marcadores no haga nada
    if( places.length ===0 ) return;

    // ver todos los marcadores encontrados
    const bounds = new LngLatBounds();

    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() ) );
    // agrrgar nuestra ubi tambien para centrarla
    bounds.extend(userLocation);

    // aca lo renderizamos y agregamos un padding para que se centren todos los marker encontrados
    this.map.fitBounds(bounds, {
      padding: 200
    })

  }

  // para Obtener ruta, duración y distancia

  getRouteBetweenPoints( start:[number, number], end:[number, number] ){
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe( resp => this.drawPolyline( resp.routes[0] ) );
  }

  //

  private drawPolyline( route:Route ){
    // console.log({km: route.distance / 1000, durationMin: route.duration /60 });

    // Motrar y centrar los markers
    if( !this.map ) throw Error('Mapa no iniciado');
    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();

    coords.forEach( ([ lng, lat ]) => {
      bounds.extend([ lng,lat ]);
    });

    this.map?.fitBounds( bounds,{
      padding: 200,
    })
    // Dibujar la linea
    const sourceData:AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            }
          }
        ]
      }
    }

    // limpiar la ruta previa para que muestre otras
    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    // Añadiendo
    this.map.addSource('RouteString', sourceData);

    // DEfinir como debe de verse
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#22333b',
        'line-width': 4,
      },
    })

  }

}
