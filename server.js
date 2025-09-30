const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS pour autoriser votre frontend
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'https://votre-domaine.com'],
    credentials: true
}));
app.use(express.json());

// Route santé
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Proxy PawaPay opérationnel' });
});

// Route pour créer un dépôt
app.post('/api/pawapay/deposits', async (req, res) => {
    try {
        console.log('📦 Requête PawaPay reçue:', req.body);
        
        const response = await fetch('https://api.sandbox.pawapay.io/v2/deposits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PAWAPAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        console.log('✅ Réponse PawaPay:', data);
        
        res.status(response.status).json(data);
    } catch (error) {
        console.error('❌ Erreur proxy:', error);
        res.status(500).json({ 
            error: 'Erreur de connexion à PawaPay',
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy PawaPay running on port ${PORT}`);
});
