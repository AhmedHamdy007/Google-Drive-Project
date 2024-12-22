const fetchData = require('../utils/fetchData');

const getLecturerCourses = async (req, res) => {
    const { no_pekerja, sesi, semester } = req.query;

    if (!no_pekerja) {
        return res.status(400).json({ message: 'Missing no_pekerja parameter.' });
    }

    try {
        let coursesUrl = `http://web.fc.utm.my/ttms/web_man_webservice_json.cgi?entity=pensyarah_subjek&no_pekerja=${no_pekerja}`;
        if (sesi) coursesUrl += `&sesi=${sesi}`;
        if (semester) coursesUrl += `&semester=${semester}`;

        const courses = await fetchData(coursesUrl);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lecturer courses: ' + error.message });
    }
};

module.exports = { getLecturerCourses };
