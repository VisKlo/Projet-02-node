import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';

// Routes
import authRoutes from './routes/auth.js';
import furnitureRoutes from './routes/furniture.js';
import materialRoutes from './routes/materials.js';
import supplierRoutes from './routes/suppliers.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection and sync
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stats', statsRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Furniture Management API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});