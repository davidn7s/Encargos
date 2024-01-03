import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Pedido } from 'src/model/Pedido';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { ModificarPedidoPage } from '../modificar-pedido/modificar-pedido.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public pedidos: Array<Pedido> = new Array();
  public pedidosMuestra: Array<Pedido> = new Array();

  public precioTotalPedidos: number = 0;
  public contadorGanno: number = 0;
  public contadorPesti: number = 0;
  public contadorRoscos: number = 0;
  public contadorGannoPeq: number = 0;

  isLoading = false;

  textoBuscar: string = '';
  public tipo: string = 'todo';

  constructor(private firebase: FireServiceProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private modalController: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.firebase.getPedidosTR().subscribe(() => {
      this.contadorGanno = 0;
      this.contadorGannoPeq = 0;
      this.contadorPesti = 0;
      this.contadorRoscos = 0;
      this.precioTotalPedidos = 0;
      this.getPedidos();
    });
  }//end ngOnInit
  async getPedidos() {
    try {
      this.presentLoading();
      this.pedidosMuestra = new Array<Pedido>();

      // Esperar a que la promesa se complete
      const element = await this.firebase.getPedidos();

      // La promesa se resolvió, continuar con el código
      this.pedidos = element;
      this.pedidosMuestra = element;

      //Ordenar pedidos de más nuevas a más antiguas
      this.pedidos.sort((a, b) =>
        a.fechaEntrega > b.fechaEntrega ? 1 : -1
      );

      //Ordenar pedidos de más nuevas a más antiguas
      this.pedidosMuestra.sort((a, b) =>
        a.fechaEntrega > b.fechaEntrega ? 1 : -1
      );

      // Llamar a otro método después de que la promesa se ha resuelto
      this.calcularContadores();
      this.tipo = 'todo';
      this.dismiss();
    } catch (error) {
      console.log(error);
    }
  }//end getPedidos
  calcularPrecio() {
    for (let inx = 0; inx < this.pedidos.length; inx++) {
      this.precioTotalPedidos += this.pedidos[inx].precioTotal;
    }
  }//end calcularPrecio
  calcularContadores() {
    for (let inx = 0; inx < this.pedidos.length; inx++) {
      for (let j = 0; j < this.pedidos[inx].productos.length; j++) {
        if (this.pedidos[inx].productos[j].nombre === "Roscos") {
          this.contadorRoscos += this.pedidos[inx].productos[j].cantidad;
        } else if (this.pedidos[inx].productos[j].nombre === "Gañotes") {
          this.contadorGanno += this.pedidos[inx].productos[j].cantidad;
        } else if (this.pedidos[inx].productos[j].nombre === "Pestiños") {
          this.contadorPesti += this.pedidos[inx].productos[j].cantidad;
        }
        else if (this.pedidos[inx].productos[j].nombre === "Gañotes Pequeños") {
          this.contadorGannoPeq += this.pedidos[inx].productos[j].cantidad;
        }
      }

      this.precioTotalPedidos += this.pedidos[inx].precioTotal;
    }
  }//end calcularContadores
  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: 'Cargando pedidos...',
      spinner: 'bubbles',
      cssClass: 'custom-loading',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }//end presentLoading
  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }//end dismiss
  cambioTipo(evento:any) {
    this.pedidosMuestra = new Array();
    if (this.tipo !== 'todo') {
      if (this.tipo === 'Encargado') {
        this.pedidos.forEach((pedido: Pedido) => {
          if (pedido.estado == 'Encargado') this.pedidosMuestra.push(pedido);
        });
      } else if (this.tipo === 'Hecho') {
        this.pedidos.forEach((pedido: Pedido) => {
          if (pedido.estado == 'Hecho') this.pedidosMuestra.push(pedido);
        });
      } else if (this.tipo === 'Entregado') {
        this.pedidos.forEach((pedido: Pedido) => {
          if (pedido.estado == 'Entregado') this.pedidosMuestra.push(pedido);
        });
      }
    } else {
      this.pedidosMuestra = this.pedidos;
    }
    //Ordenar pedidos de más nuevas a más antiguas
    this.pedidosMuestra.sort((a, b) =>
      a.fechaEntrega > b.fechaEntrega ? 1 : -1
    );
  } //end cambioTipo
  buscar(ev:any) {
    this.textoBuscar = ev.detail.value;
  } //end buscar
  opciones(pedido: Pedido) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          'Opciones',
        buttons: [
          {
            text: 'Cambiar Estado',
            handler: () => {
              this.cambiarEstado(pedido);
            },
          },
          {
            text: 'Modificar',
            handler: (data: any) => {
              this.ventanaModal(pedido);
            },
          },
          {
            text: 'Eliminar',
            handler: (data: any) => {
              this.asegurar(pedido);
            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end opciones
  cambiarEstado(pedido: Pedido) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          'Opciones',
        inputs: [
          {
            name: 'estado',
            type: "radio",
            value: "Encargado",
            label: "Encargado"

          },
          {
            name: 'estado',
            type: "radio",
            value: "Hecho",
            label: "Hecho"

          },
          {
            name: 'estado',
            type: "radio",
            value: "Entregado",
            label: "Entregado"

          }
        ],
        buttons: [
          {
            text: 'Aceptar',
            handler: (data: any) => {
              pedido.estado=data;
              this.firebase.modificarPedido(pedido);
            },
          },
          {
            text: 'Cancelar',
            handler: (data: any) => {

            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end cambiarEstado
  asegurar(pedido: Pedido) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          `¿Estás seguro de eliminar el pedido de ${pedido.nombreCliente}?`,
        buttons: [
          {
            text: 'Eliminar',
            handler: () => {
              this.firebase.eliminarPedido(pedido)
                .then(() => {
                  this.presentToast("Pedido eliminado")
                })
            },
          },
          {
            text: 'Cancelar',
            handler: (data: any) => {
            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end asegurar
  async ventanaModal(pedido: Pedido) {
    const modal = await this.modalController.create({
      component: ModificarPedidoPage,
      componentProps: {
        pedidoJson: JSON.stringify(pedido),
      },
    });
    return await modal.present();
  }//end ventanaModal
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 6000,
    });
    toast.present();
  } //end Toast
}
