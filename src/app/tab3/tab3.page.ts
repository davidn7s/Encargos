import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { IDGANNOTES, IDGANNOTESPEQ, IDPESTINNOS, IDROSCOS } from 'src/model/CONSTANTES';
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

  public pedidos: Array<Pedido> = new Array();

  constructor(private firebase: FireServiceProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.firebase.getExistenciasTR().subscribe(() => {
      this.getExistencias();
      this.contadorGanno = 0;
      this.contadorGannoPeq = 0;
      this.contadorPesti = 0;
      this.contadorRoscos = 0;
      this.calcularContadores();
    });
    this.firebase.getPedidosTR().subscribe(() => {
      this.contadorGanno = 0;
      this.contadorGannoPeq = 0;
      this.contadorPesti = 0;
      this.contadorRoscos = 0;
      this.getPedidos();
    });
  }//end ngOnInit
  getExistencias() {
    this.presentLoading();
    this.firebase.getExistencias()
      .then((element) => {
        this.existencias = element;
        this.dismiss();
      }).catch((error: string) => {
        console.log(error)
        this.dismiss();
      })
  }//end getExistencias
  async getPedidos() {
    try {
      this.presentLoading();

      // Esperar a que la promesa se complete
      const element = await this.firebase.getPedidos();

      // La promesa se resolvió, continuar con el código
      this.pedidos = element;

      // Llamar a otro método después de que la promesa se ha resuelto
      this.calcularContadores();
      this.dismiss();
    } catch (error) {
      console.log(error);
    }
  }//end getPedidos
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
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end opciones
  sumarExistencia(existencia: Existencia) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          'Sumar ' + existencia.nombre + ' (En docenas)',
        inputs: [
          {
            name: 'sumExis',
            value: 1,
            type: 'number',
            placeholder: 'Sumar Existencia',
            min: 1
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
              existencia.cantidad += parseInt(data['sumExis'])
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
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        header:
          'Restar ' + existencia.nombre +  ' (En docenas)',
        inputs: [
          {
            name: 'resExis',
            value: 1,
            type: 'number',
            placeholder: 'Restar Existencia',
            min: 1
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
              existencia.cantidad -= parseInt(data['resExis'])
              this.update(existencia);
            },
          }
        ],
      })
      .then((res) => {
        res.present();
      });
  }//end restarExistencia
  update(existencia: Existencia) {
    this.firebase.modificarExistencia(existencia)
      .then(() => {

      }).catch((error: string) => {
        console.log(error)
      })
  }//end update
  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: 'Cargando existencias...',
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
  calcularContadores() {
    this.presentLoading();

    //Calcular cuantos pedidos hay de cada dulce
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
    }

  //Restar para saber los que quedan por hacer
  for(let inx=0; inx<this.existencias.length; inx++){
    if(this.existencias[inx].id === IDGANNOTES){
      this.contadorGanno-=this.existencias[inx].cantidad;
    }else if(this.existencias[inx].id === IDGANNOTESPEQ){
      this.contadorGannoPeq-=this.existencias[inx].cantidad;
    }else if(this.existencias[inx].id === IDPESTINNOS){
      this.contadorPesti-=this.existencias[inx].cantidad;
    }else if(this.existencias[inx].id === IDROSCOS){
      this.contadorRoscos -= this.existencias[inx].cantidad;
    }
  }

  this.dismiss();
  }//end calcularContadores

}
