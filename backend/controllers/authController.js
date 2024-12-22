const fetchData = require('../utils/fetchData');

const authenticateUser = async (req, res) => {
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
};

module.exports = { authenticateUser };
