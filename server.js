const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB
    mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch(err => console.error(err));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));