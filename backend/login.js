const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const port = 5000;

// Enable CORS for the frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json()); // Parse JSON requests

// Function to fetch data from the external web service
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                console.log(`Raw response from ${url}:\n${data}`);
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    console.error(`Failed to parse JSON from URL: ${url}`);
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        request.on('error', (error) => {
            console.error(`HTTP request failed for URL: ${url}`, error);
            reject(error);
        });

        // Add timeout
        request.setTimeout(10000, () => {
            request.abort();
            reject(new Error('Request timeout'));
        });
    });
}

// Route to authenticate and retrieve session ID
app.post('/auth', async (req, res) => {
    const { login, password } = req.body;
    const authUrl = `http://web.fc.utm.my/ttms/web_man_webservice_json.cgi?entity=authentication&login=${login}&password=${password}`;

    try {
        const authResponse = await fetchData(authUrl);
        if (authResponse[0] && authResponse[0].session_id) {
            res.json({
                message: 'Authentication successful!',
                data: authResponse[0],
            });
        } else {
            res.status(401).json({ message: 'Authentication failed. Invalid login or password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during authentication: ' + error.message });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
