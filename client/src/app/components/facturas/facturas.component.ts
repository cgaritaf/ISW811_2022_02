import { Component, OnInit, ViewChild } from '@angular/core';


import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Factura } from '../../models/factura.model';
import { FacturaService } from '../../service/factura.service';
import { Router } from '@angular/router';

import swal from 'sweetalert2'; // para instalarlos se debe ejecutar npm install sweetalert2

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  //Lista de facturas
  listaFacturas : Factura[] = [];

  //Configuración de la tabla
  displayedColumns: string[] = ['numFactura', 'nomCliente', 'dirCliente', 'telCliente', 'estado',  'acciones'];
  dataSource!:  MatTableDataSource<any>;

  //Para la paginación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private facturaService: FacturaService, private _snackbar: MatSnackBar, private router: Router ) { }

  ngOnInit(): void {
    this.consultarFacturas();
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  consultarFacturas():void{
    this.facturaService.getAll()
      .subscribe({
         next: (data) => {
           this.listaFacturas = data;
           this.dataSource = new MatTableDataSource(this.listaFacturas);
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
           console.log(data);
         },
         error: (e: any) => console.error(e)
      });
    
  }

  eliminarFactura(element:any){

    swal.fire({
      title: `¿Desea eliminar la factura #${element.numFactura} la a nombre de ${element.nomCliente}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        //Código de la lección 08
        //se muestra en consola el ID que vamos a enviar en la URL
        console.log(element._id);
        //Llamamos al compomente metodo de eliminar existente en el factura service
        this.facturaService.delete(element._id)
          .subscribe({
             next: (data) => {
               this.consultarFacturas();
               console.log(data);
              
               this._snackbar.open('La factura eliminada correctamente', '',{
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
    
             },
             error: (e: any) => console.error(e)
          });
        //Fin del código de la lección 08
      } 

    });
    
  } // fin del médoto de eliminar


  modificarFactura(element:any){

    swal.fire({
      title: `¿Desea modificar la factura #${element.numFactura} la a nombre de ${element.nomCliente}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, modificar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        //Código de la lección 08
        //se muestra en consola el ID que vamos a enviar en la URL
        console.log(element._id);
        //Llamamos al compomente de formulario de factursa pero le enviamos el ID
        this.router.navigateByUrl(`dashboard/facturas/${element._id}`);
        //Fin del código de la lección 08
      } 

    });

  }// fin del método modificar

}
