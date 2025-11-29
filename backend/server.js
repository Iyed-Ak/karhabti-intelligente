require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/infractions', require('./routes/infractions'));
app.use('/api/garages', require('./routes/garages'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ============= NOUVEAU CODE À AJOUTER =============
// Exporte l'app pour les tests
module.exports = app;

// Démarre le serveur seulement si ce fichier est exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
  });
}
// ============= FIN DU NOUVEAU CODE =============