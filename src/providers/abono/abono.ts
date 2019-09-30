import { Injectable } from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import { URL_SERVICIOS } from "../../config/url.servicios";
import { Utilerias } from '../../util/utilerias';
import 'rxjs/add/operator/map';

@Injectable()
export class AbonoProvider {


  /*
  *Abonos activos y cerrados para prestamos en general
  * */
  abonosClte: any[] = [];
  totalClte: any[] = [];
  tempAbonosClte: any[] = [];
  esActivoClte: number = 0;
  idPrestamoClte: number = 0;
  fechaProximaClte: string = "";
  cerrarPrestamoClte: boolean = false;
  anuladosClte:boolean = false;
  /*

  *Abonos activos y cerrados para prestamos de cliente
  * */
  abonosGral: any[] =   [];
  totalGral: any[] = [];
  tempAbonosGral: any[] = [];
  esActivoGral: number = 0;
  idPrestamoGral: number = 0;
  fechaProximaGral: string = "";
  cerrarPrestamoGral: boolean = false;
  anuladosGral:boolean = false;

  /*Other variables*/
  isCorrect: boolean = false;//Es como el nuevo dependiendo de cualquir cambio ya sea alta, cambio, o eliminar
  montoCalculado: any[] = [];

  constructor(public http: Http, public util: Utilerias ) {
  }
  public cargarTodoAbonoGral(){
    this.resetearAGRal();
    this.cargarAbonosPGral();
  }
  public resetearAGRal(){
    this.abonosGral = [];
    this.totalGral = [];
    this.tempAbonosGral = [];
    this.fechaProximaGral = "";
    this.cerrarPrestamoGral = false;
    this.anuladosGral = false;
  }
  public cargarTodoAbonoClte(){
    this.resetearACLTE();
    this.cargarAbonosPClte();
  }
  public resetearACLTE(){
    this.abonosClte = [];
    this.totalClte = [];
    this.tempAbonosClte = [];
    this.fechaProximaClte = "";
    this.cerrarPrestamoClte = false;
    this.anuladosClte = false;
  }
  cargarAbonosPGral(){//Se tendra que enviar la variable si es activa o cerrada el prestmo al que se esta solicitando los abonos
    this.util.crearLoading("Cargando abonos. ¡ Porfavor Espere !");
    let promesa = new Promise((resolve, reject) => {
      let URL = URL_SERVICIOS + "abonos/mostrarAbonos?esActivo="+this.esActivoGral + "&idPrestamo=" + this.idPrestamoGral;
      this.http.get(URL).map(resp =>resp.json() ).subscribe(data=>{
        this.util.detenerLoading();
        if(data.row == 0){
          this.util.msj(data.titulo, data.msj);
        }else{
          this.abonosGral = data.abonos;
          this.totalGral = data.total[0];
          this.actualizarTempAbonoGral();
        }
        this.util.esCambioAbono = false;
        this.util.esCambioPrestamoAbono = false;
        if(this.esActivoGral == 1) {this.fechaProximaGral = data.fechaProxima; this.cerrarPrestamoGral = data.cerrarPrestamo}//Si se trata de prestamos activos
        console.log("this.abonosGral", this.abonosGral );
        console.log("this.totalGral", this.totalGral );
        console.log("this.fechaProximaGral", this.fechaProximaGral );
        resolve();
      });
    });
    return promesa;
  }

  public actualizarTempAbonoGral(){
    this.tempAbonosGral = [];//Se resetea el arraryTemp
    let promesa = new Promise(((resolve, reject) => {

      if(this.anuladosGral){//Se admite abonos con status eliminados
        this.tempAbonosGral = this.abonosGral;
      }else{//Se filtran solo los abonos con status Ok.
        for (let abono of this.abonosGral){
          if(abono.status == 1){
            this.tempAbonosGral.push(abono);
          }
        }
      }
      resolve();
      reject();
    }));
    return promesa;
  }

  public actualizarTempAbonoClte(){
    this.tempAbonosClte = [];//Se resetea el arraryTemp
    let promesa = new Promise(((resolve, reject) => {

      if(this.anuladosClte){//Se admite abonos con status eliminados
        this.tempAbonosClte = this.abonosClte;
      }else{//Se filtran solo los abonos con status Ok.
        for (let abono of this.abonosClte){
          if(abono.status == 1){
            this.tempAbonosClte.push(abono);
          }
        }
      }
      resolve();
      reject();
    }));
    return promesa;
  }

  cargarAbonosPClte(){
    this.util.crearLoading("Cargando abonos. ¡ Porfavor Espere !");
    let promesa = new Promise((resolve, reject) => {
      let URL = URL_SERVICIOS + "abonos/mostrarAbonos?esActivo="+this.esActivoClte + "&idPrestamo=" + this.idPrestamoClte;
      this.http.get(URL).map(resp =>resp.json() ).subscribe(data=>{
        this.util.detenerLoading();
        if(data.row == 0){
          this.util.msj(data.titulo, data.msj);
        }else{
          this.abonosClte = data.abonos;
          this.totalClte = data.total[0];
          this.actualizarTempAbonoClte();
        }
        if(this.esActivoClte == 1) {this.fechaProximaClte = data.fechaProxima; this.cerrarPrestamoClte = data.cerrarPrestamo}//Si se trata de prestamos activos
        console.log("this.abonosClte", this.abonosClte );
        console.log("this.totalClte", this.totalClte );
        console.log("this.fechaProximaClte", this.fechaProximaClte );
        resolve();
      });
    });
    return promesa;

  }

  editarAbono(datos, id, token, idAbono, bnd: boolean = true){
    this.util.crearLoading("Realizando pago. ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("id", id);
    dataP.append("token", token);
    dataP.append("idAbono", idAbono);
    dataP.append("fecha", datos.fecha);
    dataP.append("interes", datos.interes);
    dataP.append("abono", datos.abono);
    dataP.append("mora", datos.mora);
    dataP.append("nota", datos.nota);

    //console.log("dataP", dataP);

    let URL = URL_SERVICIOS + "abonos/editar";
    return this.http.post(URL, dataP).map((resp)=>{
      let data = resp.json();
      if(data.error > 0){
        this.util.msj(data.titulo, data.msj);
        this.isCorrect = false
      }else{//No hay errores
        this.util.toast(data.msj);
        this.isCorrect = true;
        if(bnd) this.cargarTodoAbonoGral(); else{this.cargarTodoAbonoClte(); this.ActualizarCambioAbonosGral();}
      }
      console.log(data);
      this.util.detenerLoading();

    });
  }
  altaAbono(datos, id, token, idPrestamo, bnd: boolean = true){
    this.util.crearLoading("Realizando pago. ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("id", id);
    dataP.append("token", token);
    dataP.append("idPrestamo", idPrestamo);
    dataP.append("fecha", datos.fecha);
    dataP.append("interes", datos.interes);
    dataP.append("abono", datos.abono);
    dataP.append("mora", datos.mora);
    dataP.append("nota", datos.nota);

    //console.log("dataP", dataP);

    let URL = URL_SERVICIOS + "abonos/agregar";
    return this.http.post(URL, dataP).map((resp)=>{
      let data = resp.json();
      if(data.error > 0){
        this.util.msj(data.titulo, data.msj);
        this.isCorrect = false
      }else{//No hay errores
        this.util.toast(data.msj);
        this.isCorrect = true;
        if(bnd) this.cargarTodoAbonoGral(); else{this.cargarTodoAbonoClte(); this.ActualizarCambioAbonosGral();}
      }
      console.log(data);
      this.util.detenerLoading();

    });

  }

  recuperarDatoAbono(idPrestamo, id, token){
    this.util.crearLoading("Recuperando datos. ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("id", id);
    dataP.append("token", token);
    dataP.append("idPrestamo", idPrestamo);

    //console.log("dataP", dataP);

    let URL = URL_SERVICIOS + "abonos/recuperaDatos";
    return this.http.post(URL, dataP).map(resp => resp.json());

  }

  calcularMontos(fecha, idP, op){
    this.montoCalculado = [];
    this.util.crearLoading("Calculando Montos. ¡ Porfavor Espere !");
    let promesa = new Promise((resolve, reject) =>{
      let URL = URL_SERVICIOS + "abonos/calcularMonto?fecha=" + fecha + "&idPrestamo=" + idP + "&op=" + op;
      this.http.get(URL).map(resp => resp.json()).subscribe(data=>{
        this.util.detenerLoading();
        this.montoCalculado = data;
        console.log("this.montoCalculado", this.montoCalculado);
        resolve();
      });
    });
    return promesa;
  }

  public anularAbono(idAbono, id, token, bnd: boolean = true){
    this.util.crearLoading("Anulando abono, ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("idAbono", idAbono);
    dataP.append("id", id);
    dataP.append("token", token );

    let url = URL_SERVICIOS + "abonos/anularAbono";

    return this.http.post( url, dataP )
      .map( resp => resp.json()).subscribe(data => {
        console.log( data );
        this.util.detenerLoading();
        if( data.error != 0){
          this.util.msj(data.titulo,data.msj);
          this.isCorrect=false;
        }else{
          if(bnd) this.cargarTodoAbonoGral(); else this.cargarTodoAbonoClte();
          this.util.toast(data.msj);
          this.isCorrect=true;
          this.ActualizarCambioAbonosGral();
        }
      });
  }

  public eliminarPermanentemente(idAbono, id, token, bnd: boolean = true){
    this.util.crearLoading("Eliminando permanentemente el abono, ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("idAbono", idAbono);
    dataP.append("id", id);
    dataP.append("token", token );

    let url = URL_SERVICIOS + "abonos/eliminarPermanentementeAbono";

    return this.http.post( url, dataP )
      .map( resp => resp.json()).subscribe(data => {
        console.log( data );
        this.util.detenerLoading();
        if( data.error != 0){
          this.util.msj(data.titulo,data.msj);
          this.isCorrect=false;
        }else{
          if(bnd) this.cargarTodoAbonoGral(); else this.cargarTodoAbonoClte();
          this.util.toast(data.msj);
          this.isCorrect=true;
          this.ActualizarCambioAbonosGral();
        }
      });
  }


  public restaurarAbono(idAbono, id, token, bnd: boolean = true){
    this.util.crearLoading("Restaurando abono, ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("idAbono", idAbono);
    dataP.append("id", id);
    dataP.append("token", token );

    let url = URL_SERVICIOS + "abonos/restaurarAbono";
    return this.http.post( url, dataP )
      .map( resp => resp.json()).subscribe(data => {
        console.log( data );
        this.util.detenerLoading();
        if( data.error != 0){
          this.util.msj(data.titulo,data.msj);
          this.isCorrect=false;
        }else{
          if(bnd) this.cargarTodoAbonoGral(); else this.cargarTodoAbonoClte();
          this.util.toast(data.msj);
          this.isCorrect=true;
          this.ActualizarCambioAbonosGral();
        }
      });
  }
  ActualizarCambioAbonosGral(bndesCambioPrestamo: boolean = false){
    /*
    * Hay que comparar si los ID tanto Gral y Clte sean diferentes de 0
    * Comparar si las 2 ids son iguales.
    * Si son iguales cmabiar el status de la variable esCambioAbono
    * */
    if(this.idPrestamoGral != 0 && this.idPrestamoClte != 0){
      if(this.idPrestamoGral == this.idPrestamoClte){
        this.util.esCambioAbono = true;
        if(bndesCambioPrestamo) this.util.esCambioPrestamoAbono = true;
      }
    }
    if(bndesCambioPrestamo) this.util.esCambioPrestamo = true;
  }
}
