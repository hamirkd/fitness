import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 15;
  locationFetched = false;

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationFetched = true;
        },
        error => {
          console.error('Erreur de géolocalisation :', error);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée.");
    }
  }
}