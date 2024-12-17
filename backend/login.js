const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Initialize the Express app
const app = express();
const port = 5000;

// Enable CORS to allow requests from the Next.js frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use bodyParser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Enable JSON parsing

// MongoDB URI and database setup
const mongoURI = "mongodb://localhost:27017/Edudb"; // Correct MongoDB port
const dbName = "EduSyncDB";
let db;

// Connect to MongoDB
async function connectToMongoDB() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db(dbName); // Save the database instance
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit if unable to connect
    }
}

connectToMongoDB();

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


app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
  });


app.get('/get-users', async (req, res) => {
    try {
        // Assuming 'users' is the collection name
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).toArray(); // Fetch all users

        res.json({
            success: true,
            message: 'Users fetched successfully!',
            data: users,  // Return users data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users: ' + error.message,
        });
    }
});


// Add a test route to check MongoDB connection
app.get('/test-db', async (req, res) => {
    try {
        // Example: Check if the 'sessions' collection exists and fetch all documents
        const sessionsCollection = db.collection('sessions');
        const sessions = await sessionsCollection.find({}).toArray();

        res.json({
            success: true,
            message: 'Database connection is working!',
            data: sessions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to connect to the database: ' + error.message,
        });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
