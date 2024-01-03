

export class Rosco{

    id: string="";
    precio: number =0;
    nombre: string = "Roscos";
    cantidad:number=0;


    static constuir( id: string,nombre:string, precio:number,cantidad:number):Rosco {
        let rosco: Rosco = new Rosco();
        rosco.id=id;
        rosco.nombre=nombre;
        rosco.precio=precio;
        rosco.cantidad=cantidad;

        return rosco;
    }

    static createFromJsonObject(roscoJson: any): Rosco {
        let nombre = "Roscos";
        let rosco: Rosco =  Rosco.constuir(roscoJson['id'],nombre,roscoJson['precio'],roscoJson['cantidad']);

        return rosco;
    }

}