

export class Empanadilla{

    id: string="";
    precio: number =0;
    nombre: string = "Empanadillas";
    cantidad:number=0;


    static constuir( id: string,nombre:string, precio:number,cantidad:number):Empanadilla {
        let empanadilla: Empanadilla = new Empanadilla();
        empanadilla.id=id;
        empanadilla.nombre=nombre;
        empanadilla.precio=precio;
        empanadilla.cantidad=cantidad;

        return empanadilla;
    }

    static createFromJsonObject(empanadillaJson: any): Empanadilla {
        let nombre = "Empanadillas";
        let empanadilla: Empanadilla =  Empanadilla.constuir(empanadillaJson['id'],nombre,empanadillaJson['precio'],empanadillaJson['cantidad']);

        return empanadilla;
    }

}