const http = require('http');
const https = require('https');

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

module.exports = fetchData;
