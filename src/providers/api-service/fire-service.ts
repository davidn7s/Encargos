import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Existencia } from 'src/model/Existencia';
import { Pedido } from 'src/model/Pedido';
import { Precio } from 'src/model/Precio';


@Injectable()
export class FireServiceProvider {

  constructor(private angularFirestore: AngularFirestore) {
  }


  getPedidosTR(): any {
    return (this.angularFirestore.collection('Pedidos').snapshotChanges());
  }

  getExistenciasTR(): any {
    return (this.angularFirestore.collection('Existencias').snapshotChanges());
  }

  getPedidos(): Promise<Pedido[]> {
    let promise = new Promise<Pedido[]>((resolve, reject) => {
      const productoRef = this.angularFirestore.collection('Pedidos');
      const snapshot = productoRef.get().toPromise()
        .then((data: any) => {
          let productos = new Array<Pedido>();
          data.forEach((element: { data: () => any; }) => {
            let productoJson = element.data();
            let producto = Pedido.createFromJsonObject(productoJson);
            productos.push(producto);
          });
          resolve(productos);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }//end_get_productos

  insertarPedido(datosNuevoProducto: Pedido): Promise<Pedido> {
    let promise = new Promise<Pedido>((resolve, reject) => {
      datosNuevoProducto.id = this.angularFirestore.collection("Pedidos").ref.doc().id;
      this.angularFirestore.collection("Pedidos").doc(datosNuevoProducto.id).set(JSON.parse(JSON.stringify(datosNuevoProducto)))
        .then(() => {
          resolve(datosNuevoProducto);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_insertar_pedido

  insertarPedidoBorrado(datosPedidoBorrado: Pedido): Promise<Pedido> {
    let promise = new Promise<Pedido>((resolve, reject) => {
      //datosNuevoProducto.id = this.angularFirestore.collection("Pedidos_Borrados").ref.doc().id;
      this.angularFirestore.collection("Pedidos_Borrados").doc(datosPedidoBorrado.id).set(JSON.parse(JSON.stringify(datosPedidoBorrado)))
        .then(() => {
          resolve(datosPedidoBorrado);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_insertarPedidoBorrado

  modificarPedido(nuevosDatosProducto: Pedido): Promise<Pedido> {
    let promise = new Promise<Pedido>((resolve, reject) => {
      this.angularFirestore.collection("Pedidos").doc(nuevosDatosProducto.id).update(JSON.parse(JSON.stringify(nuevosDatosProducto)))
        .then(() => {
          resolve(nuevosDatosProducto);
        })
        .catch((error: Error) => {
          console.log("ERROR: " + error.message);
          reject(error.message);
        });
    });
    return promise;
  } //end_modificar_pedido

  eliminarPedido(producto: Pedido): Promise<Boolean> {
   const copia: Pedido = JSON.parse(JSON.stringify(producto));
    const id = new Date().toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" }).replace(/\//g, "")
      + "_" + Date.now();

    copia.id = id;
    this.insertarPedidoBorrado(copia)
      .then((element: any) => {
      })

    let promise = new Promise<Boolean>((resolve, reject) => {
      this.angularFirestore.collection('Pedidos').doc(producto.id).delete().then(
        (data: any) => {
          resolve(true);
        }
      )
        .catch((error: Error) => {
          console.log(error.message);
          reject(error.message);
        });
    });
    return promise;
  } //end_eliminar_pedido


  getPrecios(): Promise<Precio[]> {
    let promise = new Promise<Precio[]>((resolve, reject) => {
      const productoRef = this.angularFirestore.collection('Precios');
      const snapshot = productoRef.get().toPromise()
        .then((data: any) => {
          let productos = new Array<Precio>();
          data.forEach((element: { data: () => any; }) => {
            let productoJson = element.data();
            let producto = Precio.createFromJsonObject(productoJson);
            productos.push(producto);
          });
          resolve(productos);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }//end_get_productos



  getExistencias(): Promise<Existencia[]> {
    let promise = new Promise<Existencia[]>((resolve, reject) => {
      const productoRef = this.angularFirestore.collection('Existencias');
      const snapshot = productoRef.get().toPromise()
        .then((data: any) => {
          let existencias = new Array<Existencia>();
          data.forEach((element: { data: () => any; }) => {
            let existenciaJson = element.data();
            let existencia = Existencia.createFromJsonObject(existenciaJson);
            existencias.push(existencia);
          });
          resolve(existencias);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }//end_get_productos


  public insertarPrecios(datosNuevoProducto: Precio): Promise<Precio> {
    let promise = new Promise<Precio>((resolve, reject) => {
      this.angularFirestore.collection("Precios").doc(datosNuevoProducto.id).set(JSON.parse(JSON.stringify(datosNuevoProducto)))
        .then(() => {
          resolve(datosNuevoProducto);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  } //end_insertar_precio

  modificarPrecio(nuevosDatosProducto: Precio): Promise<Precio> {
    let promise = new Promise<Precio>((resolve, reject) => {
      this.angularFirestore.collection("Precios").doc(nuevosDatosProducto.id).update(JSON.parse(JSON.stringify(nuevosDatosProducto)))
        .then(() => {
          resolve(nuevosDatosProducto);
        })
        .catch((error: Error) => {
          console.log("ERROR: " + error.message);
          reject(error.message);
        });
    });
    return promise;
  } //end_modificar_precio


  modificarExistencia(nuevosDatosProducto: Existencia): Promise<Existencia> {
    let promise = new Promise<Existencia>((resolve, reject) => {
      this.angularFirestore.collection("Existencias").doc(nuevosDatosProducto.id).update(JSON.parse(JSON.stringify(nuevosDatosProducto)))
        .then(() => {
          resolve(nuevosDatosProducto);
        })
        .catch((error: Error) => {
          console.log("ERROR: " + error.message);
          reject(error.message);
        });
    });
    return promise;
  } //end_modificar_precio


  getPrecioByID(id: string): Promise<Precio> {
    let promise = new Promise<Precio>((resolve, reject) => {
      const usuariosRef = this.angularFirestore.collection('Precios').doc(id).ref;
      usuariosRef.get().then((data: any) => {
        let usuario = new Precio
        let usuarioJson = data.data();
        usuario = Precio.createFromJsonObject(usuarioJson);

        resolve(usuario);
      })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
    return promise;
  }

}//end_class