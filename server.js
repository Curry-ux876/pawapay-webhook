// Code pour votre endpoint Render (server.js)
const express = require('express');
const app = express();

// MIDDLEWARE IMPORTANT
app.use(express.json()); // Pour parser le JSON
app.use(express.urlencoded({ extended: true }));

// Autoriser CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Gérer les preflight OPTIONS requests
app.options('/pawapay-webhook', (req, res) => {
    res.status(200).send();
});

// VOTRE WEBHOOK PRINCIPAL
app.post('/pawapay-webhook', (req, res) => {
    console.log('✅ Webhook PawaPay reçu (POST)');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    // Répondre immédiatement à PawaPay
    res.status(200).json({
        status: 'success',
        message: 'Webhook received successfully'
    });
    
    // Traitement asynchrone ensuite
    processWebhookData(req.body);
});

// Endpoint pour vérifier le statut
app.get('/status/:transactionRef', (req, res) => {
    const transactionRef = req.params.transactionRef;
    res.json({
        transactionRef: transactionRef,
        status: 'completed', // À adapter selon votre logique
        checkedAt: new Date().toISOString()
    });
});

// Route par défaut
app.get('/', (req, res) => {
    res.json({ 
        message: 'PawaPay Webhook Server is running',
        endpoints: {
            webhook: 'POST /pawapay-webhook',
            status: 'GET /status/:transactionRef'
        }
    });
});

function processWebhookData(webhookData) {
    // Traitement asynchrone des données
    console.log('📦 Traitement des données webhook:', webhookData);
    
    // Ici vous mettrez à jour Firebase, etc.
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook server running on port ${PORT}`);
});
