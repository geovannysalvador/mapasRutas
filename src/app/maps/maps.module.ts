import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapScreenComponent } from './pages/map-screen/map-screen.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { LoadingComponent } from './components/loading/loading.component';
import { environment } from '../../environments/environment';


// para ver el mapa
import Mapboxgl from 'mapbox-gl';
import { BtnMyLocationComponent } from './components/btn-my-location/btn-my-location.component';
import { AngularLogoComponent } from './components/angular-logo/angular-logo.component'; // or "const mapboxgl = require('mapbox-gl');"

(Mapboxgl as any).accessToken =  environment.mapbox_key


@NgModule({
  declarations: [
    MapScreenComponent,
    MapViewComponent,
    LoadingComponent,
    BtnMyLocationComponent,
    AngularLogoComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MapScreenComponent,
  ],
})
export class MapsModule { }
