import {Injectable} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { URL_SERVICIOS } from "../../config/url.servicios";
import { Utilerias } from "../../util/utilerias";
import 'rxjs/add/operator/map';

@Injectable()
export class PrestamoProvider {

  //Super
  textoRefrescando = "Cargando todos los Prestamos Activos";
  esAll:boolean=true;
  idC:number=0;
  isNew:boolean=false;

  //Special
  msjGralActivo: string = "";
  msjGralCerrado: string = "";
  msjClteActivo: string = "";
  msjClteCerrado: string = "";


  /*
  * Prestamos Generales
  * */

  //Variables Prestamos Activos


  prestamosActivos:any[]=[];
  filterPA = [];
  filtrosPA = [];
  dataBusquedaPA = [];
  camposFomularioPA = ["", "", "", "", "", ""];
  paginaPA:number = 0;
  heigthPA =0 ;//Holi; Filtro
  padPA = 0;//Holi; Filtro
  expandedPA : boolean=false;//Holi; Filtro
  iconPA:string = "arrow-forward";//Holi; Filtro

  //Variables Prestamos Cerrados
  prestamosCerrados:any[]=[];
  filterPC = [];
  filtrosPC = [];
  dataBusquedaPC = [];
  camposFomularioPC = ["", "", "", "", "", ""];
  paginaPC:number = 0;
  heigthPC =0 ;//Holi; Filtro
  padPC = 0;//Holi; Filtro
  expandedPC : boolean=false;//Holi; Filtro
  iconPC:string = "arrow-forward";//Holi; Filtro


  //Other
  prestamo: number = 1;
  iconCntPrestamoAbono:string = "arrow-forward";
  iconCntCliente:string = "arrow-forward";
  iconCntPrestamo:string = "arrow-forward";
  expandedCntCliente : boolean = false;
  expandedCntPrestamo : boolean = false;



  /*
  * Prestamos Especificos de un cliente
  * */

  //Variables Prestamos Activos
  prestamosActivosClte:any[]=[];
  filterPAClte = [];
  filtrosPAClte = [];
  dataBusquedaPAClte = [];
  camposFomularioPAClte = ["", "", "", "", "", ""];
  paginaPAClte:number = 0;
  heigthPAClte =0 ;//Holi; Filtro
  padPAClte = 0;//Holi; Filtro
  expandedPAClte : boolean=false;//Holi; Filtro
  iconPAClte:string = "arrow-forward";//Holi; Filtro

  //Variables Prestamos Cerrados
  prestamosCerradosClte:any[]=[];
  filterPCClte = [];
  filtrosPCClte = [];
  dataBusquedaPCClte = [];
  camposFomularioPCClte = ["", "", "", "", "", ""];
  paginaPCClte:number = 0;
  heigthPCClte =0 ;//Holi; Filtro
  padPCClte = 0;//Holi; Filtro
  expandedPCClte : boolean=false;//Holi; Filtro
  iconPCClte:string = "arrow-forward";//Holi; Filtro

  //Variables Prestamos Eliminados
  prestamosActivosEliminados:any[] = [];
  prestamosCerradosEliminados:any[] = [];

  //Other
  prestamoClte: number = 1;
  iconCntPrestamoAbonoClte:string = "arrow-forward";
  iconCntClienteClte:string = "arrow-forward";
  iconCntPrestamoClte:string = "arrow-forward";
  expandedCntClienteClte : boolean = false;
  expandedCntPrestamoClte : boolean = false;


  /*
  * Gral = true
  *
  * Clte = false
  */


  constructor(public http: Http, public util:Utilerias) {
    //this.cargarTodosPrestamosActivos();
  }

  public resetBtnCnt(bnd: boolean = true){ if (bnd)this.resetBCGral(); else this.resetBCClte(); }
  private resetBCGral(){
    this.iconCntCliente = "arrow-forward";
    this.iconCntPrestamo = "arrow-forward";
    this.expandedCntCliente  = false;
    this.expandedCntPrestamo  = false;
  }
  private resetBCClte(){
    this.iconCntClienteClte = "arrow-forward";
    this.iconCntPrestamoClte = "arrow-forward";
    this.expandedCntClienteClte  = false;
    this.expandedCntPrestamoClte  = false;
  }

  public resetDataSearchPA(bnd: boolean = true){
    if(bnd){
      this.resetDSPAGral();
      this.resetHeigthCardContentPA(bnd);
    }else{
      this.resetDSPAClte();
      this.resetHeigthCardContentPA(bnd);
    }
  }
  private resetDSPAGral(){
    this.filterPA = [];
    this.filtrosPA = [];
    this.dataBusquedaPA = [];
    //this.camposFomularioPA = ["", "", "", "", "", ""];
  }
  private resetDSPAClte(){
    this.filterPAClte = [];
    this.filtrosPAClte = [];
    this.dataBusquedaPAClte = [];
    //this.camposFomularioPAClte = ["", "", "", "", "", ""];
  }

  public resetHeigthCardContentPA(bnd: boolean = true){ if(bnd) this.resetHCCPAGral(); else this.resetHCCPAClte(); }
  private resetHCCPAGral(){
    this.heigthPA =0 ;
    this.padPA = 0;
    this.expandedPA = false;
    this.iconPA = "arrow-forward";
  }
  private resetHCCPAClte(){
    this.heigthPAClte =0 ;
    this.padPAClte = 0;
    this.expandedPAClte = false;
    this.iconPAClte = "arrow-forward";
  }

  public resetDataSearchPC(bnd: boolean = true){
    if(bnd){
      this.resetDSPCGral();
      this.resetHeigthCardContentPC(bnd);
    }else{
      this.reserDSPCClte();
      this.resetHeigthCardContentPC(bnd);
    }
  }
  private resetDSPCGral(){
    this.filterPC = [];
    this.filtrosPC = [];
    this.dataBusquedaPC = [];
    //this.camposFomularioPC = ["", "", "", "", "", ""];
  }
  private reserDSPCClte(){
    this.filterPCClte = [];
    this.filtrosPCClte = [];
    this.dataBusquedaPCClte = [];
    //this.camposFomularioPCClte = ["", "", "", "", "", ""];
  }

  public resetHeigthCardContentPC(bnd: boolean = true){ if(bnd) this.resetHCCPCGral(); else this.resetHCCPCClte(); }
  private resetHCCPCGral(){
    this.heigthPC = 0;
    this.padPC = 0;
    this.expandedPC =false;
    this.iconPC = "arrow-forward";
  }
  private resetHCCPCClte(){
    this.heigthPCClte = 0;
    this.padPCClte = 0;
    this.expandedPCClte =false;
    this.iconPCClte = "arrow-forward";
  }

  public cargarTodosPrestamosActivos(bnd: boolean = true){
    this.resetDataSearchPA(bnd);
    this.resetearPA(bnd);
    this.cargarPrestamosActivos(bnd);
  }

  public bucarPrestamosActivos(bnd: boolean = true){
    this.resetearPA(bnd);
    this.cargarPrestamosActivos(bnd);
  }

  public resetearPA(bnd:boolean = true){ if(bnd) this.resetPAGral(); else this.resetPAClte(); }
  private resetPAGral(){
    this.paginaPA = 0;
    this.prestamosActivos = [];
  }
  private resetPAClte(){
    this.paginaPAClte = 0;
    this.prestamosActivosClte = [];
  }

  public cargarTodosPrestamosCerrados(bnd: boolean = true){
    this.resetDataSearchPC(bnd);
    this.resetearPC(bnd);
    this.cargarPrestamosCerrados(bnd);
  }

  public bucarPrestamosCerrados(bnd: boolean = true){
    this.resetearPC(bnd);
    this.cargarPrestamosCerrados(bnd);
  }

  public resetearPC(bnd: boolean = true){ if(bnd) this.resetPCGral(); else this.resetPCClte(); }
  private resetPCGral(){
    this.paginaPC = 0;
    this.prestamosCerrados = [];
  }
  private resetPCClte(){
    this.paginaPCClte = 0;
    this.prestamosCerradosClte = [];
  }

  public cargarPrestamosActivos(bnd: boolean = true){ if(bnd) return this.cargarPAGral(); else return this.cargarPAClte(); }
  private cargarPAGral(){
    if ( this.paginaPA == 0 && this.filtrosPA.length == 0 )
      this.util.crearLoading("Cargando Prestamos Activos");
    else if ( this.paginaPA == 0 && this.filtrosPA.length > 0 )
      this.util.crearLoading("Buscando Prestamos Activos ...");

    let promesa = new Promise(  (resolve, reject)=>{
      let url = URL_SERVICIOS + "prestamos/mostrarActivos?idC=" + this.idC + "&pagina=" + this.paginaPA + "&filtros=" + JSON.stringify(this.filtrosPA) + "&dataBusqueda=" + JSON.stringify(this.dataBusquedaPA);
      this.http.get( url )
        .map( resp=> resp.json() )
        .subscribe( data => {
          this.util.detenerLoading();
          if ( data.row == 0 && this.paginaPA == 0 && this.filtrosPA.length > 0 ) {//Se esta haciendo una busqueda pero no se encontro ningun registro
            //this.util.msj ("Prestamo Activo no encontrado", data.msj );
            this.paginaPA += 1;
            this.msjGralActivo = data.msj;
          }else if ( data.row == 0 && this.paginaPA == 0 && this.filtrosPA.length == 0 ) {//Se estan cargando todos los prestamos
            //this.util.msj ( "Sin registros", data.msj );
            this.paginaPA += 1;
            this.msjGralActivo = data.msj;
          } else if ( data.row > 0 ) {
            this.prestamosActivos = this.prestamosActivos.concat(data.prestamos);
            this.paginaPA += 1;
            this.util.esCambioPrestamo =  false;
            this.util.designarCambioC();
          }
          console.log("Prestamos Activos",this.prestamosActivos);
          resolve();
        })
    });
    return promesa;
  }
  private cargarPAClte(){
    if ( this.paginaPAClte == 0 && this.filtrosPAClte.length == 0 )
      this.util.crearLoading("Cargando Prestamos Activos");
    else if ( this.paginaPAClte == 0 && this.filtrosPAClte.length > 0 )
      this.util.crearLoading("Buscando Prestamos Activos ...");

    let promesa = new Promise(  (resolve, reject)=>{
      let url = URL_SERVICIOS + "prestamos/mostrarActivos?idC=" + this.idC + "&pagina=" + this.paginaPAClte + "&filtros=" + JSON.stringify(this.filtrosPAClte) + "&dataBusqueda=" + JSON.stringify(this.dataBusquedaPAClte);
      this.http.get( url )
        .map( resp=> resp.json() )
        .subscribe( data => {
          this.util.detenerLoading();
          if ( data.row == 0 && this.paginaPAClte == 0 && this.filtrosPAClte.length > 0 ) {//Se esta haciendo una busqueda pero no se encontro ningun registro
            //this.util.msj ("Prestamo Activo no encontrado", data.msj );
            this.paginaPAClte += 1;
            this.msjClteActivo = data.msj;
          }else if ( data.row == 0 && this.paginaPAClte == 0 && this.filtrosPAClte.length == 0 ) {//Se estan cargando todos los prestamos
            //this.util.msj ( "Sin registros", data.msj);
            this.paginaPAClte += 1;
            this.msjClteActivo = data.msj;
          } else if ( data.row > 0 ) {
            this.prestamosActivosClte = this.prestamosActivosClte.concat(data.prestamos);
            this.paginaPAClte += 1;
            this.util.designarCambioC();
          }
          console.log("Prestamos Activos",this.prestamosActivosClte);
          resolve();
        })
    });
    return promesa;
  }

  public cargarPrestamosCerrados(bnd: boolean = true){ if(bnd) return this.cargarPCGral(); else return this.cargarPCClte(); }
  private cargarPCGral(){
    if ( this.paginaPC == 0 && this.filtrosPC.length == 0 )
      this.util.crearLoading("Cargando Prestamos Cerrados");
    else if ( this.paginaPC == 0 && this.filtrosPC.length > 0 )
      this.util.crearLoading("Buscando Prestamos Cerrados ...");

    let promesa = new Promise(  (resolve, reject)=>{
      let url = URL_SERVICIOS + "prestamos/mostrarPrestamosCerrados?idC="+this.idC+"&pagina=" + this.paginaPC+"&filtros="+JSON.stringify(this.filtrosPC)+"&dataBusqueda="+JSON.stringify(this.dataBusquedaPC);
      this.http.get( url )
        .map( resp=> resp.json() )
        .subscribe( data =>{
          this.util.detenerLoading();
          if ( data.row == 0 && this.paginaPC == 0 && this.filtrosPC.length > 0 ) {//Se esta haciendo una busqueda pero no se encontro ningun registro
            //this.util.msj ("Prestamo Cerrado no encontrado", data.msj );
            this.paginaPC += 1;
            this.msjGralCerrado = data.msj;
          }else if ( data.row == 0 && this.paginaPC == 0 && this.filtrosPC.length == 0 ) {//Se estan cargando todos los prestamos
            //this.util.msj ( "Sin registros", data.msj);
            this.paginaPC += 1;
            this.msjGralCerrado = data.msj;
          } else if ( data.row > 0 ) {
            this.prestamosCerrados = this.prestamosCerrados.concat(data.prestamos);
            this.paginaPC += 1;

          }
          this.util.esCambioPrestamo = false;
          this.util.designarCambioC();
          console.log("Prestamos Cerrados", this.prestamosCerrados);
          resolve();
        })
    });
    return promesa;
  }
  private cargarPCClte(){
    if ( this.paginaPCClte == 0 && this.filtrosPCClte.length == 0 )
      this.util.crearLoading("Cargando Prestamos Cerrados");
    else if ( this.paginaPCClte == 0 && this.filtrosPCClte.length > 0 )
      this.util.crearLoading("Buscando Prestamos Cerrados ...");

    let promesa = new Promise(  (resolve, reject)=>{
      let url = URL_SERVICIOS + "prestamos/mostrarPrestamosCerrados?idC="+this.idC+"&pagina=" + this.paginaPCClte+"&filtros="+JSON.stringify(this.filtrosPCClte)+"&dataBusqueda="+JSON.stringify(this.dataBusquedaPCClte);
      this.http.get( url )
        .map( resp=> resp.json() )
        .subscribe( data =>{
          this.util.detenerLoading();
          if ( data.row == 0 && this.paginaPCClte == 0 && this.filtrosPCClte.length > 0 ) {//Se esta haciendo una busqueda pero no se encontro ningun registro
            //this.util.msj ("Prestamo Cerrado no encontrado", data.msj );
            this.paginaPCClte += 1;
            this.msjClteCerrado = data.msj;
          }else if ( data.row == 0 && this.paginaPCClte == 0 && this.filtrosPCClte.length == 0 ) {//Se estan cargando todos los prestamos
            //this.util.msj ( "Sin registros", data.msj);
            this.paginaPCClte += 1;
            this.msjClteCerrado = data.msj;
          } else if ( data.row > 0 ) {
            this.prestamosCerradosClte = this.prestamosCerradosClte.concat(data.prestamos);
            this.paginaPCClte += 1;
            //this.util.designarCambioC();//Sol se podra actualizar la variable cuando es Clte
          }
          console.log("Prestamos Cerrados", this.prestamosCerradosClte);
          resolve();
        })
    });
    return promesa;
  }

  /*Probando*/
  public cargarPrestamosEliminados(esActivo: number){
    console.log("Entre jajaja");
    this.util.crearLoading((esActivo == 1) ? "Cargando Prestamos Activos Eliminados": "Cargando Prestamos Cerrados Eliminados");
    let promesa = new Promise(  (resolve, reject)=> {
      if(esActivo == 1) this.prestamosActivosEliminados = []; else this.prestamosCerradosEliminados = [];
      let url = URL_SERVICIOS + "prestamos/mostrarPrestamosEliminados?esActivo=" + esActivo;
      this.http.get(url)
        .map(resp => resp.json())
        .subscribe(data => {
          this.util.detenerLoading();
          if (data.row == 0) {

            //this.util.msj("Error", data.msj);
          } else {
            if (esActivo == 1) {this.prestamosActivosEliminados = data.prestamos; this.util.esCambioPrestamoAcElim = false;} else {this.prestamosCerradosEliminados = data.prestamos; this.util.esCambioPrestamoCeElim = false;}
            console.log(data.prestamos);
          }
          resolve();
        });
    });
    return promesa;
  }

  /*No Aplica (Solo aplicable para Prestamos de un cliente)*/
  /*Optimzado y terminado*/
  public agregarPrestamo(datos:any, esGarantia, id:any, token:any, cliente:any){//Solo aplica para la vista de un cliente en particular.
    this.util.crearLoading("Creando nuevo Prestamo. ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("id", id);
    dataP.append("token", token );
    dataP.append("cliente", cliente );
    dataP.append("fecha", datos.fecha );
    dataP.append("esGarantia", esGarantia );
    if(esGarantia == 1)
      dataP.append("bien", datos.bien );
    dataP.append("estado_bien", datos.estado_bien );
    dataP.append("cantidad", datos.cantidad );
    dataP.append("interes", datos.interes );
    dataP.append("observacion", datos.observacion );

    let url = URL_SERVICIOS + "prestamos/agregarActivos";

    return this.http.post( url, dataP )
      .map( resp=>{
        let data = resp.json();
        console.log( data );
        this.util.detenerLoading();
        if( data.error != 0){//Ocurrio un errro al,ingresar el prestamo
          this.util.msj("Error al ingresar el Prestamo",data.msj);
          this.isNew=false;
        }else{//El prestamo se ingreso correctamente a la BD
          if(data.rows == 1)//Se recupero y se anexa a la primera posicion del array el prestamo nuevo agregado
            this.prestamosActivosClte.unshift(data.prestamo[0]);
          else//No se recuper el nuevo prestamo, se tendra que recargartodo el arreglo
            this.cargarTodosPrestamosActivos(false);
          console.log(this.prestamosActivosClte);
          this.util.toast(data.msj);
          this.isNew=true;
          this.ActualizaresCambioPrestamoGral();
        }
      });
  }

  /*Optimizado en una sola funcion :)*/
  public editarPrestamo(datos:any, esGarantia, id:any, token:any,idPrestamo:any, index:number, bnd: boolean){/*Bnd:= true es GRal; faalse := Clte*/
    this.util.crearLoading("Guardando datos, ¡ Porfavor Espere !");
    let dataP = new URLSearchParams();
    dataP.append("idPrestamo", idPrestamo);
    dataP.append("id", id);
    dataP.append("token", token );
    dataP.append("esGarantia", esGarantia );
    if(esGarantia == 1)
      dataP.append("bien", datos.bien );
    dataP.append("fecha", datos.fecha );
    dataP.append("estado_bien", datos.estado_bien );
    dataP.append("cantidad", datos.cantidad );
    dataP.append("interes", datos.interes );
    dataP.append("observacion", datos.observacion );

    let url = URL_SERVICIOS + "prestamos/editarActivos";

    return this.http.post( url, dataP )
      .map( resp=>{
        let data = resp.json();
        console.log( data );
        this.util.detenerLoading();
        if( data.error != 0){
          this.util.msj("Error al editar el Prestamo",data.msj);
          this.isNew=false;
        }else{
          if(data.fechaAnt && data.rows!=0){//Tienen la misma fecha solo es actualizar el item en el array recupero el prestamo editado; actualizar la psocion del arreglo
            if(bnd) this.prestamosActivos.splice(index, 1, data.prestamo[0]); else this.prestamosActivosClte.splice(index, 1, data.prestamo[0]);
          }else//Sino recargartodo el array
            this.cargarTodosPrestamosActivos(bnd);
          this.util.toast(data.msj);
          this.isNew=true;
          if(!bnd) this.ActualizaresCambioPrestamoGral(idPrestamo);//Slo se actualiza cuando se trata de Clte.
        }
      });
  }
  /*Probando*/
  public eliminarPermanentementePrestamo(id, token, idPrestamo, index, esActivo ){
    this.util.crearLoading((esActivo == 1) ? "¡ Eliminando Prestamo Activo de la Base de Datos !" : "¡ Eliminando Prestamo Cerrado de la Base de Datos !");
    let dataP = new URLSearchParams();
    dataP.append("idPrestamo", idPrestamo);
    dataP.append("id", id );
    dataP.append("token", token );
    let url = URL_SERVICIOS + "prestamos/eliminarPmntePrestamo";
    return this.http.post( url, dataP ).map( resp => resp.json()).subscribe((data) =>{
      console.log( data );
      this.util.detenerLoading();
      if( data.error != 0){
        this.util.msj(data.titulo, data.msj);
        this.isNew=false;
      }else{
        if(esActivo == 1) this.prestamosActivosEliminados.splice(index,1); else this.prestamosCerradosEliminados.splice(index, 1);

        this.util.toast(data.msj);
        this.isNew=true;
      }
    });
  }

  /*Optimizado en una sola funcion :)*/
  public eliminarPrestamo(idPrestamo:any, id:any, token:any, index:number, bndGral: boolean = true, bndActivo: number = 1){
    this.util.crearLoading((bndActivo == 1) ? "¡ Cancelando Prestamo Activo !" : "Eliminando Prestamo Cerrado");
      let dataP = new URLSearchParams();
      dataP.append("idPrestamo", idPrestamo);
      dataP.append("bndActivo", bndActivo.toString() );
      dataP.append("id", id );
      dataP.append("token", token );
      let url = URL_SERVICIOS + "prestamos/eliminarLogicaPrestamo";
      return this.http.post( url, dataP ).map( resp => resp.json()).subscribe((data) =>{
          console.log( data );
          this.util.detenerLoading();
          if( data.error != 0){
            this.util.msj(data.titulo, data.msj);
            this.isNew=false;
          }else{
            if(bndGral) {
              if(bndActivo == 1) {this.prestamosActivos.splice(index,1); this.util.esCambioPrestamoAcElim = true} else {this.prestamosCerrados.splice(index,1); this.util.esCambioPrestamoCeElim = true;}
            } else {
              if(bndActivo == 1) {this.prestamosActivosClte.splice(index,1); this.util.esCambioPrestamoAcElim = true} else {this.prestamosCerradosClte.splice(index,1); this.util.esCambioPrestamoCeElim = true;}
              this.ActualizaresCambioPrestamoGral(idPrestamo);
            }
            this.util.toast(data.msj);
            this.isNew=true;
          }
        });
  }
  public restaurarPrestamo(id, token, idPrestamo, esActivo, index ){
    this.util.crearLoading((esActivo == 1) ? "¡ Restaurando Prestamo Activo !" : "¡ Restaurando Prestamo Cerrado !");
    let dataP = new URLSearchParams();
    dataP.append("idPrestamo", idPrestamo);
    dataP.append("id", id );
    dataP.append("token", token );
    let url = URL_SERVICIOS + "prestamos/restaurarPrestamo";
    return this.http.post( url, dataP ).map( resp => resp.json()).subscribe((data) =>{
      console.log( data );
      this.util.detenerLoading();
      if( data.error != 0){
        this.util.msj(data.titulo, data.msj);
        this.isNew=false;
      }else{
        if(esActivo == 1) this.prestamosActivosEliminados.splice(index,1); else this.prestamosCerradosEliminados.splice(index, 1);
        this.util.esCambioPrestamo = true;
        this.util.toast(data.msj);
        this.isNew=true;
      }
    });
  }
  public deshacerCierrePrestamo(idP, id:any, token:any, bndGral: boolean = true){
    this.util.crearLoading("¡ Cambiando status del prestamo a 'Activo' !");
    let dataP = new URLSearchParams();
    dataP.append("idPrestamo", idP);
    dataP.append("id", id );
    dataP.append("token", token );
    let url = URL_SERVICIOS + "prestamos/deshacerCierrePrestamo";
    return this.http.post(url, dataP).map(resp => resp.json()).subscribe((data) => {
      this.util.detenerLoading();
      if( data.error != 0){
        this.util.msj(data.titulo, data.msj);
        this.isNew=false;
      }else{
        this.cargarTodosPrestamosActivos(bndGral);
        this.cargarTodosPrestamosCerrados(bndGral);
        if(!bndGral){
          this.ActualizaresCambioPrestamoGral(idP);
        }
        this.util.toast(data.msj);
        this.isNew=true;
      }
    });
  }
  public cerrarPrestamoActivo(idP, fechaCierre ,razon,  id:any, token:any, bndGral: boolean = true){
    this.util.crearLoading("¡ Cerrando Prestamo Activo !");
    let dataP = new URLSearchParams();
    dataP.append("idPrestamo", idP);
    dataP.append("fechaCierre", fechaCierre);
    dataP.append("razon", razon);
    dataP.append("id", id );
    dataP.append("token", token );
    let url = URL_SERVICIOS + "prestamos/cerrarPrestamoActivo";
    return this.http.post( url, dataP )
      .map( resp=>{
        let data = resp.json();
        console.log( data );
        this.util.detenerLoading();
        if( data.error != 0){
          this.util.msj(data.titulo, data.msj);
          this.isNew=false;
        }else{
          this.cargarTodosPrestamosActivos(bndGral);
          this.cargarTodosPrestamosCerrados(bndGral);
          this.util.toast(data.msj);
          this.isNew=true;
        }
      });
  }

  ActualizaresCambioPrestamoGral(idPAfectado: number = 0){//Alta:0,Editar, Cancelar, Borrar, Deshacer, Cerrar
    if(this.util.respaldoidPrestamoGral == idPAfectado){
      this.util.esCambioPrestamoAbono = true;
    }
    this.util.esCambioPrestamo = true;
  }



}
