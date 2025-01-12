const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  access: {
    type: [String], // Array of user types who can access this category
    enum: ["Pelajar FSKSM", "Pensyarah"],
    default: [],
  },
});

const CategorySessionSchema = new mongoose.Schema(
  {
    categories: {
      type: [CategorySchema],
      default: [],
    },
    sessions: {
      type: [String], // Array of sessions
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategorySession", CategorySessionSchema);
