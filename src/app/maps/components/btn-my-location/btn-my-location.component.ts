import { Component } from '@angular/core';

@Component({
  selector: 'btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(){}


  goToMyLocation(){
    console.log('ir a mi ubucacion');

  }

}
