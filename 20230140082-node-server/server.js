const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); 

const presensiRoutes = require('./routes/presensi');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');

const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => res.send('Home Page for API'));

app.use('/api/presensi', presensiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server after DB authentication (do NOT use sequelize.sync({ alter: true }) here)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing server and DB connection...');
  try { await sequelize.close(); } catch (e) { /* ignore */ }
  process.exit(0);
});