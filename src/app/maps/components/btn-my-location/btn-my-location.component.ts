import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(
    private mapService:MapService,
    private placesService:PlacesService,
  ){}


  goToMyLocation(){

    if ( !this.placesService.isUserLocationReady ) throw Error('No hay ubicacion aun');
    if ( !this.mapService.isMapReady ) throw Error('Aun no se carga el mapa');

    this.mapService.flyTo( this.placesService.userLocation! );

  }

}
