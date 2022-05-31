//Inclusión de la librería
var mongoose = require("mongoose"); //npm install mongoose –save
var {Schema} = require("mongoose"); 

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
var Carrera_Schema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    activo: {
        type: Boolean,
        default: false,
        require: true
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


//Declaración de los schemas
var Estado_Schema = mongoose.Schema(
    {
        nombre: String,
        descripcion: String
    },
    {timestamps: true}
);

var Factura_Schema = mongoose.Schema(
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
var model_carrera = mongoose.model("carreras", Carrera_Schema);
var model_estado = mongoose.model("estados", Estado_Schema);
var model_factura = mongoose.model("facturas", Factura_Schema);

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
                        estado: "6295701cdd90740032907c2d"
                    }, 
    function(err) {
        if (err) return console.error(err);
    }
);