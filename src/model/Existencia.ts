export class Existencia{
    
    id:string = ""; //Es el nombre del producto
    cantidad:number = 0;
    nombre:string="";


    constructor() {
    }

    static createFromJsonObject(existenciaJson: any):Existencia {
        let existencia:Existencia=new Existencia();

        existencia.id=existenciaJson['id'];
        existencia.nombre=existenciaJson['nombre'];
        existencia.cantidad=existenciaJson['cantidad'];

        return existencia;
    }
    
}