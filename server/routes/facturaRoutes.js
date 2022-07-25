//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Factura controller para los métodos definidos
const facturaController = require("../controllers/facturaController");

//Autenticación para el uso del API
const auth = require("../middleware/auth");
const {permit}  = require("../middleware/authorization");

//Definición de rutas para cada uno de los verbos para las facturas

router.get("/", auth, permit("admin"), facturaController.get);
//router.get("/", facturaController.get);

router.get("/:id", facturaController.getById);

router.post("/", facturaController.create);

router.delete("/:id", facturaController.delete);

router.put("/:id", facturaController.update);

module.exports = router;