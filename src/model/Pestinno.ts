

export class Pestinno{

    id: string="";
    nombre: string ="Pestiños";
    precio: number=0;
    cantidad:number=0;


    static construir( id: string,nombre:string, precio:number,cantidad:number): Pestinno {
        let pestinno: Pestinno = new Pestinno();
        pestinno.id=id;
        pestinno.nombre=nombre;
        pestinno.precio=precio;
        pestinno.cantidad=cantidad;
        return pestinno
    }

    static createFromJsonObject(pestinnoJson: any): Pestinno {
        let nombre = "Pestiños";
        let pestinno: Pestinno = Pestinno.construir(pestinnoJson['id'],nombre,pestinnoJson['precio'],pestinnoJson['cantidad']);

        return pestinno;
    }


}