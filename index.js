const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Bebida = require('./models/bebida')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://menu-bar-pied.vercel.app'
  ]
}))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB ✅'))
  .catch((err) => console.error('Error al conectar:', err))

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de Ruso Bar 🍹' })
})


const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ mensaje: 'Token requerido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (error) {
    res.status(403).json({ mensaje: 'Token inválido o expirado' })
  }
}

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

app.post('/bebidas', verificarToken, async (req, res) => {
  try {
    const nuevaBebida = new Bebida(req.body)
    await nuevaBebida.save()
    res.status(201).json(nuevaBebida)
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la bebida', error })
  }
})

app.put('/bebidas/:id', verificarToken ,async (req, res) => {
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

app.delete('/bebidas/:id', verificarToken, async (req, res) => {
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

app.post('/auth/login', async (req, res) => {
  const { usuario, password } = req.body

  if (usuario !== 'admin') {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
  }

  const passwordCorrecta = await bcrypt.compare(
    password,
    await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
  )

  if (!passwordCorrecta) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
  }

  const token = jwt.sign(
    { usuario: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({ token })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

