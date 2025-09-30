const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware CORS élargi
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000', 'https://yourdomain.com'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Gestion explicite des pré-vols OPTIONS
app.options('*', cors());

// Route santé
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Proxy PawaPay opérationnel',
        timestamp: new Date().toISOString()
    });
});

// Route pour les dépôts PawaPay
app.post('/api/pawapay/deposits', async (req, res) => {
    console.log('📦 Requête PawaPay reçue:', JSON.stringify(req.body, null, 2));
    
    try {
        const PAWAPAY_API_KEY = process.env.PAWAPAY_API_KEY || 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjExMDMxIiwibWF2IjoiMSIsImV4cCI6MjA3NDcxNzQwNywiaWF0IjoxNzU5MTg0NjA3LCJwbSI6IkRBRixQQUYiLCJqdGkiOiIzZmFkN2JkMi0yZWIzLTQyZDQtYjIyMi0xNTNlNDU0ZTVkNWIifQ.l24z5_S0CZOLYBbkIjxSOqJxItW_yHoxxvAT8UtDrtvK9xGts3uSdYvfKBlpMQIk5V9FWfDcHeOFHCWMnX47Mg';
        
        const response = await fetch('https://api.sandbox.pawapay.io/v2/deposits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAWAPAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        const responseText = await response.text();
        console.log('📡 Réponse PawaPay brute:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = { rawResponse: responseText };
        }
        
        console.log('✅ Réponse PawaPay traitée:', data);
        
        // Retourner la réponse avec les headers CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(response.status).json(data);
        
    } catch (error) {
        console.error('❌ Erreur proxy:', error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ 
            error: 'Erreur de connexion à PawaPay',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Route par défaut
app.get('/', (req, res) => {
    res.json({ 
        message: 'Proxy PawaPay API',
        endpoints: {
            health: '/health',
            createDeposit: 'POST /api/pawapay/deposits'
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Proxy PawaPay running on port ${PORT}`);
    console.log(`📍 Health check: http://0.0.0.0:${PORT}/health`);
});
