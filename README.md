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
