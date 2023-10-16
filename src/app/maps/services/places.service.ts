import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation: [ number, number ] | undefined;

  get isUserLocationReady():boolean{
    return !!this.userLocation;
  }

  constructor() {
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

}
