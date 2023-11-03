//importar dependencias:
const mongoose = require("mongoose");


//metodo de conexion:
const conexion = async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/mi_blog");
        console.log("conectado correctamente a la base de datos mi_blog");
    }catch(error){
        console.log(error)
        throw new Error("No se ha podido conectas a la base de datos");
    }
}

//exportar metodo:
module.exports = {
    conexion
}