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
            params: [WALLET_ADDRESS, { limit: 100 }]
        });

        const transactions = response.data.result;

        const formattedTransactions = transactions.map(tx => ({
            uuid: tx.signature,
            network: "Solana",
            fee: 5000,
            compute_units_consumed: 150,
            timestamp: new Date(tx.blockTime * 1000).toISOString(),
            type: tx.err ? "error" : "send_token",
            wallet_address: WALLET_ADDRESS,
            transaction_hash: tx.signature,
            metadata: {
                amount: "-10000"
            },
            token: {
                uuid: "49afe645-a62f-44c7-85b0-d73567cb7a3a",
                network: "Solana",
                contract_address: "So11111111111111111111111111111111111111112",
                name: "Wrapped SOL",
                symbol: "SOL",
                decimals: 9,
                display_decimals: 2,
                logo_url: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            },
            explorer_url: `https://solscan.io/tx/${tx.signature}?cluster=mainnet-beta`
        }));

        res.json({
            status: "success",
            message: "Activity retrieved successfully",
            data: formattedTransactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transactions');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
