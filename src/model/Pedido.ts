import { ESTADOS } from "./ESTADOS";
import { Gannote } from "./Gannote";
import { Pestinno } from "./Pestinno";
import { Rosco } from "./Rosco";

export class Pedido {

    id: string = "";
    nombreCliente: string = "";
    precioTotal: number = 0;
    productos: Array<any> = new Array<any>();
    fechaEntrega: any;
    estado: ESTADOS = ESTADOS.ENCARGADO;
    comentario: String="";


    constructor() {
    }

    static createFromJsonObject(pedidoJson: any): Pedido {
        let pedido: Pedido = new Pedido();

        pedido.id = pedidoJson['id'];
        pedido.nombreCliente = pedidoJson['nombreCliente'];

        if (pedidoJson['productos'] != null) {
            pedido.productos = new Array<any>();
            pedidoJson['productos'].forEach((element: any) => {
                if (element.nombre === 'Gañotes') {
                    pedido.productos.push(Gannote.createFromJsonObject(element));
                } else if (element.nombre === 'Gañotes Pequeños') {
                    pedido.productos.push(Gannote.createFromJsonObject(element));
                }
                else if (element.nombre === 'Pestiños') {
                    pedido.productos.push(Pestinno.createFromJsonObject(element));
                } else if (element.nombre === 'Roscos') {
                    pedido.productos.push(Rosco.createFromJsonObject(element));
                }
            });

            pedido.fechaEntrega = pedidoJson['fechaEntrega'];
            pedido.precioTotal = pedidoJson['precioTotal'];
            pedido.estado = pedidoJson['estado'];
            pedido.comentario = pedidoJson['comentario'];

        }
        return pedido;
    }

    static calcularPrecioTotal(productos:any): number {
        let total: number = 0;

        productos.forEach((element:any) => {
            total += element.precio * element.cantidad;
        });

        return total;
    }

}