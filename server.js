const express = require('express');
const app = express();

// Middleware pour comprendre le JSON
app.use(express.json());

// Votre webhook pour PawaPay
app.post('/pawapay-webhook', (req, res) => {
  console.log('🔔 Webhook PawaPay reçu !');
  console.log('Données reçues:', JSON.stringify(req.body, null, 2));
  
  // ICI : Vous pouvez ajouter votre logique
  // - Sauvegarder en base de données
  // - Envoyer un email
  // - Mettre à jour une commande
  
  console.log('✅ Réponse envoyée à PawaPay');
  
  // Toujours répondre 200 à PawaPay
  res.status(200).json({ 
    status: 'success',
    message: 'Webhook reçu avec succès',
    timestamp: new Date().toISOString()
  });
});

// Page d'accueil simple pour les tests
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Serveur Webhook PawaPay Actif</h1>
    <p><strong>URL du webhook:</strong> <code>/pawapay-webhook</code></p>
    <p><strong>Méthode:</strong> POST</p>
    <p><strong>Date:</strong> ${new Date()}</p>
    <hr>
    <p>Ce serveur est prêt à recevoir les callbacks de PawaPay</p>
  `);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur webhook démarré sur le port ${PORT}`);
});
