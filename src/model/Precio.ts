export class Precio{
    
    id:string = ""; //Es el nombre del producto
    precio:number = 0;
    nombre:string="";


    constructor() {
    }

    static createFromJsonObject(precioJson: any):Precio {
        let precio:Precio=new Precio();

        precio.id=precioJson['id'];
        precio.precio=precioJson['precio'];
        precio.nombre=precioJson['nombre'];

        return precio;
    }
    
}