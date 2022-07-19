const {Shema, model, Schema} = require ("mongoose");

const EstadoShema = new Schema({
    nombre:{
        type:String,
        unique: true,
        required: true
    },
    descripcion: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);

const EstadoModel = model("Estados", EstadoShema);

module.exports = EstadoModel;