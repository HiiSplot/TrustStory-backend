const express = require('express');
const AuthController = require('../Controller/AuthController');
const authenticateToken = require('../middleWare/authMiddleware');

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/profil/:id', authenticateToken, (req, res) => {
  res.json({ message: 'Bienvenue sur votre profil !', user: req.user });
});

module.exports = router;
