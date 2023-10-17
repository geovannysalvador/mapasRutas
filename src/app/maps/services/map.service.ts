import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map:Map | undefined;
  private markers: Marker[] =[]

  get isMapReady(){
    return !!this.map;
  }

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


}
