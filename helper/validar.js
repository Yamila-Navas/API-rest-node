const validator = require("validator")

const validar = (parametros)=>{
    let validar_titulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo, { min: 5, max: 25 });
        let valdar_contenido = !validator.isEmpty(parametros.contenido);
        if (!validar_titulo || !valdar_contenido) {
            throw new Error("No se ha validado la información");
        }
}

module.exports = {
    validar
}