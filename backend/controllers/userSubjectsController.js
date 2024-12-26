const fetchData = require('../utils/fetchData');

const getUserSubjects = async (req, res) => {
  const { no_matrik, sesi, semester } = req.query;

  if (!no_matrik) {
    return res.status(400).json({ message: 'Missing no_matrik parameter.' });
  }

  try {
    const subjectsUrl = `http://web.fc.utm.my/ttms/web_man_webservice_json.cgi?entity=pelajar_subjek&no_matrik=${no_matrik}`;
    const allSubjects = await fetchData(subjectsUrl);

    // Filter subjects based on session and semester
    const filteredSubjects = allSubjects.filter(
      (subject) => subject.sesi === sesi && subject.semester === parseInt(semester, 10)
    );

    res.json(filteredSubjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects: ' + error.message });
  }
};

module.exports = { getUserSubjects };
