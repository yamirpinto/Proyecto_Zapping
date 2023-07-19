const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  //console.log('Storing password:', hashedPassword); 

  User.create({
    name: name,
    email: email,
    password: hashedPassword
  })
    .then(user => res.json(user))
    .catch(error => {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "Email actualmente en uso." });
      }
      return res.status(500).json({ message: "Error creando el usuario." });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tanto el Email como la clave son requeridos." });
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no existe." });
      }

      //console.log('Retrieved password:', user.password); 

      bcrypt.compare(password, user.password)
        .then(match => {
          if (!match) {
            return res.status(401).json({ message: "Credenciales incorrectas." });
          }

          const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

          res.json({ token, user });
        });
    })
    .catch(error => res.status(500).json({ message: "Error en el inicio de sesión." }));
};

module.exports = {
  createUser,
  loginUser
};