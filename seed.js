require('dotenv').config()
const mongoose = require('mongoose')
const Bebida = require('./models/bebida')

const bebidas = [
  {
   nombre: "Margarita",
    tipo: "cocktail",
    base: "tequila",
    tags: ["ácido", "salado"],
    alcohol: 15,
    precio: 120,
    imagen: "https://thecookinglab.es/wp-content/uploads/2024/08/Coctel-margarita-receta.jpg",
    descripcion: "Clásico cocktail mexicano con tequila, triple sec y jugo de limón."
  },
{
    nombre: "Michelada",
    tipo: "cerveza",
    base: "malta",
    tags: ["ácido", "salado", "picoso"],
    alcohol: 5,
    precio: 90,
    imagen: "https://img.magnific.com/foto-gratis/coctel-michelada-casero-jugo-lima-cervezasalsa-picantelim-salado-jugo-tomate-aislado_123827-21709.jpg?semt=ais_hybrid&w=740&q=80",
    descripcion: "Clásico cocktail mexicano con jugo de tomate, y salsas negras"
  },
  {
    nombre: "Suero",
    tipo: "cocktail",
    base: "vodka",
    tags: ["dulce"],
    alcohol: 20,
    precio: 100,
    imagen: "https://www.shutterstock.com/image-photo/azulito-little-smurf-cocktail-made-260nw-2319937733.jpg",
    descripcion: "Cocktel de vodka con suero y bebida energizante"
  },
  
]

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Bebida.deleteMany()
    await Bebida.insertMany(bebidas)
    console.log('Base de datos poblada ✅')
    process.exit()
  })
  .catch((err) => console.error(err))