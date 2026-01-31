require('dotenv').config(); // 1️⃣ load environment variables

const express = require('express'); // 2️⃣ import express
const cors = require('cors');       // 3️⃣ import cors
const connectDB = require('./src/config/db'); // 4️⃣ DB connection
const authRoutes = require('./src/routes/authRoutes'); // 5️⃣ auth routes
const noteRoutes = require('./src/routes/noteRoutes');
const app = express(); // 6️⃣ create express app

connectDB(); // 7️⃣ connect MongoDB

app.use(cors());            // 8️⃣ allow cross-origin
app.use(express.json());   // 9️⃣ allow JSON body

// 🔟 routes
app.get('/', (req, res) => {
  res.send('Memora Backend Running');
});

app.use('/api/auth', authRoutes); // ✅ REGISTER ROUTE HERE
app.use('/api/notes', noteRoutes);

// 1️⃣1️⃣ start server (LAST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MONGO_URI:', process.env.MONGO_URI);
});

