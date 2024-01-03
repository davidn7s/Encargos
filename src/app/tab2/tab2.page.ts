import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Precio } from 'src/model/Precio';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public precios: Array<Precio> = new Array();

  constructor(private firebase:FireServiceProvider,private alertCtrl:AlertController) {}

  ngOnInit(){
    this.getPrecios();
  }

  ionViewDidEnter(){
    this.getPrecios();
  }

  getPrecios(){
     this.firebase.getPrecios()
     .then((element)=>{
      this.precios=element;
     })
  }

  opciones(precio:Precio){
    this.alertCtrl
    .create({
      cssClass: 'app-alert',
      message: '¿Quieres modificar el precio?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.modificarPrecio(precio);
          },
        },
        {
          text: 'No',
          handler: () => {
          
          },
        },
      ],
    })
    .then((res) => {
      res.present();
    });
  }


  modificarPrecio(precio:Precio){
    this.alertCtrl
    .create({
      cssClass: 'app-alert',
      header:
       'Modificar ' + precio.nombre,
      inputs: [
        {
          name: 'nuevoPrecio',
          value: 1,
          type: 'number',
          placeholder: 'Nuevo Precio',
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
          text: 'Cambiar',
          handler: (data: any) => {
            precio.precio = parseFloat(data['nuevoPrecio'])
            this.update(precio);
          },
        }
      ],
    })
    .then((res) => {
      res.present();
    });
  }


  update(precio: Precio) {
    this.firebase.modificarPrecio(precio)
      .then(() => {

      }).catch((error: string) => {
        console.log(error)
      })
  }//end update
  
}