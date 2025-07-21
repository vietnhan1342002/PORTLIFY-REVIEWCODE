import express from 'express';
import cors from 'cors';
import sequelize from './config/sequelize.js';
import { errorHandler } from './errors/errorHandle.js';
import authRoutes from './routes/auth.route.js';
import session from 'express-session';

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced'))
  .catch((err) => console.error('❌ Database sync error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_, res) => res.send('Hello from API 🚀'));
app.use('/api/auth', authRoutes);


// Error handler
app.use(errorHandler);

export default app;
