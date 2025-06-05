const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = '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'; // сюда свой ключ

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
            temperature: 0.7,
            max_tokens: 500
        })
    });

    const data = await response.json();
    res.json(data);
});

app.listen(8080, () => {
    console.log('Прокси-сервер запущен на http://localhost:8080');
});
