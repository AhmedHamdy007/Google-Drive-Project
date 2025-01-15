const User = require("../models/User"); // Import your User model
const fetchData = require("../utils/fetchData"); // External authentication function

const authenticateUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    // ✅ Step 1: Check if the user exists in the local database
    let user = await User.findOne({ matric_number: login });

    if (user) {
      // ✅ Step 2: Handle admin login
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

      // ✅ Step 3: If user exists, return the user data
      return res.json({
        message: "Authentication successful!",
        data: user,
      });
    }

    // ✅ Step 4: Authenticate with the external API
    const authUrl = `http://web.fc.utm.my/ttms/web_man_webservice_json.cgi?entity=authentication&login=${encodeURIComponent(
      login
    )}&password=${encodeURIComponent(password)}`;

    const authResponse = await fetchData(authUrl);

    if (authResponse[0] && authResponse[0].session_id) {
      const userData = authResponse[0];

      // ✅ Step 5: Save the user if they don't already exist
      user = new User({
        full_name: userData.full_name,
        matric_number: userData.login_name,
        email: userData.email?.trim(),
        description: userData.description,
        isAdmin: false,
      });

      await user.save();

      return res.json({
        message: "Authentication successful!",
        data: user,
      });
    } else {
      return res.status(401).json({
        message: "Authentication failed. Invalid login or password.",
      });
    }
  } catch (error) {
    // ✅ Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists in the database.",
      });
    }

    // ✅ Handle other server errors
    return res.status(500).json({
      message: `Error during authentication: ${error.message}`,
    });
  }
};

module.exports = { authenticateUser };
