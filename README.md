Esta guía tiene como objetivo crear un CRUD con Node JS y Angular
## Requisitos
Para la presente guía de debe tener instalado y ejecutando en su sistema operativo Node JS y Mongo DB
* [Instalador de Node JS](https://nodejs.org/es/download/)
* [Instalador de Mongo DB](https://docs.mongodb.com/manual/installation/)
* [Instalador de Visual Studio Code](https://code.visualstudio.com/)
* [PostMan](https://www.postman.com/downloads/)
## Nota aclaratoria
Para este tutorial se realizarán dos proyectos, el backend (servidor - proyecto Node) y el frontend (cliente - proyecto de angular) por lo que ambos proyecto son individuales y en carpetas separadas. Ambas carpetas pueden estar contenidas en una carpeta superior, pero es importante aclarar que son dos proyectos completamente independientes.
# Explicación del ejercicio
Para este ejercicio se utilizarán dos estructuras de documentos con el objetivo de la creación de facturas:
* Estado
  * Nombre
  * Descripción
  * Fecha de creación y modificación
* Factura
  * Número de factura
  * Nombre cliente
  * Dirección del cliente
  * Teléfono del cliente
  * Fecha de creación y modificación
  * Estado (referencia con el documento Estado)
* Detalle
  * Identificador de factura (referencia con el documento factura)
  * Artículo
  * Precio Unitario
  * Cantidad de artículos 
  * Fecha de creación y modificación

# Creación del BackEnd (Proyecto en Node)
**Nota: debe cumplir con los requisitos mencionados anteriormente**
## Creación de la estructura de carpetas inicial
Deberá crear una carpeta llamada **proyectoFacturacion** y en esta carpeta crear dos carpetas (proyectos individuales) server (backend en Node) y el client (frontend en angular). Al abrir la carpeta **proyectoFacturacion** en visual studio debe visualizar lo siguiente:

![](https://fyourd.co/utn/paso2.png)

## Creación del proyecto Node (servidor)
**Nota:** si desea cambiar el estilo (colores) de la terminal, [seguir los pasos en este link](https://glitchbone.github.io/vscode-base16-term/#/)

Para iniciar el proyecto desde la terminal vamos a proceder a crear el proyecto en la carpeta **server**, con el siguiente comando "npm init" para crear el proyecto de Node e indicar la información de:
* package name
* version
* description
* entry point 
* test command
* git repository
* keywords
* author
* license

![](https://fyourd.co/utn/paso3.png)

### Estructura inicial
Deberá crear el archivo "app.js" y la estructura de carpetas que se van a utilizar en ejemplo (rutas, modelos, controladores y las capas intermedias de autenticación y autorización)

![](https://fyourd.co/utn/paso4.png)

### Instalación de librerías 
Para el ejemplo son requeridas unas serie de librerías:

* dotenv:  Libraría la cual nos permitirá leer estas variables desde un archivo llamado .env, para posteriormente cargar las variables de entorno en la variable process.env
* express: Se ha convertido en el marco de servidor estándar para node.js. Express es la parte de backend en lo conocido como MEAN stack.
* cors:  CORS es un paquete node.js para proporcionar un middleware Connect / Express que se puede usar para habilitar CORS con varias opciones
* morgan: Es otro middleware de registro de solicitudes HTTP para Node.js. Simplifica el proceso de registro de solicitudes en su aplicación. Puede pensar en Morgan como un ayudante que recopila registros de su servido
* chalk: Una libraría que nos ayude a dar un formato personalizado a los mensajes de Node.js
* mongoose:  Mongoose es una libraría de JavaScript que le permite definir esquemas con datos fuertemente tipados con MongoDB
* passport: Passport es un middleware de autenticación para Node.js
* passport-jwt: Este módulo le permite autenticar EndPoints utilizando un token web JSON. Está destinado a ser utilizado para proteger EndPoints RESTful sin sesiones.
* bcrypt-nodejs: Librearía utilizada para la encriptación de clases
* jsonwebtoken: Para el manejo de los JWT
* nodemon: Nodemon permite recargar la página cada vez que detecta un cambio en el editor sin necesidad de inicializar continuamente el proyecto

Las cuales se deben instalar en la misma carpeta del servidor (server) desde la terminal con el siguiente comando

```
npm install dotenv express cors morgan chalk mongoose nodemon passport passport-jwt bcrypt-nodejs jsonwebtoken --save
```

### Creación del modelo factura
Se deberá crea un archivo llamado "factura.js" en la carpeta de modelos (models) y con el siguiente código

```
//Uso de la libreía Mongoose
const { Schema, model } = require("mongoose");

//Creación del esquema de factura
const FacturaSchema = new Schema(
  {
    numFactura: {
      type: Number,
      unique: true,
      required: true,
    },
    nomCliente: String,
    dirCliente: String,
    telCliente: Number
  },
  { timestamps: true } //fechas de creación y modificación
);

//Creación del modelo, que sería el que une el esquema 
//con la colección de documentos en mongo
const FacturaModel = model("Facturas", FacturaSchema);

//Hace visible en modelo con el module.exports
module.exports = FacturaModel;
```
![](https://fyourd.co/utn/paso5.png)

### Creación del controlador de factura
Se deberá crea un archivo llamado "facturaController.js" en la carpeta de controladores (controllers) y con el siguiente código

```
//Utilización del modelo de factura
const FacturaModel = require("../models/factura");

//Método para obtener las facturas
module.exports.get = async (req, res, next) => {
  const facturas = await FacturaModel.find().exec();
  res.json(facturas);
};

//Método para obtener una facturas por ID
module.exports.getById = async (req, res, next) => {
  const id = req.params.id;
  const factura = await FacturaModel.findOne({ _id: id });
  res.json(factura);
};

//Método para crear las facturas
module.exports.create = (req, res, next) => {
  const facturaModel = new FacturaModel( req.body );
  facturaModel.save();
  res.json(facturaModel);
};

//Método para eliminar las facturas
module.exports.delete = async (req, res, next) => {
  const factura = await FacturaModel.findByIdAndRemove(req.params.id);
  // si factura es null significa que no existe el registro
  if (factura) {
    res.json({ result: "Factura borrada correctamente", factura });
  } else {
    res.json({ result: "ID de la factura no existe en los documentos de la BD", factura });
  }
};

//Método para modificar las facturas
module.exports.update = async (req, res, next) => {
  const factura = await FacturaModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,     // ==> {numFactura: numFactura, nomCliente: nomCliente, dirCliente:dirCliente, telCliente:telCliente}
    { new: true } // retornar el registro que hemos modificado con los nuevos valores
  );
  res.json(factura);
};


```
![](https://fyourd.co/utn/paso6.png)

### Creación de las rutas de factura
Se deberá crea un archivo llamado "facturaRoutes.js" en la carpeta de rutas (routes) y con el siguiente código

```
//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Factura controller para los métodos definidos
const facturaController = require("../controllers/facturaController");

//Definición de rutas para cada uno de los verbos para las facturas
router.get("/", facturaController.get);

router.get("/:id", facturaController.getById);

router.post("/", facturaController.create);

router.delete("/:id", facturaController.delete);

router.put("/:id", facturaController.update);

module.exports = router;

```

![](https://fyourd.co/utn/paso7.png)

### Creación del archivo de variables de entorno

Se debe crear el archivo de variables de entorno con datos iniciales como puerto del servidor, url de conexión de la base de datos 

```
PORT=8080
MONGODB_DATABASE=mongodb://127.0.0.1/facturacion
```
![](https://fyourd.co/utn/paso8.png)

### Codificación del archivo app.js

El archivo principal y en donde de deben configurar la conexión en la base de datos y configuración del express como el servidor 
```
const dotEnv = require("dotenv");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();

// Routes

const facturasRouter = require("./routes/facturaRoutes");

// esta linea ayuda a leer la configuracion que tenemos en el archivo .env
dotEnv.config();

// definimos el uri de la base de datos definido en el archivo .env
const mongoDB = process.env.MONGODB_DATABASE;

// se conecta a la base de datos
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// esta es la conexión a la base de datos la cual usaremos para detectar errores o conexiones
const db = mongoose.connection;

//  reporta un error en la conexión
db.on("error", console.error.bind(console, "MongoDB connection error"));

//  cuando se conecta a la BD monstrara este mensaje
db.once("open", () => console.log("Connected Successfully to DB " + mongoDB));

// se define el puerto que va a escuchar basado en el archivo de configuración .env
const port = process.env.PORT || 3000;

// usamos el middleware cors para aceptar llamadas cors en nuestro servidor
app.use(cors());
// este middleware nos sirve para loggear las llamadas al servidor
app.use(logger("dev"));

// middleware para manejar requests y respuestas json
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// todas las rutas las definimos aqui
app.use("/facturas/", facturasRouter);


// iniciamos nuestro servidor
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log("Press CTRL-C to stop\n");
});


```

![](https://fyourd.co/utn/paso9.png)

### Configuración de ejecución del proyecto con nodemon

Para ejecutar el proyecto de tal forma que se compile el proyecto y se ejecute cada vez que algún archivo sea modificado, por lo que se debe modificar el archivo **package.json**, agregando la siguiente línea de código para poder ejecutar el proyecto con **npm run develop**:
```
"develop": "nodemon app.js"
```
![](https://fyourd.co/utn/paso10.png)

### Ejecución del proyecto

Para ejecutar el proyecto se debe ejecutar el comando configurado en el  **package.json** con el comando **npm run develop** en la terminal 

![](https://fyourd.co/utn/paso11.png)

### Pruebas del proyecto con postman

Se deben probar los endPoint creados para el proyecto, para lo cual vamos a utilizar el software PostMan

**Insertar Factura**

![](https://fyourd.co/utn/paso12.png)

**Consultar Facturas**

![](https://fyourd.co/utn/paso13.png)

**Consulta Facturas por ID**

![](https://fyourd.co/utn/paso14.png)

**Modificar una factura por ID**

![](https://fyourd.co/utn/paso15.png)

**Eliminar una factura por ID**

![](https://fyourd.co/utn/paso16.png)


# Creación del FrontEnd (Proyecto en Angular)

Para la interfaz de usuario se utilizará el Angular y el proyecto quedará en la carpeta **client** 

## Instalación de Angular

Primero de debe instalar Angular CLI para la creación del proyecto (en la terminal como administrador)

```
npm install -g @angular/cli
```
## Creación del proyecto en Angular

Para la creación del proyecto en Angular debemos abrir otra terminar en Visual Studio Code (la terminal actual se esta usando para ejecutar el servidor en node)

```
ng new client
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? CSS
```

![](https://fyourd.co/utn/paso100.png)

## Generación de componentes, servicios, módulos e instalación de librerías

Se procede a la creación de los modelos, componentes y servicios desde la terminal y en la carpeta del proyecto client (Nota: debe ingresar a la carpeta del proyecto creado para crear los diferentes elementos)

**Librerías**

**Angular Materials**

```
ng add @angular/material
```

![](https://fyourd.co/utn/paso3_01.png)

**Sweet Alert**

```
npm install sweetalert2
```

![](https://fyourd.co/utn/paso103.png)

**Modelos**

Para el desarrollo del proyecto se va a realizar la creación de modelos para el trasiego de información entre el frontend y el backend utilizando el Angular CLI (Command Line Interface)

```
ng g class models/factura --type=model
ng g class models/user    --type=model
ng g class models/estado  --type=model
ng g class models/detalle --type=model
```
**Componentes**

Se procede a la creación de los componentes que van a facilitar la creación de los componentes de interfaz de usuario

```
ng g c components/dashboard 
ng g c components/facturas
ng g c components/inicio
ng g c components/login
ng g c components/navbar
ng g c components/perfil
ng g c components/reportes

```
**Modulos**
```

ng g m components/shared   (modulo para la inclusión de librerías de Angular Materials)

```
**Servicios**
```
ng g s service/factura
ng g s service/estado
ng g s service/user
ng g s service/token-storage

```
La estructura del proyecto debe quedar de la siguiente manera

![](https://fyourd.co/utn/paso3_02.png)

## Definición de rutas

Para la definición de rutas asociadas a los componentes desarrollados, se debe modificar el archivo **app-routing.module.ts**, en donde se deben indicar las rutas correspondientes. 

![](https://fyourd.co/utn/paso3_03.png)
```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacturasComponent } from './components/facturas/facturas.component';

//Definición de rutas y componentes asociados
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //Para la ruta inicial se pasa al login
  { path: 'login', component: LoginComponent},
  { path: 'perfil', component: PerfilComponent}, 
  { path: 'dashboard', component: DashboardComponent},   //Panel principal para un usuario administrador
  { path: 'dashboard/facturas', component: FacturasComponent}, //CRUD o mantenimiento de facturas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```




# Creación del componente de Login 

Para la creación del login vamos a proceder a la modificación del componente Login creado en el apartado anterior, **IMPORTANTE: para este punto el login va a ser simulado, el las próximas sesiones se agregara la funcionalidad al proyecto**


**Implementación de los componentes de Angular Material**

Durante el desarrollo del presente laboratorio utilizaremos componentes de [Angular Materials](https://material.angular.io/components/categories) para lo cual debe importar los componentes necesarios y según la documentación del mismo API, por ejemplo: ver la siguiente imagen en donde se indica cual import se debe realizar para utilizar un componente.

![](https://fyourd.co/utn/paso3_04.png)

Para el login vamos a utilizar componentes como:
* MatSliderModule
* MatFormFieldModule
* MatInputModule
* MatProgressSpinnerModule
* MatSnackBarModule
* MatButtonModule

por lo que vamos a agregarlos al archivo de **components/shared/shared.module.ts** con el objetivo de tener un solo archivo para los componentes de Angular Materials.

**NOTA:** Los componentes deben ser agregados en los imports (para utilizar las librerías) como en los exports (para que sean exportados en el app.module.ts y sean reconocidos en todos los componentes del proyecto.

![](https://fyourd.co/utn/paso3_05.png)
```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Angular Material
import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';


//Componente para formularios
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  exports:[
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule
  ]
})
export class SharedModule { }

```

Posteriormente de debe agregar el shared.module en el modulo principal de la aplicación **app.module.ts**, de la siguiente forma

![](https://fyourd.co/utn/paso3_06.png)

**Creación del componente login**

Para la creación del componente login vamos a modificar:
* login.component.css (para los estilos del login)
* login.component.html (para el html del componente)
* login.component.ts (para programar la funcionalidad del componente)

![](https://fyourd.co/utn/paso3_07.png)

En el CSS vamos a incluir lo siguiente:

```
.body {
    display: flex;
    align-items: center;
    justify-content: center;
  
    background-color: #f5f5f5;
    height: 100%;
  }
  .login {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
    text-align: center;
  }

  .ancho {
    width: 80%;
  }

  .spinner{
    margin: 0 auto;
  }
```

en el HTML vamos a incluir 
```
<div class="body">
    
    <div class="login">

        <div class="spinner" *ngIf="loading">
            <p>Validando información, por favor espere!</p><br>
            <mat-spinner diameter="50" class="spinner"  ></mat-spinner>
        </div>
        

        <form [formGroup]="form" (ngSubmit) = "simulacionLoading()" *ngIf="!loading">
            <img  src="./assets/img/profile.png" alt="" width="50%" height="80%">
            <h1 class="h3 mb-3 fw-normal">Login</h1>
            <mat-form-field class="ancho" appearance="fill">
                <mat-label>Usuario</mat-label>
                <input matInput type="text" autocomplete="off" formControlName="usuario">
              </mat-form-field>
              <mat-form-field class="ancho" appearance="fill">
                <mat-label>Contraseña</mat-label>
                <input type="password" matInput formControlName="password">
              </mat-form-field>
              <br>
              <button type="submit" class="ancho" mat-raised-button mat-button color="primary" [disabled] = "form.invalid"> Ingresar </button>
        </form>
        
    </div>
</div>
```

y en el archivo ts (TypeScript)
```
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


```


## Creación de la barra de navegación
Para la creación del las opciones de administración vamos a utilizar la una barra de navegación que van a utilizar todos los componentes que forman parte.

Primero debemos modificar el archivo navbar.component.html con el siguiente código

![](https://fyourd.co/utn/paso3_08.png)

```
<mat-toolbar color="primary">
    <span>Universidad Técnica Nacional - Leccion 07</span>
    <span class="example-spacer"></span>
    <button mat-button routerLink="/dashboard">Dashboard</button>
    <button mat-button routerLink="/dashboard/facturas">Facturas</button>
    <span class="example-spacer"></span>
    <!-- <button mat-button routerLink="/dashboard">LogOut</button> -->
    <button mat-icon-button class="example-icon" routerLink="/" aria-label="Example icon-button with menu icon">
        <mat-icon>logout</mat-icon>
    </button>
</mat-toolbar>
```
Recuerde importar en shared.module.ts los elementos que posee el navbar de angular material, especificamente:
* MatToolbarModule
* MatIconModule


## Creación de la página de dashboard

Para la creación de la página principal del dashboard lo único que se va a incluir en este momento es la barra de navegación, por lo que solamente vamos a modificar el archiv **dashboard.component.html** de la siguiente forma

![](https://fyourd.co/utn/paso3_09.png)
```
<app-navbar></app-navbar>
```

## Creación del CRUD de facturas

Para la creación del CRUD del facturas vamos a necesitar dos componentes:
* components/facturas (ya creado) para listar todas las facturas de la base de datos
* components/facturasForm (se creará en los próximos pasos) para insertar y modificar facturas en la base de datos

**Creación del componente para mostrar las facturas de la base de datos

### Creación modelo de facturas

Para el trasiego de información se requiere crear un modelo que nos permita enviar y recibir información al API creado en este laboratorio, para lo cual vamos a modificar el archivo **models/factura.ts**, con el siguiente código:

![](https://fyourd.co/utn/paso3_10.png)
```
export class Factura {
    _id?: any;
    numFactura?: number;
    nomCliente?: string;
    dirCliente?: string;
    telCliente?: number;
    estado?: any;
}
```
### Creación del service de facturas

Para interactuar con el API desarrollado en Node, debemos crear un servicio que nos ayude a implementar los diferentes métodos desarrollados en el backend, por lo que vamos a modificar el archivo **factura.service.ts**, con el siguiente código:


![](https://fyourd.co/utn/paso3_11.png)
```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';
import { environment } from 'src/environments/environment';


const baseUrl = `${environment.apiUrl}/facturas`;

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Factura[]> {
    return this.http.get<Factura[]>(baseUrl);
  }

  get(id: any): Observable<Factura> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}


```

### Creación del componente Facturas

En el componente de facturas se utilizará para mostrar las facturas que están en la base de datos, para lo que vamos a modificar:
* facturas.component.css
* facturas.component.html
* facturas.component.ts

![](https://fyourd.co/utn/paso3_12.png)

**Nota: para la creación de este componente vamos a utilizar elementos de angular materials, específicamente: MatTableModule, MatTooltipModule, MatPaginatorModule, MatSortModule, MatCardModule, MatGridListModule, por lo que debe agregarlos al shared.module.ts**

Y se deberá incluir en el siguiente código en los siguientes componentes

**facturas.component.css**

```
table {
    width: 100%;
    margin-top: 30px;
  }

  th{
    width: 20%;
  }

  .cursorPointer{
    cursor: pointer;
  }

  .mat-form-field {
    font-size: 14px;
    width: 100%;
  }


  .contenido{
    margin-left: 20px;
    margin-right: 20px;
  }
```

**facturas.component.html**

```
<app-navbar></app-navbar>

<div class="container">
    <mat-toolbar>
      <span>Facturas</span>
    </mat-toolbar>

</div>
<div class="contenido">
    <br>
    <button mat-raised-button color="primary" routerLink="/dashboard/facturaForm" routerLinkActive="router-link-active" >Agregar Factura</button>

    <div  *ngIf="listaFacturas.length==0">
        <p>No existen datos para mostrar</p>
    </div>

    <mat-form-field appearance="standard">
        <mat-label>Filtro</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ejm. Cristhian" #input>
    </mat-form-field>

    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8" matSort>

        <!--- Note that these columns can be defined in any order.
              The actual rendered columns are set as a property on the row definition" -->
      
        <!-- Position Column -->
        <ng-container matColumnDef="numFactura">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Núm. Factura</th>
          <td mat-cell *matCellDef="let element"> {{element.numFactura}} </td>
        </ng-container>
      
        <!-- Name Column -->
        <ng-container matColumnDef="nomCliente">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Nombre Cliente </th>
          <td mat-cell *matCellDef="let element"> {{element.nomCliente}} </td>
        </ng-container>
      
        <!-- Weight Column -->
        <ng-container matColumnDef="dirCliente">
          <th mat-header-cell *matHeaderCellDef> Dirección Cliente </th>
          <td mat-cell *matCellDef="let element"> {{element.dirCliente}} </td>
        </ng-container>
      
        <!-- Symbol Column -->
        <ng-container matColumnDef="telCliente">
          <th mat-header-cell *matHeaderCellDef> Teléfono Cliente </th>
          <td mat-cell *matCellDef="let element"> {{element.telCliente}} </td>
        </ng-container>

        <!--
        <ng-container matColumnDef="estado">
          <th mat-header-cell *matHeaderCellDef> Estado</th>
          <td mat-cell *matCellDef="let element"> {{element.estado.nombre}} </td>
        </ng-container>

        -->
        
        <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef style="text-align: right;"> Acciones </th>
            <td mat-cell *matCellDef="let element" style="text-align: right;"> 
                <a  (click)="modificarFactura(element);">
                    <mat-icon
                    mat-raised-button #tooltip="matTooltip"
                    matTooltip="Editar información"
                    class="cursorPointer" style="color: #d49c18;">edit</mat-icon>
                </a>
                <a (click)="eliminarFactura(element);"> 
                    <mat-icon 
                    mat-raised-button #tooltip="matTooltip"
                    matTooltip="Eliminar información"
                    class="cursorPointer" style="color: #af1313;">delete</mat-icon>
                </a>
            </td>
          </ng-container>
      
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of users"></mat-paginator>
  </div>


  
  
```

**facturas.component.ts**

```
import { Component, OnInit, ViewChild } from '@angular/core';


import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Factura } from '../../models/factura';
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
  displayedColumns: string[] = ['numFactura', 'nomCliente', 'dirCliente', 'telCliente',   'acciones'];
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
        
      } 

    });

  }// fin del método modificar

}

```

**Nota: como la pantalla implementa el HTTP client, este deberá ser incluido en el app.module de la aplicación**

![](https://fyourd.co/utn/paso3_13.png)

Quedando de la siguiente forma, el componente para mostrar el listado de facturas:


![](https://fyourd.co/utn/paso3_14.png)


# Desarrollo de la opción para insertar facturas

Para la creación de facturas requerimos crear un nuevo compomente que contenga el formulario de los datos de facturas, el cual lo podemos crear con el comando Angular CLI:

```
ng g c components/facturas/facturas_form
```

![](https://fyourd.co/utn/paso_802.png)

Después de crear el compomente para el formulario de facturas, debemos crear las nuevas rutas para las funcionalidades de insertar y modificar facturas (vamos a utilizar el mismo compomente para ambas funcionalidades)


```
{ path: 'dashboard/facturas/form', component: FacturasFormComponent}, //CRUD o mantenimiento de facturas (Insertar)
```

![](https://fyourd.co/utn/paso_803.png)

Luego procedemos modificar el link de botón "Agregar Facturas" de la pantalla que lista las facturas para que nos redirija al nuevo compomente creado

![](https://fyourd.co/utn/paso_804.png)


### Componente Facturas form, para la creación de nuevas facturas

En el html del formulario para ingresar facturas, vamos a crear un formulario con los campos requeridos para almacenar facturas


```
<app-navbar></app-navbar>

<div class="container">
    <mat-toolbar>
      <span>{{textPantalla}}</span> <!-- nombre de la pantalla según la funcinalidad -->
    </mat-toolbar>

</div>
<div class="contenido">
    <mat-card style="margin-top: 10px;" style="text-align: left;">
        <form [formGroup]="form">
            <mat-form-field >
                <mat-label>Número de factura</mat-label>
                <input matInput #input maxlength="10" placeholder="9999" autocomplete="off" formControlName="numFactura">
            </mat-form-field>
            <br>
            <mat-form-field >
                <mat-label>Nombre del cliente</mat-label>
                <input matInput #input maxlength="100" placeholder="Nombre completo" autocomplete="off" formControlName="nomCliente" >
            </mat-form-field>
            <br>
            <mat-form-field >
                <mat-label>Dirección del cliente</mat-label>
                <input matInput #input maxlength="200" placeholder="Dirección exacta" autocomplete="off"  formControlName="dirCliente" >
            </mat-form-field>
            <br>
            <mat-form-field  >
                <mat-label>Teléfono del cliente</mat-label>
                <input matInput #input maxlength="8"  placeholder="99999999" autocomplete="off" formControlName="telCliente">
            </mat-form-field>

            <br>
            <!--<mat-form-field>
                <mat-select formControlName="estado"  placeholder="Selecciones un estado">
                        <mat-option *ngFor="let estado of listaEstados" 
                            [value]="estado._id">
                            {{estado.nombre}}
                  </mat-option>
               </mat-select>
             </mat-form-field> -->
               
            <br><br>
            <button mat-raised-button color="warn" routerLink="../facturas" routerLinkActive="router-link-active" >Regresar</button>
            <span *ngIf="isInsertar">
                <button style="margin-left: 20px;" mat-raised-button color="primary" type="submit" [disabled] = "form.invalid" (click)="saveFactura()">Guardar factura</button>
            </span>
            <span *ngIf="!isInsertar">
                <!-- <button style="margin-left: 20px;" mat-raised-button color="primary" type="submit" [disabled] = "form.invalid" (click)="modificarFactura()">Modificar factura</button> -->
            </span>
            
        </form>
    </mat-card>
</div>
```

y en el TypeScript del nuevo compomente el debemos crear un formulario, al cual va a estar asociado el HTML con un método que nos permita guardar facturas

```
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Factura } from 'src/app/models/factura.model';
import { FacturaService } from 'src/app/service/factura.service';


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

  constructor(private facturaService: FacturaService,
    private fb: FormBuilder, private router: Router, 
    private _snackbar: MatSnackBar,
    private activeRouter: ActivatedRoute) {

      //Formulario de la página de factura
      this.form = this.fb.group({
        numFactura: ['', Validators.required],
        nomCliente: ['', Validators.required],
        dirCliente: ['', Validators.required],
        telCliente: ['', Validators.required]
      });

     }


  ngOnInit(): void {
  }


  //***************************************************************/
  //Método para guardar una nueva factura
  //***************************************************************/

  saveFactura(): void{
    const data = {
      numFactura: this.form.value.numFactura,
      nomCliente: this.form.value.nomCliente,
      dirCliente: this.form.value.dirCliente,
      telCliente: this.form.value.telCliente
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


}

```
Quedando el formulario de la siguiente manera (ejecutar el cliente y realizar la prueba)

![](https://fyourd.co/utn/paso_806.png)

Después de probar la funcionalidad del botón "Guardar", el app debe redirigirnos al componente que lista el detalle de las facturas

![](https://fyourd.co/utn/paso_807.png)

# Desarrollo de la opción para modificar facturas facturas

Para crear la opción de modificar facturas debemos codificar el método ya creado en el TypeScrip del compomente que muestra la lista de facturas, así como crear una ruta que nos permita enviar como parametro el ID de la factura a modificar.

## Creación de la ruta para modificar

Para utilizar el mismo compomente del formulario de facturas creado anteriormente, debemos crear una ruta que nos lleve al compomente creado pero que tenga la opción de recibir un ID en la URL, por lo que vamos a agregar dicha ruta en el app-routing.module.ts de la siguiente forma:

```
{ path: 'dashboard/facturas/:id', component: FacturasFormComponent}
```

![](https://fyourd.co/utn/paso_808.png)

## Desarrollar el botón modificar 

Lo que sigue es modificar el bóton modificar que tenemos en la tabla que muestra el listado de facturas, con el objetivo de que al dar clic en el botón modificar el sistema no lleve al compomente del formulario de facturas

```
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
```
![](https://fyourd.co/utn/paso_809.png)

## Utilización de compomente form factura para modificar

Luego debemos modificar el compomente del formulario de factura, para que en el momento que el compomente reciba un paramatro el utilice el compomente para modificar la factura con el ID enviado, para lo que vamos a códificar el método ngOnInit del compomente form de facturas de la siguiente forma

```
 ngOnInit(): void {
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
                                  telCliente: this.factura.telCliente});

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
```

![](https://fyourd.co/utn/paso_810.png)

## Habilitación del botón modificar

En el HTML del compomente del formulario de facturas el bóton modificar estaba comentado, por lo que debemos habilitar en el HTML dicho botón para poder modificar facturas, el cual se muestra siempre y cuando la variable isInsertar esta en falso

![](https://fyourd.co/utn/paso_811.png)

Posteriormente debemos crear un método que consuma el servicio del API creado para poder modificar la factura seleccionada, por lo que debemos crear un método en el TypeScript del compomente del formulario de facturas llamado modificarFactura, con el siguiente código:

```
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
```

![](https://fyourd.co/utn/paso_812.png)

Obteniendo como resultado la funcionalidad de modificar facturas

![](https://fyourd.co/utn/paso_814.png)

![](https://fyourd.co/utn/paso_813.png)


# Eliminar facturas

Para elimar facturas debemos modificar el botón eliminar en el compomente que lista todas las facturas, en la tabla además del botón modificar tenemos el botón eliminar el cual nos permite consumir los API creados en el backEnd e implementados en el factura.service.ts en el frontend, para lo cual vamos a incluir el siguiente código que nos permita eliminar facturas

```
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

```

![](https://fyourd.co/utn/paso_815.png)

Lo que nos permitira eliminar facturas de la tabla que muestra la información

![](https://fyourd.co/utn/paso_816.png)

![](https://fyourd.co/utn/paso_817.png)








