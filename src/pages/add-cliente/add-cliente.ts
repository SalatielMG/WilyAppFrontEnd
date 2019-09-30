import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteProvider,UsuarioProvider } from '../../providers/index.services';
import { ClientePage } from '../../pages/index.paginas';

@IonicPage()
@Component({
  selector: 'page-add-cliente',
  templateUrl: 'add-cliente.html',
})
export class AddClientePage {
  opcion:number=1;
  titulo:string="";
  btnSubmit:string="";
  activoInput:boolean=false;
  cliente:any={};
  sexo: boolean = true;
  myForm: FormGroup;

  constructor(private usProvider:UsuarioProvider,public clienteProvider:ClienteProvider,public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, public formBuilder: FormBuilder) {
    this.cliente = this.navParams.get("client");
    this.opcion = this.navParams.get('opcion');
    console.log(this.navParams.get("client"));
    console.log(this.navParams.get('opcion'));
    this.Opcion();
  }
  cambioSexo(ev:any){
    this.clienteProvider.sexo=ev;
    console.log(this.clienteProvider.sexo);
  }
  asignasexo(s){
    this.sexo=true;
    if(s==0){
      this.sexo=false;
    }
  }
  Opcion(){
    switch (this.opcion) {
      case 1://Alta
        this.titulo="Nuevo";
        this.activoInput=false;
        this.myForm = this.createMyForm();
        this.clienteProvider.sexo = "1";
        this.btnSubmit="Enviar";
        break;
      case 2://Editar
        this.titulo="Editar";
        this.activoInput=false;
        this.myForm = this.createMyForm(this.cliente["nombre"], this.cliente["apellido"], this.cliente["direccion"], this.cliente["telefono"]);
        this.clienteProvider.sexo=this.cliente.sexo;
        this.asignasexo(this.cliente.sexo);
        this.btnSubmit="Guardar";
        break;
    }
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  saveData(){
    switch (this.opcion) {
      case 1://Alta
        this.altas();
        break;
      case 2://Editar
        this.cambios();
        break;
    }
  }

  cambios(){
    this.clienteProvider.util.crearLoading("Procesando Datos del Cliente Editado, Porfavor Espere ...");
    this.clienteProvider.editarCliente(this.myForm.value,this.usProvider.id_usuario,this.usProvider.token,this.cliente["id"]).subscribe(()=>{
      if(this.clienteProvider.isNew){
        console.log("Holis Editado Cliente ");
        this.closeModal();
      }else{
        console.log("jajajaja No se pudo editar tu Cliente");
      }
    });
    console.log(this.myForm.value);
  }

  altas(){
    this.clienteProvider.util.crearLoading("Procesando Datos del Nuevo Cliente, Porfavor Espere ...");
    this.clienteProvider.agregarCliente(this.myForm.value,this.usProvider.id_usuario,this.usProvider.token).subscribe(()=>{
      if(this.clienteProvider.isNew){
          console.log("Holis nuevo cliente ");
          console.log(this.clienteProvider.cliente);
          this.navCtrl.push(ClientePage,{"client":this.clienteProvider.cliente});
          this.closeModal();
      }else{
        console.log("jajajaja");
      }
    });
  }

  private createMyForm(nombre="", apellidos="", direccion="", telefono=""){
    return this.formBuilder.group({
      nombre: [nombre, Validators.required],
      apellidos: [apellidos, Validators.required],
      direccion: [direccion, Validators.required],
      telefono: [telefono, Validators.required],
    });
  }
}
