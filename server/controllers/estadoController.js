//Utilización del modelo de estado
const EstadoModel = require("../models/estado");

//Método para obtener las estados
module.exports.get = async (req, res, next) => {
  const estados = await EstadoModel.find().exec();
  res.json(estados);
};

//Método para obtener un estado por ID
module.exports.getById = async (req, res, next) => {
  const id = req.params.id;
  const estado = await EstadoModel.findOne({ _id: id });
  res.json(estado);
};

//Método para crear las estados
module.exports.create = (req, res, next) => {
  const estadoModel = new EstadoModel( req.body );
  estadoModel.save();
  res.json(estadoModel);
};

//Método para eliminar las estados
module.exports.delete = async (req, res, next) => {
  const estado = await EstadoModel.findByIdAndRemove(req.params.id);
  // si factura es null significa que no existe el registro
  if (estado) {
    res.json({ result: "El estado fue borrado correctamente", estado });
  } else {
    res.json({ result: "ID del estado no existe en los documentos de la BD", estado });
  }
};

//Método para modificar las estados
module.exports.update = async (req, res, next) => {
  const estado = await EstadoModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,     // ==> {nombre: nombre, descripcion: descripcion}
    { new: true } // retornar el registro que hemos modificado con los nuevos valores
  );
  res.json(estado);
};
