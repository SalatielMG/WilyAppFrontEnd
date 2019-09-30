import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from "../../config/url.servicios";
import { Utilerias } from '../../util/utilerias';
import {HttpClient, HttpParams} from "@angular/common/http";


@Injectable()
export class PagoProvider {
  isCorrectAjustePago: boolean = true;
  isCorrectAbono: boolean = true;
  isCorrectPago: boolean = true;
  pagosAjustados = [];
  ajustar: boolean = false;

  pagosGral: any[] = [];
  totalGral: any[] = [];
  tempPagosGral: any[] = [];
  abonosPagoGral: any[] = [];
  esActivoGral: number = 0;
  idPrestamoGral: number = 0;
  cerrarPrestamoGral: boolean = false;
  fechaProximaGral: string = "";
  anuladosGral:boolean = false;


  pagosClte: any[] = [];
  totalClte: any[] = [];
  tempPagosClte: any[] = [];
  abonosPagoClte: any[] = [];
  esActivoClte: number = 0;
  idPrestamoClte: number = 0;
  cerrarPrestamoClte: boolean = false;
  fechaProximaClte: string = "";
  anuladosClte:boolean = false;

  constructor(public http: HttpClient, public util: Utilerias) {
    console.log('Hello PagoProvider Provider');
  }
  public calcFechaPagoInteresGenerado(ultimoPago, total, fechaPago, esGral){
    this.util.crearLoading("Calaculando interes generado a partir de la fecha elegida !");

      const  dataP = new HttpParams()
        .append("ultimoPago", JSON.stringify(ultimoPago))
        .append("total", JSON.stringify(total))
        .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString() : this.idPrestamoClte.toString())
        .append("fechaPago", fechaPago) ;
      let URL = URL_SERVICIOS + "pagos/calcFechaPagoInteresGenerado";
      return this.http.post(URL, dataP);
  }
  public resetajusPay(){
    this.pagosAjustados = [];
    this.ajustar = false;
  }

  public cargarTodoPago(esGral: boolean = true){
    this.resetearVariablesPagos(esGral);
    this.cargarPagos(esGral);
  }
  public resetearVariablesPagos(esGral: boolean = true){ if(esGral) this.resetVPGral(); else this.resetVPClte();

  }
  private resetVPGral(){
    this.abonosPagoGral = [];
    this.pagosGral = [];
    this.totalGral = [];
    this.tempPagosGral = [];
    this.fechaProximaGral = "";
    this.cerrarPrestamoGral = false;
    this.anuladosGral = false;
  }
  private resetVPClte(){
    this.pagosClte = [];
    this.totalClte = [];
    this.tempPagosClte = [];
    this.fechaProximaClte = "";
    this.cerrarPrestamoClte = false;
    this.anuladosClte = false;
  }

  
  public cargarPagos(esGral: boolean = true){
    this.util.crearLoading("Cargando Pagos. ¡ Porfavor Espere !");
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
        .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
        .append("fechaActual", this.util.obtFechaActual());
      let URL = URL_SERVICIOS + "pagos/cargarPagos";
      this.http.get(URL, {params: dataP}).subscribe((data:any)=>{

        if(data.row == 0){
          this.util.msj(data.titulo, data.msj);
        }else{
          if(esGral){
            this.pagosGral = data.pagos;
            this.abonosPagoGral = data.abonos;
            //this.totalGral = data.totalGral;
            this.actualizarTempPagoGral();
            this.util.esCambioAbono = false;
            this.util.esCambioPrestamoAbono = false;
            if(this.esActivoGral == 1)  this.cerrarPrestamoGral = data.cerrarPrestamo;
            console.log("pagosGral:=", this.pagosGral);
          }else{
            this.pagosClte = data.pagos;
            this.abonosPagoClte = data.abonos;
            //this.totalClte = data.totalGral;
            this.actualizarTempPagoClte();
            if(this.esActivoClte == 1)  this.cerrarPrestamoClte = data.cerrarPrestamo;
            console.log("pagosClte:=", this.pagosClte);
          }
        }
        if(esGral) this.totalGral = data.totalGral; else this.totalClte = data.totalGral;
        this.util.detenerLoading();
        resolve();
      });
    });
    return promesa;
  }

  public actualizarTempPagoGral(){
    this.tempPagosGral = [];//Se resetea el arraryTemp
    let promesa = new Promise((resolve, reject) => {
    if(this.anuladosGral){//Se admite pagos con status eliminados
      this.tempPagosGral = this.pagosGral;
    }else{//Se filtran solo los pagos con status Ok.
      for(let i = 0; i < this.pagosGral.length; i++){
        if(this.pagosGral[i].status == 1){
          this.pagosGral[i]["posPago"] = i;
          this.tempPagosGral.push(this.pagosGral[i]);
        }
      }
      /*for (let pago of this.pagosGral){
        if(pago.status == 1){
          this.tempPagosGral.push(pago);
        }
      }*/
    }
    console.log("pagosGral:=", this.pagosGral);
    console.log("tempPagosGral:=", this.tempPagosGral);
      resolve();
      reject();
    });
    return promesa;
  }

  public actualizarTempPagoClte(){
    this.tempPagosClte = [];//Se resetea el arraryTemp
    let promesa = new Promise((resolve, reject) => {
      if(this.anuladosClte){//Se admite pagos con status eliminados
        this.tempPagosClte = this.pagosClte;
      }else{//Se filtran solo los pagos con status Ok.
        for(let i = 0; i < this.pagosClte.length; i++){
          if(this.pagosClte[i].status == 1){
            this.pagosClte[i]["posPago"] = i;
            this.tempPagosClte.push(this.pagosClte[i]);
          }
        }
        /*for (let pago of this.pagosClte){
          if(pago.status == 1){
            this.tempPagosClte.push(pago);
          }
        }*/
      }
      console.log("tempPagosClte:=", this.tempPagosClte);
      resolve();
      reject();
    });
    return promesa;
  }

  public abrirMes(idUsuario, token, esGral = true){
    this.util.crearLoading("Abriendo nuevo Mes, Porfavor Espere !!!");
    let promesa = new Promise((resolve, reject) => {
      let URL = URL_SERVICIOS + "pagos/abrirMes";
      const  dataP = new HttpParams()
      .append("id",idUsuario)
      .append("token", token)
      .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
      .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
      .append("fechaActual", this.util.obtFechaActual());
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe((data: any) => {
        this.isCorrectPago = false;
        if(data.error > 0){
          this.util.msj(data.titulo, data.msj);
        }else{
          this.util.toast(data.msj);
          //if(esGral) this.totalGral = data.totalGral; else this.totalClte = data.totalGral;
          if(data.totalNewPago > 0){
            this.addPago(data.totalGral, data.newPago, esGral);
            this.isCorrectPago = true;
          }else{
            this.cargarTodoPago(esGral);
          }
        }
        this.util.detenerLoading();
        console.log("Data in pagoProvider:=", data);
      });
      resolve();
    });
    return promesa;
  }
  private addPago(total, newPago, esGral){
    if(esGral){
      let index = this.pagosGral.length;
      this.pagosGral.push(newPago);
      newPago["posPago"] = index;
      this.tempPagosGral.push(newPago);
      this.totalGral = total;
      this.abonosPagoGral[newPago.id] = [];
    }else{
      let index = this.pagosClte.length;
      this.pagosClte.push(newPago);
      newPago["posPago"] = index;
      this.tempPagosClte.push(newPago);
      this.totalClte = total;
      this.abonosPagoClte[newPago.id] = [];
    }
  }
  public volverAbrirMes(idUsuario, token, idPago, index, esGral = true){
    this.util.crearLoading("Cerrando Mes, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pagos/volverAbrirMes";
    const  dataP = new HttpParams()
      .append("id",idUsuario)
      .append("token", token)
      .append("idPago", idPago)
      .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
      .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
      .append("fechaActual", this.util.obtFechaActual());
    console.log(dataP.toString());
    return this.http.post(URL, dataP).subscribe((data: any)=>{
      if(data.error > 0){
        this.util.msj(data.titulo, data.msj);
      }else{
        this.util.toast(data.msj);
        if(data.pagoActualizado.total > 0){/*Si se recupero el pago actualizado, entonces habra que actualizar*/
          this.actualizarPago(data.totalGral, index, data.pagoActualizado.pago, esGral);
        }else{/*Esto significa que no se recupero el pago actualizado, por lo tanto habra que recargar todo*/
          this.cargarTodoPago(esGral);
        }
      }
      this.util.detenerLoading();
      console.log("Data in pagoProvider:=", data);
    });
  }
  public cerrarMes(idUsuario, token, idPago, fecha, indexTemp, esGral: boolean = true){
    this.util.crearLoading("Cerrando Mes, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pagos/cerrarMes";
    const  dataP = new HttpParams()
      .append("id",idUsuario)
      .append("token", token)
      .append("idPago", idPago)
      .append("fecha", fecha)
      .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
      .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
      .append("fechaActual", this.util.obtFechaActual());
    console.log(dataP.toString());
    return this.http.post(URL, dataP).subscribe((data:any)=>{

      if(data.error > 0){
        this.util.msj(data.titulo, data.msj);
      }else{
        this.util.toast(data.msj);
        if(data.pagoActualizado.total > 0){/*Si se recupero el pago actualizado, entonces habra que actualizar*/
          this.actualizarPago(data.totalGral, indexTemp, data.pagoActualizado.pago, esGral);
        }else{/*Esto significa que no se recupero el pago actualizado, por lo tanto habra que recargar todo*/
          this.cargarTodoPago(esGral);
        }
      }
      this.util.detenerLoading();
      console.log("Data in pagoProvider:=", data);
    });
  }
  public anularMes(idUsuario, token, idPago, indexTemp , esGral: boolean = true){
    this.util.crearLoading("Anulando Mes, Porfavor Espere !!!");
    let promesa = new Promise((resolve, reject) => {
      let URL = URL_SERVICIOS + "pagos/anularMes";
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("idPago", idPago)
        .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
        .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
        .append("fechaActual", this.util.obtFechaActual());
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe(( data: any ) => {
        this.isCorrectPago = false;
        if(data.error > 0){
          this.util.msj(data.titulo, data.msj);
        }else{/*si sale todo bien*/
          this.util.toast(data.msj);
          if(data.pagoActualizado.total > 0){/*Si se recupero el pago anulado, entonces habra que actualizar*/
            this.isCorrectPago = true;
            this.actualizarPago(data.totalGral, indexTemp, data.pagoActualizado.pago, esGral, true);
          }else{/*Esto significa que no se recupero el pago anulado, por lo tanto habra que recargar todo*/
            this.cargarTodoPago(esGral);
          }
        }
        this.util.detenerLoading();
        console.log("Data in pagoProvider:=", data);
      });
        resolve();
      });
    return promesa;
  }
  public eliminarPermanentementeMes(idUsuario, token, idPago, index, esGral = true){
    this.util.crearLoading("Eliminando Permanentemente el Mes, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pagos/elimPermMes";
    const  dataP = new HttpParams()
      .append("id",idUsuario)
      .append("token", token)
      .append("idPago", idPago);
    //console.log(dataP.toString());
    return this.http.post(URL, dataP).subscribe(( data: any ) => {
      if(data.error > 0){
        this.util.msj(data.titulo, data.msj);
      }else{/*si sale todo bien*/
        this.util.toast(data.msj);
        //PENDIENTE:=[Siempre elimina dos posiciones cuando se quiere elimanr solo un elemento del array]
        //this.eliminarPMes(index, esGral);//pendiente

        /*ALTERNATIVA:=[Recargas todfo de nuevo, obedeciendo el *esAnulado*]*/
        let xdBnd = (esGral) ? this.anuladosGral: this.anuladosClte;
        //this.cargarTodoPago(esGral);
        this.resetearVariablesPagos(esGral);
        this.cargarPagos(esGral).then(() => {
          if(esGral){
            this.anuladosGral = xdBnd;
            this.actualizarTempPagoGral();
          } else{
            this.anuladosClte = xdBnd;
            this.actualizarTempPagoClte();
          }

        });
      }
      this.util.detenerLoading();
      console.log("Data in pagoProvider:=", data);
    });
  }
  public restaurarMes(idUsuario, token, idPago, index, esGral = true){
    this.util.crearLoading("Restaurando Mes, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pagos/restaurarMes";
    const  dataP = new HttpParams()
      .append("id",idUsuario)
      .append("token", token)
      .append("idPago", idPago)
      .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
      .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
      .append("fechaActual", this.util.obtFechaActual());
    console.log(dataP.toString());
    return this.http.post(URL, dataP).subscribe(( data: any ) => {

      if(data.error > 0){
        this.util.msj(data.titulo, data.msj);
      }else{/*si sale todo bien*/
        this.util.toast(data.msj);
        if(data.pagoActualizado.total > 0){/*Si se recupero el pago anulado, entonces habra que actualizar*/
          this.actualizarPago(data.totalGral, index, data.pagoActualizado.pago, esGral);
        }else{/*Esto significa que no se recupero el pago anulado, por lo tanto habra que recargar todo*/
          this.cargarTodoPago(esGral);
        }
      }
      this.util.detenerLoading();
      console.log("Data in pagoProvider:=", data);
    });
  }
  private eliminarPMes(index: number, esGral){
    /*Cuando es eliminacion permanente
    * se deduce que esta listado todos los pagos incluyendo los anulados
    * O sea this.anulados = true*/
    if(esGral){//splice(pos, 1)
      //this.prestamosActivos.splice(index,1);
      if(this.anuladosGral){//Esto significa que tienen la misma posicion
        console.log("this.pagosGral[" + index + "]", this.pagosGral[index]);
        console.log("this.tempPagosGral[" + index + "]", this.tempPagosGral[index]);
        this.pagosGral.splice(index, 1);
        this.tempPagosGral.splice(index, 1);
        console.log("this.pagosGral", this.pagosGral);
        console.log("this.tempPagosGral", this.tempPagosGral);
      }/*else{
        let pos = this.tempPagosGral[index].posPago;
        this.pagosGral.splice(pos, 1);
        this.tempPagosGral.splice(index, 1);
      }*/
    }else{
      if(this.anuladosClte){//Esto significa que tienen la misma posicion
        this.pagosClte.splice(index, 1);
        this.tempPagosClte.splice(index, 1);
      }/*else{
        let pos = this.tempPagosClte[index].posPago;
        this.pagosClte.splice(pos, 1);
        this.tempPagosClte.splice(index, 1);
      }*/
    }
  }
  public ajustarPagos(idUsuario, token, esGral){
    this.util.crearLoading("Ajustando pagos en meses, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pago/ajustarPGOMES";
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("pagos", JSON.stringify(this.pagosAjustados));
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe((data: any) => {
        console.log("Data Method: ajustarPagos()", data);
        this.util.detenerLoading();
        if(data.error > 0){
          let msj ="";
          if(data.errorABRIR > 0){
            msj = msj + "<br><p class='descripcion'><strong>data.tituloMsjEAbrir</strong></p><br><p class='descripcion'>data.MsjEAbrir</p>";
          }
          if(data.errorABONAR > 0){
            msj = msj + "<br><br><p class='descripcion'><strong>data.tituloMsjEAbonar</strong></p><br><p class='descripcion'>data.MsjEAbonar</p>";
          }
          if(data.errorCERRAR > 0){
            msj = msj + "<br><br><p class='descripcion'><strong>data.tituloMsjECerrar</strong></p><br><p class='descripcion'>data.MsjECerrar</p>";
          }
          this.util.msj(data.titulo, msj);
          this.isCorrectAjustePago = false;
        }else{/*si sale todo bien*/
          this.util.toast(data.msj, "top", false, 6);
          this.isCorrectAjustePago = true;
          this.cargarTodoPago(esGral);
        }
        resolve();
      });
    });
    return promesa;
  }
  public calcularPgoMes(idUsuario, token, idPrestamo, ultimoPago, totalGenerado, dataForm){
    this.util.crearLoading("Calculando pago en meses, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pago/calcularPgoMes";
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("idPrestamo", idPrestamo)
        .append("ultimoPago", JSON.stringify(ultimoPago))
        .append("totalGenerado", JSON.stringify(totalGenerado))
        .append("fecha", dataForm.fechaPagar)
        .append("cantPagar", dataForm.cantidadPagar);
      console.log(dataP.toString());
      this.http.get(URL, {params: dataP}).subscribe((data: any) => {
        this.util.detenerLoading();
        console.log("Data Method: calcularPgoMes()", data);
        for (var clave in data.MesAjustado){
          this.pagosAjustados.push(data.MesAjustado[clave]);
        }
        console.log("this.pagosAjustados", this.pagosAjustados);
        resolve();
      });
    });
    return promesa;
  }
  private actualizarPago(total, index, pago, esGral: boolean, esAnular: boolean = false){
    /*El pago se actualiza cuando:
    * 1.- Se anula //Depende de this.anulados (True:=[Se actualiza]; False:=[Se elimina de la lista]).
    * 2.- Se cierra //Se queda con la misma posicion.
    * 3.- Se agrega un nuevo abono //Se queda con la misma posicion
    * 4.- Se agrega un nuevo abono //*/
    if(esGral){
      pago.abierto = this.tempPagosGral[index].abierto;
      if(this.anuladosGral){//Esto significa que tienen la misma posicion

        this.pagosGral.splice(index, 1, pago);
        this.tempPagosGral.splice(index, 1, pago);
      }else{
        let pos = this.tempPagosGral[index].posPago;
        pago["posPago"] = pos;

        this.pagosGral.splice(pos, 1, pago);
        if(esAnular){
          this.tempPagosGral.splice(index, 1);
        }else{
          //let pos = this.tempPagosGral[index].posPago;
          //this.pagosGral.splice(pos, 1, pago);
          this.tempPagosGral.splice(index, 1, pago);
        }
      }
      if(this.esActivoGral == 1) this.cerrarPrestamoGral = total.cerrarPrestamo;
      this.totalGral = total;
    }else{
      pago.abierto = this.tempPagosClte[index].abierto;
      if(this.anuladosClte){//Esto significa que tienen la misma posicion
        this.pagosClte.splice(index, 1, pago);
        this.tempPagosClte.splice(index, 1, pago);
      }else{
        let pos = this.tempPagosClte[index].posPago;
        pago["posPago"] = pos;
        this.pagosClte.splice(pos, 1, pago);
        if(esAnular){
          this.tempPagosClte.splice(index, 1);
        }else{
          //let pos = this.tempPagosClte[index].posPago;
          //this.pagosClte.splice(pos, 1, pago);

          this.tempPagosClte.splice(index, 1, pago);
        }
      }
      if(this.esActivoClte == 1) this.cerrarPrestamoClte = total.cerrarPrestamo;
      this.totalClte = total;
    }
  }
  public agregarAbono(idUsuario, token, idPago, dataAbono: any, index, esGral){
    this.util.crearLoading("Agregando nuevo Abono, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pago/agregarAbono";
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("idPago", idPago)
        .append("fecha", dataAbono.fecha)
        .append("cantidad", dataAbono.abono)
        .append("nota", dataAbono.nota)
        .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
        .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
        .append("fechaActual", this.util.obtFechaActual());
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe((data: any) => {

        if(data.error > 0){
          this.util.msj(data.titulo, data.msj);
          this.isCorrectAbono = false;
        }else{
          this.util.toast(data.msj);
          /**/
          if(data.totalPago > 0){//Se recupero el nuevo pago actualizado y todos sus abonos corrrespondientes
            this.actualizarPago(data.totalGral, index, data.pagoActualizado, esGral);
            this.actualizarPagoAbonos(idPago, data.abonos ,esGral);
          }else{
            this.cargarTodoPago(esGral);//Se cargan todos los datos porque se actualizan los datos
          }
          this.isCorrectAbono = true;
        }
        this.util.detenerLoading();
        console.log("Data in pagoProvider:=", data);
        resolve();
      });
    });
    return promesa;
  }
  public editarAbono(idUsuario, token, pagoId, abonoId, dataAbono: any, indexPago, esGral: boolean = true){
    this.util.crearLoading("Editando Abono, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pago/editarAbono";
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("idAbono", abonoId)
        .append("idPago", pagoId)
        .append("fecha", dataAbono.fecha)
        .append("cantidad", dataAbono.abono)
        .append("nota", dataAbono.nota)
        .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
        .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
        .append("fechaActual", this.util.obtFechaActual());
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe((data: any) => {

        if(data.error > 0){
          this.util.msj(data.titulo, data.msj);
          this.isCorrectAbono = false;
        }else{
          this.util.toast(data.msj);
          /**/
          if(data.totalPago > 0){//Se recupero el nuevo pago actualizado y todos sus abonos corrrespondientes
            this.actualizarPago(data.totalGral, indexPago, data.pagoActualizado, esGral);
            this.actualizarPagoAbonos(pagoId, data.abonos ,esGral);
          }else{
            this.cargarTodoPago(esGral);//Se cargan todos los datos porque se actualizan los datos
          }
          this.isCorrectAbono = true;
        }
        this.util.detenerLoading();
        console.log("Data in pagoProvider:=", data);
        resolve();
      });
    });
    return promesa;
  }
  public cancelarAbono(idUsuario, token, pagoId, abonoId, indexPago, esGral: boolean = true){
    this.util.crearLoading("Cancelando Abono, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pago/cancelarAbono";
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("idAbono", abonoId)
        .append("idPago", pagoId)
        .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
        .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
        .append("fechaActual", this.util.obtFechaActual());
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe((data: any) => {

        if(data.error > 0){
          this.util.msj(data.titulo, data.msj);
          this.isCorrectAbono = false;
        }else{
          this.util.toast(data.msj);
          /**/
          if(data.totalPago > 0){//Se recupero el nuevo pago actualizado y todos sus abonos corrrespondientes
            this.actualizarPago(data.totalGral, indexPago, data.pagoActualizado, esGral);
            this.actualizarPagoAbonos(pagoId, data.abonos ,esGral);
          }else{
            this.cargarTodoPago(esGral);//Se cargan todos los datos porque se actualizan los datos
          }
          this.isCorrectAbono = true;
        }
        this.util.detenerLoading();
        console.log("Data in pagoProvider:=", data);
        resolve();
      });
    });
    return promesa;
  }
  public eliminarPmnteAbono(idUsuario, token, pagoId, abonoId, indexAbono, esGral: boolean = true){
    this.util.crearLoading("Eliminando permanentemente el Abono, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pago/elimPmnteAbono";
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("idAbono", abonoId);
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe((data: any) => {
        if(data.error > 0){
          this.util.msj(data.titulo, data.msj);
          this.isCorrectAbono = false;
        }else{
          this.util.toast(data.msj);
          /**/
          if(esGral){
              this.abonosPagoGral[pagoId].splice(indexAbono, 1);
          }else{
              this.abonosPagoClte[pagoId].splice(indexAbono, 1);
          }
          this.isCorrectAbono = true;
        }
        this.util.detenerLoading();
        console.log("Data in pagoProvider:=", data);
        resolve();
      });
    });
    return promesa;
  }
  public rehacerAbono(idUsuario, token, pagoId, abonoId, indexPago, esGral: boolean = true){
    this.util.crearLoading("Restaurando Abono, Porfavor Espere !!!");
    let URL = URL_SERVICIOS + "pago/rehacerAbono";
    let promesa = new Promise((resolve, reject) => {
      const  dataP = new HttpParams()
        .append("id",idUsuario)
        .append("token", token)
        .append("idAbono", abonoId)
        .append("idPago", pagoId)
        .append("esActivo", (esGral) ? this.esActivoGral.toString(): this.esActivoClte.toString())
        .append("idPrestamo", (esGral) ? this.idPrestamoGral.toString(): this.idPrestamoClte.toString())
        .append("fechaActual", this.util.obtFechaActual());
      console.log(dataP.toString());
      this.http.post(URL, dataP).subscribe((data: any) => {

        if(data.error > 0){
          this.util.msj(data.titulo, data.msj);
          this.isCorrectAbono = false;
        }else{
          this.util.toast(data.msj);
          /**/
          if(data.totalPago > 0){//Se recupero el nuevo pago actualizado y todos sus abonos corrrespondientes
            this.actualizarPago(data.totalGral, indexPago, data.pagoActualizado, esGral);
            this.actualizarPagoAbonos(pagoId, data.abonos ,esGral);
          }else{
            this.cargarTodoPago(esGral);//Se cargan todos los datos porque se actualizan los datos
          }
          this.isCorrectAbono = true;
        }
        this.util.detenerLoading();
        console.log("Data in pagoProvider:=", data);
        resolve();
      });
    });
    return promesa;
  }
  private actualizarPagoAbonos(idPago, abonos ,esGral){
    if(esGral){
      this.abonosPagoGral[idPago] = abonos;
    }else{
      this.abonosPagoClte[idPago] = abonos;
    }
  }

}
