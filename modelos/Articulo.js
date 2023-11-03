//crear el modelo para l coleccion articulos de mi base de dtos:
//importar dependencias y metodos:
const {Schema, model} = require("mongoose");


//crear el esquema de un articulo:
const ArticuloSchema = Schema({
    titulo:{
        type: String,
        require: true
    },
    contenido:{
        type: String,
        require: true
    },
    fecha:{
        type: Date ,
        default: Date.now
    },
    imagen:{
        type: String,
        default: "default.png"
    }
})

//exportamos el modelo:
module.exports = model("Articulo", ArticuloSchema, "articulos")