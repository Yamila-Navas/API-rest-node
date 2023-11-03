
const express = require("express");
const  router = express.Router();
const multer = require("multer"); //para luego configurarlo
//importamos controladores:
const ArticuloControlador = require("../controladores/articulo")

//configurar muler para una ruta especifica:
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./imagenes/articulos/") //defino donde quiero gurdar los archivos que se vayan a subir
    },
    filename:function(req, file, cb){
        cb(null, "articulo" + Date.now() + file.originalname) //defino el nombre y el formato de los archvos
    }
})
const subidas = multer({storage:almacenamiento})


//aca cremos las rutas con ruoter de express:
router.get("/ruta-de-prueba",ArticuloControlador.prueba);
router.post("/crear",ArticuloControlador.crear);
router.get("/articulos/:ultimos?", ArticuloControlador.listar)
router.get("/uno/:id", ArticuloControlador.uno)
router.delete("/borrar/:id", ArticuloControlador.borrar)
router.put("/editar/:id", ArticuloControlador.editar)
router.post("/subir-imagen/:id",[subidas.single("file")], ArticuloControlador.subir)
router.get("/imagen/:fichero", ArticuloControlador.imagen)
router.get("/buscador/:buscar", ArticuloControlador.buscador)

//exportar:
module.exports = router;

