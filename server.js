// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint untuk menerima pesan dari frontend
app.post('/api/message', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await getDialogflowResponse(userMessage);
        res.json({ reply: response });
    } catch (error) {
        console.error('Error getting response from Dialogflow:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Fungsi untuk menghubungi Dialogflow
async function getDialogflowResponse(message) {
    const sessionClient = new SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
        process.env.DIALOGFLOW_PROJECT_ID, 
        process.env.DIALOGFLOW_SESSION_ID || '12345' // Gunakan session ID dari environment atau default '12345'
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'id-ID', // Ganti dengan kode bahasa yang diinginkan
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    if (responses[0]?.queryResult?.fulfillmentText) {
        return responses[0].queryResult.fulfillmentText;
    } else {
        throw new Error('No response from Dialogflow');
    }
}

// Mulai server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
