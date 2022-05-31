//Inclusión de la librería
const mongoose = require("mongoose");
const {Schema, model} = require("mongoose");


//Conexión a la base de datos
mongoose.connect("mongodb://localhost/universidad");

//Mensaje de error con la base de datos en caso de que exista
mongoose.connection.on("error", function (e) {
    console.error(e);
});


//Mensaje de conexión exitosa a la base de datos
mongoose.connection.once("open", function (e) {
    console.log('Conexión a la base de datos exitosa')
});

//Declaración de los schemas
var Carrera_Schema = Schema(
    {
        nombre: String,
        descripcion: String,
        activo: {
            type: Boolean,
            default: false,
            require: true
        }
    },
    {timestamps: true}
);


//Declaración de los schemas
var Estado_Schema = Schema(
    {
        nombre: String,
        descripcion: String
    },
    {timestamps: true}
);


var Factura_Schema = Schema(
    {
        num_Factura: Number,
        nom_Cliente: String,
        dir_Cliente: String,
        tel_Cliente: String,
        estado:{
            type: Schema.Types.ObjectId,
            require: true,
            ref: "estados"
        }
    },
    {timestamps: true}
);

// Creación del modelo
var model_carrera = model("carreras", Carrera_Schema);
var model_estado = model("estados", Estado_Schema);
var model_factura = model("facturas", Factura_Schema);

// Se inserta un objeto utilizando el modelo
model_carrera.create({ nombre: "Otra", descripcion: "Prueba", activo: true }, 
    function(err) {
        if (err) return console.error(err);
    }
);

// Se inserta un objeto utilizando el modelo
model_estado.create({ nombre: "Activa", descripcion: "Prueba" }, 
    function(err) {
        if (err) return console.error(err);
    }
);

model_factura.create({  num_Factura: 1, 
                        nom_Cliente: "CGF", 
                        dir_Cliente: "SJO",
                        tel_Cliente: "8888",
                        estado: "62957d1a29108f73c0abd188"
                    }, 
    function(err) {
        if (err) return console.error(err);
    }
);