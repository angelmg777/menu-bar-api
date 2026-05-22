const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Bebida = require('./models/bebida')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB ✅'))
  .catch((err) => console.error('Error al conectar:', err))

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de Ruso Bar 🍹' })
})

app.get('/bebidas', async (req, res) => {
  try {
    const bebidas = await Bebida.find()
    res.json(bebidas)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener bebidas' })
  }
})

app.get('/bebidas/:id', async (req, res) => {
  try {
    const bebida = await Bebida.findById(req.params.id)
    if (!bebida) {
      return res.status(404).json({ mensaje: 'Bebida no encontrada' })
    }
    res.json(bebida)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la bebida' })
  }
})

app.post('/bebidas', async (req, res) => {
  try {
    const nuevaBebida = new Bebida(req.body)
    await nuevaBebida.save()
    res.status(201).json(nuevaBebida)
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la bebida', error })
  }
})

app.put('/bebidas/:id', async (req, res) => {
  try {
    const bebida = await Bebida.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!bebida) {
      return res.status(404).json({ mensaje: 'Bebida no encontrada' })
    }
    res.json(bebida)
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la bebida', error })
  }
})

app.delete('/bebidas/:id', async (req, res) => {
  try {
    const bebida = await Bebida.findByIdAndDelete(req.params.id)
    if (!bebida) {
      return res.status(404).json({ mensaje: 'Bebida no encontrada' })
    }
    res.json({ mensaje: 'Bebida eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la bebida' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})