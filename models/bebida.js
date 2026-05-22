const mongoose = require('mongoose')

const bebidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  base: { type: String, required: true },
  tags: [String],
  alcohol: { type: Number, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String },
  descripcion: { type: String }
})

const Bebida = mongoose.model('Bebida', bebidaSchema)

module.exports = Bebida