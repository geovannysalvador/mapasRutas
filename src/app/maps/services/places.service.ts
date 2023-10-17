import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation: [ number, number ] | undefined;

  public isLoadingPlaces:boolean = false;
  public places:Feature[] = [];

  private token = environment.mapbox_key;


  get isUserLocationReady():boolean{
    return !!this.userLocation;
  }

  constructor( private http:HttpClient ) {
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

    this.isLoadingPlaces = true;

    this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=5&proximity=-90.51346054777761,14.641843302458241&language=es&access_token=${this.token}`)
      .subscribe( resp => {
        console.log(resp.features);

        this.isLoadingPlaces = false;
        this.places = resp.features;

      });
  }

}
