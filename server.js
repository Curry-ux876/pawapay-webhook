const express = require('express');
const cors = require('cors');
const app = express();

// Middleware essentiel
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stockage en mémoire (temporaire pour les tests)
let payments = {};

// ✅ ACCEPTER LES REQUÊTES POST
app.post('/pawapay-webhook', (req, res) => {
    console.log('✅ WEBHOOK POST REÇU !');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const webhookData = req.body;
    
    // Traiter selon le type d'événement PawaPay
    if (webhookData.event === 'payment.completed') {
        const paymentRef = webhookData.data.reference;
        payments[paymentRef] = {
            status: 'completed',
            data: webhookData.data,
            processedAt: new Date().toISOString()
        };
        console.log(`💰 Paiement ${paymentRef} marqué comme complété`);
    }
    
    // Répondre IMMÉDIATEMENT à PawaPay
    res.status(200).json({
        status: 'success',
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
    });
});

// ✅ Endpoint pour vérifier le statut
app.get('/status/:transactionRef', (req, res) => {
    const transactionRef = req.params.transactionRef;
    const payment = payments[transactionRef];
    
    if (payment) {
        res.json({
            transactionRef: transactionRef,
            status: payment.status,
            data: payment.data,
            checkedAt: new Date().toISOString()
        });
    } else {
        res.status(404).json({
            transactionRef: transactionRef,
            status: 'not_found',
            checkedAt: new Date().toISOString()
        });
    }
});

// ✅ Route GET pour le webhook (au cas où)
app.get('/pawapay-webhook', (req, res) => {
    res.json({
        message: 'PawaPay webhook endpoint',
        instruction: 'Use POST method for webhook calls',
        supported_methods: ['POST', 'GET']
    });
});

// ✅ Route santé
app.get('/', (req, res) => {
    res.json({
        message: '🚀 PawaPay Webhook Server is RUNNING!',
        endpoints: {
            webhook: 'POST /pawapay-webhook',
            status: 'GET /status/:transactionRef',
            health: 'GET /health'
        },
        total_payments: Object.keys(payments).length
    });
});

// ✅ Route santé détaillée
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        payments_processed: Object.keys(payments).length
    });
});

// ✅ Gestion des méthodes non supportées
app.all('/pawapay-webhook', (req, res) => {
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.set('Allow', 'GET, POST');
        return res.status(405).json({
            error: 'Method Not Allowed',
            allowed: ['GET', 'POST']
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🎯 PawaPay Webhook Server running on port ${PORT}`);
    console.log(`🔗 Webhook URL: https://your-app.onrender.com/pawapay-webhook`);
    console.log(`📊 Status URL: https://your-app.onrender.com/status/:transactionRef`);
});
