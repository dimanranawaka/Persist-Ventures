import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
const WALLET_ADDRESS = '4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK';
const SOLANA_API_URL = `https://api.mainnet-beta.solana.com`;

app.get('/transactions', async (req, res) => {
    try {
        const response = await axios.post(SOLANA_API_URL, {
            jsonrpc: '2.0',
            id: 1,
            method: 'getConfirmedSignaturesForAddress2',
            params: [
                WALLET_ADDRESS,
                { limit: 1000 }
            ]
        });

        const transactions = response.data.result;
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transactions');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
