import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { IDGANNOTES, IDGANNOTESPEQ, IDPESTINNOS, IDROSCOS } from 'src/model/CONSTANTES';
import { Gannote } from 'src/model/Gannote';
import { Pedido } from 'src/model/Pedido';
import { Pestinno } from 'src/model/Pestinno';
import { Precio } from 'src/model/Precio';
import { Rosco } from 'src/model/Rosco';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-modificar-pedido',
  templateUrl: './modificar-pedido.page.html',
  styleUrls: ['./modificar-pedido.page.scss'],
})
export class ModificarPedidoPage implements OnInit {


  @Input() pedidoJson: any;

  public cantidadGannote = 0;
  public gannote: Gannote = new Gannote();

  public cantidadGannotePeq = 0;
  public gannotePeq: Gannote = new Gannote();

  public cantidadPesti = 0;
  public pestinno: Pestinno = new Pestinno();

  public cantidadRosco = 0;
  public rosco: Rosco = new Rosco();

  fecha: any;



  pedido: Pedido = new Pedido();

  isLoading: boolean = false;
  constructor(private fireService: FireServiceProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.pedido = Pedido.createFromJsonObject(JSON.parse(this.pedidoJson))
    this.fecha = this.pedido.fechaEntrega.split("/").reverse().join("-");
    this.calcularContadores();
  }

  calcularContadores() {

    for (let j = 0; j < this.pedido.productos.length; j++) {
      if (this.pedido.productos[j].nombre === "Roscos") {
        this.cantidadRosco += this.pedido.productos[j].cantidad;
      } else if (this.pedido.productos[j].nombre === "Gañotes") {
        this.cantidadGannote += this.pedido.productos[j].cantidad;
      } else if (this.pedido.productos[j].nombre === "Pestiños") {
        this.cantidadPesti += this.pedido.productos[j].cantidad;
      }
      else if (this.pedido.productos[j].nombre === "Gañotes Pequeños") {
        this.cantidadGannotePeq += this.pedido.productos[j].cantidad;
      }
    }

    this.pedido.productos = new Array<any>();
  }


  deshabilitado() {
    if (this.pedido.nombreCliente == null)
      return true;
    if (this.pedido.nombreCliente == '')
      return true;
    if (this.pedido.nombreCliente.length < 3)
      return true;
    if (this.cantidadGannote < 1 && this.cantidadGannotePeq < 1 && this.cantidadPesti < 1 && this.cantidadRosco < 1)
      return true;
    if (this.pedido.fechaEntrega == undefined)
      return true;

    return false;
  } // end deshabilitado

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

      this.modificarPedido();

      this.dismiss();
    });
  }//end cargarFormulario

  modificarPedido() {
    this.fireService.modificarPedido(this.pedido)
      .then(() => {
        this.presentToast("Se ha actualizado el pedido")
        this.closeModal();
      })
  }


  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  } //end Toast




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
          a.dismiss().then(() => console.log(''));
        }
      });
    });
  }//end presentLoading


  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  } //end closeModal
}
