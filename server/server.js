require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const dailyMenuRoutes = require('./routes/dailyMenuRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/daily-menu', dailyMenuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Bootstrapped Cafe API' });
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Bootstrapped Cafe API running on port ${PORT}`);
});
