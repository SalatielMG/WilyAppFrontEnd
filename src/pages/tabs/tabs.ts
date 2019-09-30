import { Component } from '@angular/core';
import { HomePage,ClientesPage,PapeleraPage,prestamosGralPage } from '../index.paginas';
import { UsuarioProvider,PrestamoProvider,ClienteProvider} from '../../providers/index.services';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage{

  tabCliente=ClientesPage;
  tabPapelera = PapeleraPage;
  tabLogin = HomePage;
  tabPrestamoActivos = prestamosGralPage;
  constructor(public usProvider:UsuarioProvider, public prestProvider:PrestamoProvider, public clientProvider:ClienteProvider ) {

  }

}
