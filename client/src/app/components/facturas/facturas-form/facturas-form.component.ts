import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Factura } from 'src/app/models/factura.model';
import { Estado } from 'src/app/models/estado.model';
import { FacturaService } from 'src/app/service/factura.service';
import { EstadoService } from 'src/app/service/estado.service';

@Component({
  selector: 'app-facturas-form',
  templateUrl: './facturas-form.component.html',
  styleUrls: ['./facturas-form.component.css']
})
export class FacturasFormComponent implements OnInit {

  //***************************************************************/
  //Atributos del compomente
  //***************************************************************/

  idFactura: number = 0;
  textPantalla: string = 'Crear factura';
  isInsertar: boolean = true;
  form:FormGroup;
  factura = new Factura;

  //Lección 9, lista de estados
  listaEstados : Estado[] = [];
  //Lección 9, lista de estados

  constructor(private facturaService: FacturaService, private estadoService: EstadoService,
    private fb: FormBuilder, private router: Router, 
    private _snackbar: MatSnackBar,
    private activeRouter: ActivatedRoute) {

      //Formulario de la página de factura
      this.form = this.fb.group({
        numFactura: ['', Validators.required],
        nomCliente: ['', Validators.required],
        dirCliente: ['', Validators.required],
        telCliente: ['', Validators.required],
        estado: ['', Validators.required]
      });

     }


  ngOnInit(): void {

    //***************************************************************/
    //Se carga la información de los estados
    //***************************************************************/
    //Lección 9, lista de estados
    this.cargarEstados();
    //Lección 9, lista de estados

    //***************************************************************/
    //Cuando se inicializa el compomente de consulta si el ID
    //fue enviado por parametro
    //***************************************************************/

    this.activeRouter.params.subscribe((params: Params) => {      
      console.log(params);
      this.idFactura = params['id'];

      //***********************************************/
      //se consultan los datos de la factura 
      //***********************************************/

      if(this.idFactura !== undefined){
        this.isInsertar = false;
        //de modifica la variable que muestra el titulo de la pantalla
        this.textPantalla = "Modificar factura Prueba";
        //se consultan los datos de la factura 
        this.facturaService.get(this.idFactura)
          .subscribe({
            next: (res: any) => {
              
              //La variable form que esta asociada el formulario html es cargado con los datos que se consultaron
              this.factura = res;
              this.form.setValue({numFactura: this.factura.numFactura, 
                                  nomCliente: this.factura.nomCliente, 
                                  dirCliente: this.factura.dirCliente, 
                                  telCliente: this.factura.telCliente,
                                  estado: this.factura.estado._id});

              console.log(this.factura);

              this._snackbar.open('La factura fue cargada con exito, por favor verificar', '',{
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
              
            },
            error: (e:any) => console.error(e)
        });
  
        console.log('id factura' + this.idFactura);

      }

    });
  }


  //***************************************************************/
  //Método para guardar una nueva factura
  //***************************************************************/

  saveFactura(): void{
    const data = {
      numFactura: this.form.value.numFactura,
      nomCliente: this.form.value.nomCliente,
      dirCliente: this.form.value.dirCliente,
      telCliente: this.form.value.telCliente,
      estado: this.form.value.estado
    };

    console.log(data);

    this.facturaService.create(data)
      .subscribe({
        next: (res: any) => {
          this.form.reset;
          console.log(res);
          this.router.navigateByUrl('dashboard/facturas');

          this._snackbar.open('La factura fue agregada con exito, por favor verificar', '',{
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          })
          
        },
        error: (e:any) => console.error(e)
      });
  }


  //***************************************************************/
  //Método para modificar una factura
  //***************************************************************/
  modificarFactura(): void{
    const data = {
      numFactura: this.form.value.numFactura,
      nomCliente: this.form.value.nomCliente,
      dirCliente: this.form.value.dirCliente,
      telCliente: this.form.value.telCliente,
      estado: this.form.value.estado
    };

    console.log(data);

    this.facturaService.update(this.idFactura,data)
      .subscribe({
        next: (res: any) => {
          this.form.reset;
          console.log(res);
          this.router.navigateByUrl('/dashboard/facturas');

          this._snackbar.open('La factura fue modificada con exito, por favor verificar', '',{
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          })
          
        },
        error: (e:any) => console.error(e)
      });

  }

  

  //***************************************************************/
  //Se carga la información de los estados para el select
  //***************************************************************/
  //Lección 9, lista de estados
  cargarEstados(): void{
    this.estadoService.getAll()
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.listaEstados = res;
        },
        error: (e:any) => console.error(e)
      });
  }
  //Lección 9, lista de estados


}
