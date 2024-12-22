const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
});

module.exports = mongoose.model('Test', TestSchema);
