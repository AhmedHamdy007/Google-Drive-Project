const User = require("../models/User"); // Import your User model
const fetchData = require("../utils/fetchData"); // Your external authentication function

const authenticateUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    // Step 1: Check if the user exists in the database
    const user = await User.findOne({ matric_number: login });

    if (user) {
      // Step 2: If the user is an admin, validate the password
      if (user.isAdmin) {
        if (password === "12345") {
          return res.json({
            message: "Admin login successful!",
            data: user,
          });
        } else {
          return res.status(401).json({ message: "Invalid admin password." });
        }
      }

      // Step 3: Proceed with external authentication for normal users
      const authUrl = `http://web.fc.utm.my/ttms/web_man_webservice_json.cgi?entity=authentication&login=${login}&password=${password}`;
      const authResponse = await fetchData(authUrl);

      if (authResponse[0] && authResponse[0].session_id) {
        res.json({
          message: "Authentication successful!",
          data: authResponse[0],
        });
      } else {
        res.status(401).json({ message: "Authentication failed. Invalid login or password." });
      }
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: `Error during authentication: ${error.message}` });
  }
};

module.exports = { authenticateUser };
