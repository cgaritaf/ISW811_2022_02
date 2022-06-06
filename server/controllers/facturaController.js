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

