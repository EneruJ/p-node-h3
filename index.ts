import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import models
import { User } from './models/User';

// Import routes
import allRoutes from './routes/routes';

// Initialize app
const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/', allRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://anon:marbleCake@localhost:27017/my_db")
.then(() => {
  console.log('Connected to database');
})
.catch((err) => {
  console.log('Error connecting to database:', err.message);
});

async function createAdmin() {
    const admin = new User({
      username: 'admin',
      password: 'password',
      email: 'admin@admin.fr',
      role: 'admin',
    });
  
    try {
      await admin.save();
      console.log('Admin user created successfully');
    } catch (err) {
      console.error('Error creating admin user:', err);
    }
  }
  
  createAdmin();
  

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
