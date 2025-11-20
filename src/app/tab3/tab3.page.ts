import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { IDGANNOTES, IDGANNOTESPEQ, IDPESTINNOS, IDROSCOS, IDEMPANADILLAS } from 'src/model/CONSTANTES';
import { ESTADOS } from 'src/model/ESTADOS';
import { Existencia } from 'src/model/Existencia';
import { Pedido } from 'src/model/Pedido';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  public existencias: Array<Existencia> = new Array();
  isLoading = false;

  public contadorGanno: number = 0;
  public contadorPesti: number = 0;
  public contadorRoscos: number = 0;
  public contadorGannoPeq: number = 0;
  public contadorEmpanadillas: number=0;

  public pedidos: Array<Pedido> = new Array();

  constructor(private firebase: FireServiceProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController) { }

  ngOnInit() {

  }//end ngOnInit

ionViewWillEnter() {
  this.presentLoading();

  Promise.all([
    this.getExistencias(),
    this.getPedidos()
  ])
  .finally(() => {
    this.dismiss();
  });
}
async getExistencias() {
  try {
    const element = await this.firebase.getExistencias();
    this.existencias = element;
    this.calcularContadores();
  } catch (error) {
    console.log(error);
  }
}


 async getPedidos() {
  try {
    const element = await this.firebase.getPedidos();
    this.pedidos = element;
    this.calcularContadores();
  } catch (error) {
    console.log(error);
  }
}


  opciones(existencia: Existencia) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        message: '¿Quieres sumar o restar?',
        buttons: [
          {
            text: 'Restar',
            handler: () => {
              this.restarExistencia(existencia);

            },
          },
          {
            text: 'Sumar',
            handler: () => {
              this.sumarExistencia(existencia);
            },
          },
          {
            text: 'Modificar',
            handler: () => {
              this.modExistencia(existencia);
            },
          },
          {
            text: 'Cancelar',
            handler: () => {
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end opciones
  sumarExistencia(existencia: Existencia) {
    let titulo='Modificar ' + existencia.nombre + ' (En docenas)';
    if(existencia.id==IDROSCOS ||  existencia.id == IDPESTINNOS){
      titulo='Modificar ' + existencia.nombre + '(En KG)'
    }
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          titulo,
        inputs: [
          {
            name: 'sumExis',
            value: 1,
            type: 'number',
            placeholder: 'Sumar Existencia',
            min: 0.1
          }
        ],
        buttons: [

          {
            text: 'Cancelar',
            handler: () => {
              console.log('Cancelar');
            },
          },
          {
            text: 'Sumar',
            handler: (data: any) => {
              existencia.cantidad += parseFloat(data['sumExis'])
              this.update(existencia);
            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end sumarExistencia
  restarExistencia(existencia: Existencia) {
    let titulo='Modificar ' + existencia.nombre + ' (En docenas)';
    if(existencia.id==IDROSCOS ||  existencia.id == IDPESTINNOS){
      titulo='Modificar ' + existencia.nombre + '(En KG)'
    }
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
         titulo,
        inputs: [
          {
            name: 'resExis',
            value: 1,
            type: 'number',
            placeholder: 'Restar Existencia',
            min: 0.1
          }
        ],
        buttons: [

          {
            text: 'Cancelar',
            handler: () => {
              console.log('Cancelar');
            },
          },
          {
            text: 'Restar',
            handler: (data: any) => {
              existencia.cantidad -= parseFloat(data['resExis'])
              this.update(existencia);
            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end restarExistencia


  modExistencia(existencia: Existencia) {
    let titulo='Modificar ' + existencia.nombre + ' (En docenas)';
    if(existencia.id==IDROSCOS ||  existencia.id == IDPESTINNOS){
      titulo='Modificar ' + existencia.nombre + '(En KG)'
    }
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header: titulo,
        inputs: [
          {
            name: 'modExis',
            value: 1,
            type: 'number',
            placeholder: 'Modificar Existencia',
            min: 0.1
          }
        ],
        buttons: [

          {
            text: 'Cancelar',
            handler: () => {
              console.log('Cancelar');
            },
          },
          {
            text: 'Modificar',
            handler: (data: any) => {
              existencia.cantidad = parseFloat(data['modExis'])
              this.update(existencia);
            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end modificarExistencia


  update(existencia: Existencia) {
    this.firebase.modificarExistencia(existencia)
      .then(() => {

      }).catch((error: string) => {
        console.log(error)
      })
  }//end update
 private loading: HTMLIonLoadingElement | null = null;

async presentLoading() {
  if (this.loading) return; // evita loading duplicados

  this.loading = await this.loadingCtrl.create({
    message: 'Cargando existencias...',
    spinner: 'bubbles',
    cssClass: 'custom-loading',
  });

  await this.loading.present();
}


async dismiss() {
  if (this.loading) {
    await this.loading.dismiss();
    this.loading = null;
  }
}
  calcularContadores() {
    this.contadorGanno = 0;
    this.contadorGannoPeq = 0;
    this.contadorPesti = 0;
    this.contadorRoscos = 0;
    this.contadorEmpanadillas = 0;

    //Calcular cuantos pedidos hay de cada dulce
    for (let inx = 0; inx < this.pedidos.length; inx++) {

      if (this.pedidos[inx].estado != ESTADOS.ENTREGADO) {
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
          else if (this.pedidos[inx].productos[j].nombre === "Empanadillas") {
            this.contadorEmpanadillas += this.pedidos[inx].productos[j].cantidad;
          }
        }
      }

    }

    //Restar para saber los que quedan por hacer
    for (let inx = 0; inx < this.existencias.length; inx++) {
      if (this.existencias[inx].id === IDGANNOTES) {
        this.contadorGanno -= this.existencias[inx].cantidad;
      } else if (this.existencias[inx].id === IDGANNOTESPEQ) {
        this.contadorGannoPeq -= this.existencias[inx].cantidad;
      } else if (this.existencias[inx].id === IDPESTINNOS) {
        this.contadorPesti -= this.existencias[inx].cantidad;
      } else if (this.existencias[inx].id === IDROSCOS) {
        this.contadorRoscos -= this.existencias[inx].cantidad;
      }else if (this.existencias[inx].id === IDEMPANADILLAS) {
        this.contadorEmpanadillas -= this.existencias[inx].cantidad;
      }
      
    }
  }//end calcularContadores

}
