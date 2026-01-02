const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB
mongoose.connect(
  'mongodb+srv://erdavvo:y4tv8ExP4ATszTNF@cluster0.glxac4g.mongodb.net/?appName=Cluster0',
);

// 📦 Schema
const DishSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String
});

const Dish = mongoose.model('Dish', DishSchema);

// ------------------ API ------------------

// GET menu
app.get('/menu', async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

// ADD dish
app.post('/menu', async (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }

  const dish = new Dish({ name, price, category });
  await dish.save();
  res.json({ success: true });
});

// -----------------------------------------

app.listen(3000, () =>
  console.log('✅ Server avviato su http://localhost:3000')
);
