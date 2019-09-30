import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { URL_SERVICIOS } from "../../config/url.servicios";
import { Platform } from "ionic-angular";
import { Utilerias } from "../../util/utilerias";

// Plugin storage
import { Storage } from '@ionic/storage';

@Injectable()
export class UsuarioProvider {

  token:string;
  id_usuario:string;

  constructor(private http: Http,
              public util: Utilerias,
              private platform:Platform,
              private storage: Storage) {

    console.log('Hello Usuario Provider');
    this.cargar_storage();
  }

  activo():boolean{
    if( this.token != null ){
      return true;
    }else{
      return false;
    }
  }

  probarXd( usuario:string, contrasena:string ){
    let data = new URLSearchParams();
    data.append("usuario", usuario );
    data.append("contrasena", contrasena );
    let url = URL_SERVICIOS + "usuario/probarxd";

    return this.http.post( url, data )
      .map( resp=>{
        let data=resp.json();
        console.log( data.pass);
      });
  }

  ingresar( usuario:string, contrasena:string ){
    let data = new URLSearchParams();
    data.append("usuario", usuario );
    data.append("contrasena", contrasena );
    let url = URL_SERVICIOS + "usuario/login";
    return this.http.post( url, data )
      .map( resp=>{
        let data = resp.json();
        console.log( data );
        if( data.error != 0){
          this.util.msj("Error Datos Incorrectos",data.msj);
        }else{
          this.token = data.token;
          this.id_usuario = data.id;
          // Guardar Storage
          this.guardar_storage();
          this.util.msj("Session Iniciada",data.msj);
        }
      });
  }

   cerrar_sesion(){
    this.token = null;
    this.id_usuario = null;
    // guardar storage
    this.guardar_storage();
    this.cargar_storage();
    console.log("Cerro Session ");
    console.log("id:= "+this.id_usuario);
    console.log("Token:= "+this.token);
    //this.navCtrl.setRoot(HomePage);
  }

  private guardar_storage(){
    if( this.platform.is("cordova") ){
      // dispositivo
      this.storage.set('token', this.token );
      this.storage.set('id_usuario', this.id_usuario );

    }else{
      // computadora
      if( this.token ){
        localStorage.setItem("token",  this.token  );
        localStorage.setItem("id_usuario",  this.id_usuario  );
      }else{
        localStorage.removeItem("token");
        localStorage.removeItem("id_usuario");
      }
    }
  }

  cargar_storage(){
    let promesa = new Promise( ( resolve, reject )=>{
      if( this.platform.is("cordova") ){
        // dispositivo
        this.storage.ready()
          .then( ()=>{
            this.storage.get("token")
              .then( token =>{
                if( token ){
                  this.token = token;
                }
              })
            this.storage.get("id_usuario")
              .then( id_usuario =>{
                if( id_usuario ){
                  this.id_usuario = id_usuario;
                }
                resolve();
              })
          })
      }else{
        // computadora
        if( localStorage.getItem("token") ){
          //Existe items en el localstorage
          this.token = localStorage.getItem("token");
          this.id_usuario = localStorage.getItem("id_usuario");
        }
        resolve();
      }
    });
    return promesa;
  }
}
