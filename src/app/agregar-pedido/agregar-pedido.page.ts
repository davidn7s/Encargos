import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { IDGANNOTES, IDGANNOTESPEQ, IDPESTINNOS, IDROSCOS } from 'src/model/CONSTANTES';
import { Gannote } from 'src/model/Gannote';
import { Pedido } from 'src/model/Pedido';
import { Pestinno } from 'src/model/Pestinno';
import { Precio } from 'src/model/Precio';
import { Rosco } from 'src/model/Rosco';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-agregar-pedido',
  templateUrl: './agregar-pedido.page.html',
  styleUrls: ['./agregar-pedido.page.scss'],
})
export class AgregarPedidoPage implements OnInit {

  public pedido: Pedido = new Pedido();
  public cantidadGannote = 0;
  public gannote: Gannote = new Gannote();

  public cantidadGannotePeq = 0;
  public gannotePeq: Gannote = new Gannote();

  public cantidadPesti = 0;
  public pestinno: Pestinno = new Pestinno();

  public cantidadRosco = 0;
  public rosco: Rosco = new Rosco();

  fecha: Date = new Date();

  isLoading: boolean = false;

  constructor(private fireService: FireServiceProvider, private toastCtrl: ToastController, private navCtrl: NavController, private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
  }

  cargarFormulario() {

    this.presentLoading()
    const promesas: Promise<any>[] = [];

    if (this.cantidadGannote > 0) {
      this.gannote.cantidad = this.cantidadGannote;

      const gannotePromise = this.fireService.getPrecioByID(IDGANNOTES).then((element: Precio) => {
        this.gannote.precio = element.precio;
        this.gannote.id = IDGANNOTES;
        this.pedido.productos.push(this.gannote);


      })

      promesas.push(gannotePromise);
    }

    if (this.cantidadGannotePeq > 0) {
      this.gannotePeq.cantidad = this.cantidadGannotePeq;
      this.gannotePeq.pequenno = true;
      this.gannotePeq.nombre = Gannote.cambiarNombre(this.gannotePeq);

      const gannotePeqPromise = this.fireService.getPrecioByID(IDGANNOTESPEQ).then((element: Precio) => {
        this.gannotePeq.precio = element.precio;
        this.gannotePeq.id = IDGANNOTESPEQ;
        this.pedido.productos.push(this.gannotePeq);
      })

      promesas.push(gannotePeqPromise);
    }

    if (this.cantidadPesti > 0) {
      this.pestinno.cantidad = this.cantidadPesti;

      const pestinnosPromise = this.fireService.getPrecioByID(IDPESTINNOS).then((element: Precio) => {
        this.pestinno.precio = element.precio;
        this.pestinno.id = IDPESTINNOS;
        this.pedido.productos.push(this.pestinno);

      })

      promesas.push(pestinnosPromise);
    }

    if (this.cantidadRosco > 0) {
      this.rosco.cantidad = this.cantidadRosco;
      const roscoPromise = this.fireService.getPrecioByID(IDROSCOS).then((element: Precio) => {
        this.rosco.precio = element.precio;
        this.rosco.id = IDROSCOS;
        this.pedido.productos.push(this.rosco);

      })

      promesas.push(roscoPromise);
    }


    // Esperar a que todas las promesas se completen antes de continuar
    Promise.all(promesas).then(() => {
      // Llamar al siguiente método después de que todas las consultas hayan terminado
      this.pedido.precioTotal = Pedido.calcularPrecioTotal(this.pedido.productos);

      let fechaN = new Date(this.fecha);

      const yyyy = fechaN.getFullYear();
      let mm: any = fechaN.getMonth() + 1;
      let dd: any = fechaN.getDate();

      if (dd < 10)
        dd = '0' + dd;
      if (mm < 10)
        mm = '0' + mm;

      this.pedido.fechaEntrega = dd + '/' + mm + '/' + yyyy;

      this.annadirBBDD();
      this.dismiss();
    });

  }//end cargarFormulario

  annadirBBDD() {
    this.fireService.insertarPedido(this.pedido)
      .then((element: any) => {
        this.presentToast("Se ha agregado el pedido de " + this.pedido.nombreCliente)
        this.volver();
      })

  }

  deshabilitado() {
    if (this.pedido.nombreCliente == null)
      return true;
    if (this.pedido.nombreCliente == '')
      return true;
    if (this.pedido.nombreCliente.length < 3)
      return true;
    if (this.cantidadGannote <= 0 && this.cantidadGannotePeq <= 0 && this.cantidadPesti <= 0 && this.cantidadRosco <= 0)
      return true;
    if (this.fecha == undefined)
      return true;

    return false;
  } // end deshabilitado

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  } //end Toast

  volver() {
    this.navCtrl.navigateBack('tabs/tab1');
  }


  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: 'Agregando Pedido...',
      spinner: 'bubbles',
      cssClass: 'custom-loading',
    }).then(a => {
      a.present().then(() => {
        ;
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }//end presentLoading


  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }

}
