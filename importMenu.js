const mongoose = require('mongoose');
const fs = require('fs');

// ⚠️ usa LA STESSA URI di server.js
mongoose.connect(
  'mongodb+srv://erdavvo:y4tv8ExP4ATszTNF@cluster0.glxac4g.mongodb.net/?appName=Cluster0'
);

// stesso schema del server
const DishSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String
});

const Dish = mongoose.model('Dish', DishSchema);

const menu = JSON.parse(fs.readFileSync('menu.json', 'utf-8'));

async function importa() {
  await Dish.deleteMany(); // opzionale: pulisce tutto

  const dishes = [];

  for (const category in menu) {
    menu[category].forEach(([name, price]) => {
      dishes.push({
        name,
        price,
        category
      });
    });
  }

  await Dish.insertMany(dishes);
  console.log(`✅ Importati ${dishes.length} piatti`);
  process.exit();
}

importa();
