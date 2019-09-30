import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { URL_SERVICIOS } from "../../config/url.servicios";
import { Utilerias } from "../../util/utilerias";
import 'rxjs/add/operator/map';




@Injectable()
export class BienProvider {

  bienes:any[]=[];
  isNew: boolean = false;

  constructor(public http: Http, public util:Utilerias) {
    this.cargarBienes();
  }
  cargarBienes(){
    this.util.crearLoading("Cargando bienes. ¡ Porfavor Espere !");
    let url = URL_SERVICIOS + "bienes/mostrar";
    this.http.get( url )
      .map( resp=> resp.json() )
      .subscribe( data =>{
        this.util.detenerLoading();
        if( data.error != 0 ){
          console.log("Error al obtener los bienes")
        }else{
          this.bienes = data.bienes;
          console.log(this.bienes);
        }
      })
  }

  public agregarBien(datos:any,id:any, token:any){//Solo aplica para la vista de un cliente en particular.
    this.util.crearLoading("Creando nuevo Bien. ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("id", id);
    dataP.append("token", token );
    dataP.append("nombre", datos.nombre );
    dataP.append("tipo", datos.tipo );

    let url = URL_SERVICIOS + "bienes/agregar";

    return this.http.post( url, dataP )
      .map( resp=>{
        let data = resp.json();
        console.log( data );
        this.util.detenerLoading();
        if( data.error != 0){//Ocurrio un errro al,ingresar el prestamo
          this.util.msj(data.titulo, data.msj);
          this.isNew=false;
        }else{//El prestamo se ingreso correctamente a la BD
          this.cargarBienes();
          this.util.toast(data.msj);
          this.isNew=true;
        }
      });
  }


}
