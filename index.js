const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://aravshreyass70:Kalvium@kalvium.w4qkw.mongodb.net/validate_users?retryWrites=true&w=majority&appName=Kalvium');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    
  }
}

const UserSchema = new mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
});
const User = mongoose.model('User', UserSchema);

app.post('/login', async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res.status(400).json({ error: 'Mail and password are required' });
  }

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(200).json({ message: 'Login successful!' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectToDatabase();
});