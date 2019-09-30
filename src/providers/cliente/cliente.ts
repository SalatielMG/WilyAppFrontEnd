import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { URL_SERVICIOS } from "../../config/url.servicios";
import { Utilerias } from "../../util/utilerias";
import 'rxjs/add/operator/map';

@Injectable()
export class ClienteProvider {

  msjCliente: string = "";

  index=[];
  idClientes=[];
  pagina:number = 0;
  clientes:any[]=[];
  clientesEliminados:any[]=[];
  cliente:any[]=null;
  isNew:boolean=false;
  buscar:string="";
  numCliente:number;
  sexo:string="1";

  constructor(public http: Http, public util:Utilerias) {
    //this.cargarTodosClientes();
  }
  public cargarTodosClientes(mmm: boolean = false){
    this.buscar="";
    this.resetear();
    this.cargarClientes(mmm);
  }
  public resetear(){
    this.pagina=0;
    this.clientes=[];
    this.resetSeleccion();
  }
  private resetSeleccion(){
    this.idClientes=[];
    this.index=[];
  }
  public cargarClientes(mmm: boolean = false){
    if(this.pagina==0&&this.buscar==""){
      this.util.crearLoading("Cargando Todos Tus Clientes ...");
      console.log("Cargando Todos Tus Clientes ...");
    }else if(this.pagina==0&&this.buscar!=""){
      this.util.crearLoading("Buscando Clientes ...");
      console.log("Buscando clientes "+this.buscar);
    }
    let promesa = new Promise(  (resolve, reject)=>{
      let url = URL_SERVICIOS + "clientes/mostrar?pagina=" + this.pagina+"&buscar="+this.buscar;
      this.http.get( url )
        .map( resp => resp.json() )
        .subscribe( data =>{
          this.util.detenerLoading();
          if( data.rows == 0 && this.pagina == 0 && this.buscar != ""){
            this.util.msj("Cliente no encontrado","No hay registro de ningun cliente con los datos: "+this.buscar);
            this.msjCliente = "No hay registro de ningun cliente con los datos: "+this.buscar;
          }else if(data.rows == 0 && this.pagina == 0 && this.buscar == "" ){
            this.util.msj("Registros no encontrados","No hay registros de ningun cliente Activo en la Base de Datos");
            this.msjCliente = "No se recuperaron nigun registro";
          } else{
            let nuevaData = this.agrupar( data.clientes, 2 );
            this.clientes.push( ...nuevaData );
            this.pagina +=1;
            console.log(this.clientes);
            //Actualizar varible de numCliente
            this.util.esCambioClte = false;
            if(mmm) this.util.esCambioClte = true;
            this.actualizarNumcliente();
            console.log(this.numCliente);
          }
          resolve();
        })
    });
    /*console.log(promesa);
    console.log(promesa["__zone_symbol__state"]);*/
    return promesa;
  }

  public cargarClientesEliminados(){
    let promesa = new Promise(  (resolve, reject)=>{
      this.clientesEliminados = [];
      let url = URL_SERVICIOS + "clientes/mostrarClientesEliminados";
      this.http.get( url )
        .map( resp => resp.json() )
        .subscribe( data =>{
          this.util.detenerLoading();
          if( data.row == 0){
            //this.util.msj("Error",data.msj);
          }else{
            this.clientesEliminados = data.clientes;
            this.util.esCambioClienteEliminado = false;
            console.log(this.clientesEliminados);
          }
          resolve();
        })
    });
    return promesa;
  }

  public agregarCliente(datos:any, id:any, token:any){
      let dataO = new URLSearchParams();
      dataO.append("id", id );
      dataO.append("token", token );
      dataO.append("nombre", datos.nombre );
      dataO.append("apellidos", datos.apellidos );
      dataO.append("sexo", this.sexo );
      dataO.append("direccion", datos.direccion );
      dataO.append("telefono", datos.telefono );
      let url = URL_SERVICIOS + "clientes/agregar";
      return this.http.post( url, dataO )
        .map( resp=>{
          let data = resp.json();
          console.log( data );
          this.util.detenerLoading();
          if( data.error != 0){
            this.util.msj("Error al ingresar el cliente: "+datos.nombre,data.msj);
            this.isNew=false;
          }else{
            this.cliente=data.cliente[0];
            this.cargarTodosClientes();
            this.util.toast(data.msj,"top");
            this.isNew=true;
          }
        });
    }
    public editarCliente(datos:any,id:any, token:any,idCliente:any){
      let dataP = new URLSearchParams();
      dataP.append("idCliente", idCliente);
      dataP.append("id", id);
      dataP.append("token", token );
      dataP.append("nombre", datos.nombre );
      dataP.append("apellido", datos.apellidos );
      dataP.append("sexo", this.sexo );
      dataP.append("direccion", datos.direccion );
      dataP.append("telefono", datos.telefono );
      let url = URL_SERVICIOS + "clientes/editar";
      return this.http.post( url, dataP )
        .map( resp=>{
          let data = resp.json();
          console.log( data );
          this.util.detenerLoading();
          if( data.error != 0){
            this.util.msj("Error al editar los datos del Cliente: "+datos.nombre,data.msj);
            this.isNew=false;
          }else{
            //Actualizar el arreglo obteniendo los datos del cliente editado
            if(data.rows!=0){//recupero el cliente editado; actualizar la psocion del arreglo
              this.clientes[this.index[0]["row"]].splice(this.index[0]["col"], 1, data.cliente[0]);
              this.resetSeleccion();
            }else//No obtuvo el cliente editado; hay que recargar todos los cliente activos
              this.cargarTodosClientes();
            if(data.tienePrestamo>0)
              this.util.asignarCambioC();
            this.util.toast(data.msj,"top");
            this.isNew=true;
          }
        });
    }
    public restaurarCliente(id, token, idCliente, index){
      this.util.crearLoading("Restaurando Cliente, Porfavor Espere");
      let dataP = new URLSearchParams();
      dataP.append("id", id );
      dataP.append("token", token );
      dataP.append("idCliente", idCliente );
        let url = URL_SERVICIOS + "clientes/restaurarCliente";
        return this.http.post(url, dataP).map(resp => resp.json()).subscribe((data) => {
          console.log(data);
          this.util.detenerLoading();
          if (data.error != 0) {
            this.util.msj(data.titulo, data.msj);
            this.isNew = false;
          } else {
            this.clientesEliminados.splice(index, 1);
            this.util.esCambioClte = true;
            if(data.tienePrestamos > 0) this.util.esCambioPrestamo = true;
            this.util.toast(data.msj, "top");
            this.isNew = true;
          }
      });
    }
    public eliminarPermanentementeCliente(id, token, idCliente, index){
      this.util.crearLoading("Eliminando Cliente de la Base de Datos, Porfavor Espere");
      let dataP = new URLSearchParams();
      dataP.append("id", id );
      dataP.append("token", token );
      dataP.append("idCliente", idCliente );
      let url = URL_SERVICIOS + "clientes/eliminarPmnteCliente";
      return this.http.post( url, dataP ).map( resp => resp.json()).subscribe((data) =>{
          console.log( data );
          this.util.detenerLoading();
          if( data.error != 0){
            this.util.msj(data.titulo,data.msj);
            this.isNew=false;
          }else{
            this.clientesEliminados.splice(index,1);
            this.util.toast(data.msj,"top");
            this.isNew=true;
          }
        });
    }

    public eliminarClientes(id:any, token:any){
      let dataP = new URLSearchParams();
      dataP.append("Clientes", JSON.stringify(this.idClientes));
      dataP.append("id", id );
      dataP.append("token", token );
      let url = URL_SERVICIOS + "clientes/eliminar";
      return this.http.post( url, dataP )
        .map( resp=>{
          let data = resp.json();
          console.log( data );
          this.util.detenerLoading();
          if( data.error != 0){
            this.util.msj("Error al eliminar el(los) cliente(s)",data.msj);
            this.isNew=false;
          }else{

            this.cargarTodosClientes(true);
            this.util.esCambioClienteEliminado = true;
            if(data.clientesConPrestamo>0)
              this.util.asignarCambioC();
            this.util.toast(data.msj,"top");
            this.isNew=true;
          }
        });
    }

    private agrupar( arr:any, tamano:number ){
      let nuevoArreglo = [];
      for( let i = 0; i<arr.length; i+=tamano ){
        nuevoArreglo.push( arr.slice(i, i+tamano) );
      }
      console.log( nuevoArreglo );
      return nuevoArreglo;
    }
    private actualizarNumcliente(){
      this.numCliente=(this.clientes[this.clientes.length-1].length==1)? this.clientes.length*2-1:this.clientes.length*2;
    }
}
