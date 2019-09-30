import { Component } from '@angular/core';
import { UsuarioProvider } from '../../providers/index.services';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {
  usuario:string="";
  contrasena:string="";
  constructor(private usProvider:UsuarioProvider) {
    console.log("Desde el constructor:= "+this.usProvider.token);
  }

  ingresar(){
    this.usProvider.util.crearLoading("Verificando sus Credenciales, Porfavor Espere!!!...");
    this.usProvider.ingresar (this.usuario, this.contrasena).subscribe(
      ()=>{
        if(this.usProvider.activo()){
          console.log("Ya entre");
          console.log(this.usProvider.token);
        }else{
          console.log("Uff que mal");
          console.log(this.usProvider.token);
        }
        this.usProvider.util.detenerLoading();
      }
    );
  }

  probar(){
    this.usProvider.probarXd (this.usuario, this.contrasena).subscribe(
      ()=>{
        if(this.usProvider.activo()){
          console.log("Holis Ya entre");
        }else{
          console.log("Uff que mal");
        }
      }
    );
  }

}
