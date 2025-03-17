const Council = require("../models/Council");

// @desc Get all council members
const getCouncilMembers = async (req, res) => {
  try {
    const members = await Council.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Add a new council member
const addCouncilMember = async (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMember = new Council({ name, role });
    await newMember.save();
    res.status(201).json({ message: "Council member added", member: newMember });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
};

// @desc Update a council member
const updateCouncilMember = async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  try {
    const updatedMember = await Council.findByIdAndUpdate(
      id,
      { name, role },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Council member not found" });
    }

    res.status(200).json({ message: "Council member updated", member: updatedMember });
  } catch (error) {
    res.status(500).json({ message: "Error updating member", error: error.message });
  }
};

// @desc Delete a council member
const deleteCouncilMember = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMember = await Council.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Council member not found" });
    }

    res.status(200).json({ message: "Council member deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member", error: error.message });
  }
};

module.exports = {
  getCouncilMembers,
  addCouncilMember,
  updateCouncilMember,
  deleteCouncilMember,
};