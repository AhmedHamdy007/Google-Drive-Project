const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const port = 5000;

// Enable CORS to allow requests from the Next.js frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


// Use bodyParser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Enable JSON parsing

// Function to fetch data from the external URL
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(data);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Function to authenticate and retrieve session ID
async function authenticate(login, password) {
    const authUrl = `http://web.fc.utm.my/ttms/web_man_webservice_json.cgi?entity=authentication&login=${login}&password=${password}`;
    
    try {
        const authResponse = await fetchData(authUrl);
        const authData = JSON.parse(authResponse);

        if (authData[0] && authData[0].session_id) {
            return { success: true, sessionId: authData[0].session_id };
        } else {
            return { success: false };
        }
    } catch (error) {
        throw new Error('Authentication failed: ' + error.message);
    }
}

// Route to handle authentication
app.post('/auth', async (req, res) => {
    const { login, password } = req.body;

    try {
        // Authenticate with the provided login and password
        const authResult = await authenticate(login, password);

        // Send JSON response based on authentication success or failure
        if (authResult.success) {
            res.json({
                message: 'Authentication Successful!',
                sessionId: authResult.sessionId,
            });
        } else {
            res.status(401).json({
                message: 'Authentication Failed! Invalid login or password.',
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during authentication: ' + error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
