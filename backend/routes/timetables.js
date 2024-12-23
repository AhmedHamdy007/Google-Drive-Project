const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// Fetch timetable entries for a specific user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const timetable = await req.app.locals.db
    .collection("timetables")
    .find({ userId })
    .toArray();
  res.json(timetable);
});

// Add a new timetable entry
router.post("/", async (req, res) => {
  const newEntry = req.body;
  await req.app.locals.db.collection("timetables").insertOne(newEntry);
  res.status(201).send("Timetable entry added successfully.");
});

// Delete a timetable entry
router.delete("/:entryId", async (req, res) => {
  const entryId = req.params.entryId;
  await req.app.locals.db
    .collection("timetables")
    .deleteOne({ _id: ObjectId(entryId) });
  res.status(200).send("Timetable entry deleted successfully.");
});

module.exports = router;
