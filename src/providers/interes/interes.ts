import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { URL_SERVICIOS } from "../../config/url.servicios";
import 'rxjs/add/operator/map';




@Injectable()
export class InteresProvider {

  intereses:any[]=[];

  constructor(public http: Http ) {
    this.cargarIntereses();
  }
  cargarIntereses(){
    let url = URL_SERVICIOS + "intereses/mostrar";
    this.http.get( url )
      .map( resp=> resp.json() )
      .subscribe( data =>{
        if( data.error != 0 ){
          console.log("Error al obtener los intereses")
        }else{
          this.intereses = data.intereses;
          console.log(this.intereses);
        }
      })
  }
}
