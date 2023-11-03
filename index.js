//importar dependencias:
const express = require("express");
const cors = require("cors");

//importar metodo de conexion:
const {conexion} = require("./basedatos/conexion");


//inicializar app:
console.log("App arrancada");

//conectar a la base de datos:
conexion()

//crear servidor de node:
const app = express()
const puerto = 3900

//configurar el cors:
app.use(cors());

// convertir body a objeto json:
app.use(express.json()); //recibir datos con content-type app/json
app.use(express.urlencoded({extended:true}))

//crear rutas:
const rutas_articulo = require("./rutas/articulos")

//carga rutas
app.use("/api", rutas_articulo)


//crear servidor y escuchar peticiones http:
app.listen(puerto, ()=>{
   console.log("servidor corriendo en el puerto " + puerto) 
})


