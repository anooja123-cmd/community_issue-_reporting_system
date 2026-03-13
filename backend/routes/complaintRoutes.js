const express = require("express");
const Complaint = require("../models/Complaint");
const protect = require("../middleware/authMiddleware");
const protectStaff = require("../middleware/staffAuth");
const protectAny = require("../middleware/authAny");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create complaint (citizen)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      department,
      wardNumber,
      streetArea,
      landmark,
      description,
    } = req.body;

    if (!title || !department || !wardNumber || !streetArea || !landmark || !description) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const complaint = await Complaint.create({
      title,
      department,
      wardNumber,
      streetArea,
      landmark,
      description,
      image: req.file ? req.file.path : "",
      citizenId: req.user._id,
      status: "Pending",
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complaints for logged-in citizen
router.get("/", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizenId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complaints for staff department
router.get("/department/list", protectStaff, async (req, res) => {
  try {
    const complaints = await Complaint.find({ department: req.staff.department })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complaint details (citizen or staff)
router.get("/:id", protectAny, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user && String(complaint.citizenId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.staff && complaint.department !== req.staff.department) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update complaint status (staff/admin)
router.put("/:id/status", protectStaff, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const allowed = ["Pending", "In Progress", "Resolved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.department !== req.staff.department) {
      return res.status(403).json({ message: "Not authorized" });
    }

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Report complaint as fake (staff)
router.put("/:id/report-fake", protectStaff, async (req, res) => {
  try {
    const { reason } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.department !== req.staff.department) {
      return res.status(403).json({ message: "Not authorized" });
    }

    complaint.status = "Reported as Fake";
    complaint.reportedAsFakeBy = req.staff._id;
    complaint.fakeReason = reason || "";
    complaint.fakeReportedAt = new Date();
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
