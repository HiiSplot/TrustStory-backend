// Récupération des catégories
app.get('/categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM categories';
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de la sélection des catégories :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des catégories.' });
      }
      
      res.json(results);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des catégories.' });
  }
});

// Récupération des histoires
app.get('/stories', async (req, res) => {
  try {
    const query = 'SELECT * FROM stories';
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de la sélection des histoires :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des histoires.' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des histoires :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des histoires.' });
  }
});

// Création d'une histoire
app.post('/stories', async (req, res) => {
  const { title, date, author, description, categoryId, userId } = req.body;
  try {
    const query = `INSERT INTO stories (title, date, author, description, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [title, date, author, description, categoryId, userId];

    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Erreur lors de l'insertion de l'histoire :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'histoire.' });
      }

      res.status(201).json({ message: 'Histoire créée avec succès !' });
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'histoire :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'histoire.' });
  }
})

// Récupération des histoires likées par l'utilisateur
app.get('/stories/:userId', async (req, res) => {
  const query = `SELECT * FROM favorites_stories WHERE id_story = ?`;
  const userId = req.params.userId;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des favoris :", err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    res.json(results);
  });
});

// Suppression d'une histoire
app.delete('/stories/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    const query = `DELETE FROM stories WHERE id = ?`;

    pool.query(query, [storyId], (err, results) => {
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

// Récupération des histoires likées par l'utilisateur
app.get('/stories/:storyId/:userId', async (req, res) => {
  const query = `SELECT * FROM favorites_stories WHERE id_story = ? AND id_user = ?`;
  const { storyId, userId } = req.params;

  pool.query(query, [storyId, userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des favoris :", err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    res.json(results);
  });
});

// Ajout d'une histoire en favoris
app.post('/stories/:storyId/:userId', async (req, res) => {
  try {
    const { storyId, userId } = req.params;
    
    const query = `INSERT INTO favorites_stories (id_story, id_user) VALUES (?, ?)`;

    pool.query(query, [storyId, userId], (err, results) => {
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

// Suppression d'une histoire en favoris
app.delete('/stories/:storyId/:userId', async (req, res) => {
  try {
    const { storyId, userId } = req.params;
    
    const query = `DELETE FROM favorites_stories WHERE id_story = ? AND id_user = ?`;

    pool.query(query, [storyId, userId], (err, results) => {
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