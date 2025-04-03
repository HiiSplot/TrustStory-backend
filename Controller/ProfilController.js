// Récupération données profil
app.get('/profil/:userId', async (req, res) => {
  try {
    const query = `SELECT id, firstname, lastname, pseudo, email, birthday FROM users WHERE id = ?`;
    const id = req.params.userId;
    console.log(id);
    

    pool.query(query, [id], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des données :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupération des favoris
app.get('/profil/:userId/favorite', async (req, res) => {
  try {
    const query = `SELECT stories.id, title, date, author, description FROM stories INNER JOIN favorites_stories ON stories.id = favorites_stories.id_story WHERE favorites_stories.id_user = ?`;
    const userId = req.params.userId;

    pool.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des favoris :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupération des histoires by user
app.get('/profil/:userId/stories', async (req, res) => {
  try {
    const query = `SELECT * FROM stories WHERE user_id = ?`;
    const userId = req.params.userId;

    pool.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des histoires :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
})