

export class Gannote {


    id: string="";
    nombre: string = "Gañotes";
    precio: number=0;
    pequenno: boolean = false;
    cantidad: number = 0;


    static construir(id: string, nombre: string, precio: number, cantidad: number):Gannote {
        let gannote= new Gannote();
        gannote.id = id;
        gannote.nombre = nombre;
        gannote.precio = precio;
        gannote.cantidad=cantidad;
        return gannote;
    }

    static createFromJsonObject(gannoteJson: any): Gannote {
        let nombre = "Gañotes";
        let gannote: Gannote = Gannote.construir(gannoteJson['id'], nombre, gannoteJson['precio'],gannoteJson['cantidad']);
        

        gannote.pequenno = gannoteJson['pequenno'];

        if (gannote.pequenno)
            gannote.nombre = gannote.nombre + " Pequeños";


        return gannote;
    }

    static cambiarNombre(gannote:Gannote):string{
        let nombre="";
        if (gannote.pequenno)
            nombre = gannote.nombre + " Pequeños";

            return nombre;
    }


}