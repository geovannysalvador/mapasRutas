import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { PlacesApiClient } from '../api/placesApiClient';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation: [ number, number ] | undefined;

  public isLoadingPlaces:boolean = false;
  public places:Feature[] = [];




  get isUserLocationReady():boolean{
    return !!this.userLocation;
  }

  constructor( private placesApi:PlacesApiClient ) {
    this.getUserLocation();
   }

  // Metodo para saber cuando tenga la localizacion
  public async getUserLocation():Promise<[number, number]>{

    // Para convertir en una promesa
    return new Promise ( (resolve, reject) =>{

      navigator.geolocation.getCurrentPosition(
        // ( {coords} ) => resolve([ coords.longitude, coords.latitude ])
        ( {coords} ) => {
          this.userLocation = [ coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (err) =>{
          alert('No se pudo obtener la localizacion')
          console.log(err);
          reject();
        }
      );

    });

  }

  getPlacesByQuery( query:string = ''){
    //todo: evaluar cuando el quey marca nulo
    // Cuando no hay nada no hacer la peticion http
    if (query.length === 0) {
      this.places = [];
      this.isLoadingPlaces = false;

      return;
    }

    if( !this.userLocation) throw Error('No hay localizacion del usuario')

    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: this.userLocation.join(',')
      }
    })
      .subscribe( resp => {
        // console.log(resp.features);
        this.isLoadingPlaces = false;
        this.places = resp.features;

      });
  }

}
