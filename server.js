const express = require('express');
const { sequelize } = require('./models/User');
const path = require('path');
const streamingService = require('./services/streamingService');
const userRoutes = require('./routes/userRoutes'); // Importa tus rutas de usuario

const app = express();

app.use(express.json());

// Servir archivos estáticos desde la carpeta "services/streaming"
app.use('/services/streaming', express.static(path.join(__dirname, 'services', 'streaming')));

// Usa el módulo de enrutamiento de streamingService
app.use('/', streamingService);

// Usa las rutas de usuario en tu aplicación Express
app.use('/api/users', userRoutes); // Añade las rutas de usuario

// Servir los archivos HTML desde la carpeta "views"
app.use(express.static(path.join(__dirname, 'views')));

// Redirigir las rutas al archivo player.html
app.get('/player', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'player.html'));
});

// Redirigir las rutas al archivo register.html
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Redirigir las rutas al archivo login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
