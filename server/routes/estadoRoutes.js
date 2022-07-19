//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Factura controller para los métodos definidos
const estadoController = require("../controllers/estadoController");

//Definición de rutas para cada uno de los verbos para los estados
router.get("/", estadoController.get);

router.get("/:id", estadoController.getById);

router.post("/", estadoController.create);

router.delete("/:id", estadoController.delete);

router.put("/:id", estadoController.update);

module.exports = router;