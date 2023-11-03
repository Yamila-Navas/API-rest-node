//importar dependencias:
const validator = require("validator")
const Articulo = require("../modelos/Articulo")
const { validar } = require("../helper/validar")
const fs = require("fs")
const path = require("path")

//controladores, estos metodos son acciones:

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "soy una accion de pueba en mi controlador de articulos"
    })
}

const crear = async (req, res) => {
    // Recoger parametros por post a guardar
    let parametros = req.body;

    // Validar los datos
    try {
        validar(parametros)

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Crear el objeto a guardar y asignar valores al objeto basado en el modelo (manual o automatico)
    const articulo = new Articulo(parametros);

    // Guardar el articulo en la base de datos
    try {
        const articuloGuardado = await articulo.save();
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado
        });
    } catch (err) {
        // Manejar el error
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el artículo"
        });
    }
};



const listar = async (req, res) => {
    try {
        let consulta = Articulo.find({})
            .sort({ fecha: -1 });

        if (req.params.ultimos === 'ultimos') {
            consulta = consulta.limit(3);
        }

        const articulos = await consulta.exec();

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            contador: articulos.length,
            parametro_url: req.params.ultimos,
            articulos
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener los artículos"
        });
    }
};


const uno = async (req, res) => {
    try {
        //recoger un id por la url:
        let id = req.params.id;
        let consulta = Articulo.findById(id);
        //ejecuta la consulta:
        const artculo = await consulta.exec()
        if (!artculo || artculo.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el rticulo"
            })
        }
        return res.status(200).json({
            status: "succes",
            artculo
        })



    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener el articulo"
        })
    }

}


const borrar = async (req, res) => {
    try {
        let id = req.params.id;
        let consulta = Articulo.findOneAndDelete({ _id: id })
        const articuloBorrado = await consulta.exec()
        if (!articuloBorrado) {
            return res.status(400).json({
                status: "error",
                mensaje: "Eroror al borrar el articulo"
            })
        }
        return res.status(200).json({
            status: "succes",
            artculo: articuloBorrado,
            mensaje: "artculo borrado correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se pudo boorr el articulo"
        })
    }
}

const editar = async (req, res) => {
    try {
        //guardar el id de la url:
        let id = req.params.id;

        //recogemos los nuevos datos:
        let parametros = req.body;

        //validar los datos nuevos:
        try {
            validar(parametros)

        } catch (error) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        //buscar y actualizar los datos:
        let consulta = Articulo.findOneAndUpdate({ _id: id }, parametros, { new: true })

        const artculoActualizado = await consulta.exec();

        if (!artculoActualizado) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se pudeo editar el rticulo"
            })
        }
        return res.status(200).json({
            status: "succes",
            artculoActualizado,
            mensaje: "se edito correctamente el atiulo"
        })




    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "no se a podido editar el articulo"
        })
    }
}


const subir = async (req, res) => {
    //configurar multer

    //recoger e fichero de imagene subido
    //validar el archivo
    if (!req.file && !req.files) {
        return res.status(400).json({
            status: "error",
            mensaje: "peticion invalda"
        })
    }

    //nombre de archivo
    let archivo = req.file.originalname;
    //extencion del archivo
    let archivo_split = archivo.split("\.");
    let extencion = archivo_split[1];
    //comprobar extencion correcta
    if (extencion != "png" && extencion != "jpg" && extencion != "jpeg" && extencion != "gif") {
        //borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "imgen invalda"
            })
        })
    } else {
        //si va todo bien, actualizar el artculo


        try {
            //guardar el id de la url:
            let id = req.params.id;



            //buscar y actualizar los datos:
            let consulta = Articulo.findOneAndUpdate({ _id: id }, { imagen: req.file.filename }, { new: true })

            const articuloActualizado = await consulta.exec();

            if (!articuloActualizado) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "No se pudo subir la imagen"
                })
            }
            return res.status(200).json({
                status: "succes",
                articuloActualizado,
                files: req.file,
                mensaje: "se subio correctamente la imagen"
            })


        } catch (error) {
            return res.status(500).json({
                status: "error",
                mensaje: "No se pudo subir la imagen"
            })
        }

    }
}

const imagen = async (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    try {

        if (fs.existsSync(ruta_fisica)) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe"
            })
        }

    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "Error al mostrar imagen"
        })
    }
}

const buscador = async (req, res) => {
    try {
        //sacar el string de busqueda
        let busqueda = req.params.buscar;
        //find or
        const consulta = Articulo.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } }
            ]
        }).sort({ fecha: -1 })

        const artculosEcontrados = await consulta.exec()

        if (!artculosEcontrados || artculosEcontrados.length <= 0){
            return res.status(404).json({
                status: "error",
                mensaje: "El articulo no existe"
            })
        }

        return res.status(200).json({
            status: "succes",
            artculosEcontrados,
            mensaje: "busqueda realizda correctmente"})


    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar articulos"
        })
    }
}


module.exports = {
    prueba,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}


