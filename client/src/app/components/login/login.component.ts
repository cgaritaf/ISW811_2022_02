import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Variables del componente 
  form:FormGroup;
  msg: string = '';
  loading = false;

  //Constructor del componente
  constructor(private router: Router, private fb: FormBuilder, private _snackbar: MatSnackBar) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
   }

  //Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.loading = false;
  }

  //Médodo para ingresar o hacer logueo
  ingresar() {
    const dataInput = {
      username: this.form.value.usuario,
      password: this.form.value.password
    };

    if(dataInput.username === 'user' || dataInput.username === 'admin'){
      //Se valida si es un acceso u otro
      if (dataInput.username === 'user') {
        this.router.navigateByUrl('/perfil');
      }
      if (dataInput.username === 'admin') {
        this.router.navigateByUrl('/dashboard');
      }
    }else{
      this.showMsg_snackBar("Usuario no valido");
    }

    //Se muestra el formulario
    this.loading = false;
    
  }

  //Médodo para mostrar el snack bar de angular material
  showMsg_snackBar(msg:string){
    this._snackbar.open(msg, 'Cerrar',{
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  };


  //Metodo solo simula el proceso de login en un tiempo más extenso
  simulacionLoading(){
    //Muestra el mensaje de cargando
    this.loading = true;
    setTimeout(() => {
      this.ingresar();
    }, 1000);
  }

}
