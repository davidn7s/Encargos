import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Precio } from 'src/model/Precio';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-precio',
  templateUrl: './agregar-precio.page.html',
  styleUrls: ['./agregar-precio.page.scss'],
})
export class AgregarPrecioPage implements OnInit {

  precio:Precio= new Precio();

  isLoading:boolean=false;
  
  constructor(private  fireService:FireServiceProvider, private toastCtrl: ToastController,private navCtrl: NavController,private loadingCtrl:LoadingController) { }

  ngOnInit() {
  }

 agregar(){
  this.precio.id=this.precio.nombre.toUpperCase();
  this.fireService.getPrecioByID(this.precio.id).then((element)=>{
    this.presentToast("Ya existe un precio asignado para " + this.precio.nombre)
  }).catch((error)=>{
    this.fireService.insertarPrecios(this.precio)
    .then((element)=>{
      this.presentToast("Se ha agregado un nuevo precio para " + this.precio.nombre)
      this.volver();
    })
    .catch((error)=>{
      console.log(error)
    })
  })

  
 }//end agregar
  
  deshabilitado() {
    if (this.precio.nombre == null)
      return true;
    if (this.precio.nombre == '')
      return true;
    if (this.precio.nombre.length < 3)
      return true;
    if (this.precio.precio == null)
      return true;
    if (this.precio.precio <=0)
      return true;
 
    return false;
  } // end deshabilitado

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 6000,
    });
    toast.present();
  } //end Toast

  volver() {
    this.navCtrl.navigateBack('tabs/tab2');
  }


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
  }
}
