import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(array: any[], filtrador: string, columna: string): any {


    if (filtrador === '')
      return array;

    filtrador = filtrador.toLocaleLowerCase();
    


      return array.filter(item => {
        return item[columna].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(filtrador);
      });


  }

}
