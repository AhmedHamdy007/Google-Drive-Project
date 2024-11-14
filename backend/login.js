const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const port = 3000;

// Use bodyParser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

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

// Route to display the login form
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><title>Login</title></head>
        <body>
            <h1>Login to Authenticate</h1>
            <form action="/auth" method="post">
                <label for="login">Login:</label>
                <input type="text" id="login" name="login" required><br><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br><br>
                <button type="submit">Authenticate</button>
            </form>
        </body>
        </html>
    `);
});

// Route to handle form submission and authenticate
app.post('/auth', async (req, res) => {
    const { login, password } = req.body;

    try {
        // Step 1: Authenticate with the provided login and password
        const authResult = await authenticate(login, password);

        // Step 2: Display result based on authentication success or failure
        if (authResult.success) {
            res.send(`
                <html>
                <head><title>Authentication Successful</title></head>
                <body>
                    <h1>Authentication Successful!</h1>
                    <p>Your session ID is: ${authResult.sessionId}</p>
                </body>
                </html>
            `);
        } else {
            res.send(`
                <html>
                <head><title>Authentication Failed</title></head>
                <body>
                    <h1>Authentication Failed!</h1>
                    <p>Invalid login or password. Please try again.</p>
                    <a href="/">Go back to login</a>
                </body>
                </html>
            `);
        }
    } catch (error) {
        res.status(500).send('Error during authentication: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
