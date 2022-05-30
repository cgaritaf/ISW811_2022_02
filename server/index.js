//Inclusión de la librería
var mongoose = require("mongoose"); //npm install mongoose –save

//Conexión a la base de datos
mongoose.connect("mongodb://localhost/universidad");

//Mensaje de error con la base de datos en caso de que exista
mongoose.connection.on("error", function (e) {
    console.error(e);
});

//Mensaje de conexión exitosa a la base de datos
mongoose.connection.once("open", function (e) {
    console.log('ConexiÃ³n a la base de datos exitosa')
});

//Declaración de los schemas
var Carrera_Schema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    activo: {
        type: Boolean,
        default: false,
    },
    creado_en: {
        type: Date,
        default: Date.now,
    },
    actualizado_en: { 
        type: Date, 
        default: Date.now 
    },
});

// Creación del modelo
var model_carrera = mongoose.model("carreras", Carrera_Schema);

// Se inserta un objeto utilizando el modelo
model_carrera.create({ nombre: "Ing. Software", descripcion: "Especializada en programación" }, 
    function(err) {
        if (err) return console.error(err);
    }
);

