const express = require("express");
const jwt = require("jsonwebtoken");
const Authority = require("../models/Staff");
const User = require("../models/Citizen");
const Complaint = require("../models/Complaint");

const router = express.Router();


// ================= ADMIN LOGIN =================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Admin login successful",
      token,
    });
  } else {
    return res.status(401).json({
      message: "Invalid admin credentials",
    });
  }
});


// =================================================
//                CITIZEN MANAGEMENT
// =================================================

// ================= GET SINGLE CITIZEN =================
router.get("/citizen/:id", async (req, res) => {
  try {
    const citizen = await User.findById(req.params.id).select("-password");

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.json(citizen);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET PENDING CITIZENS =================
router.get("/pending-citizens", async (req, res) => {
  try {
    // status is stored in lowercase in the User model
    const citizens = await User.find({ status: "pending" });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET APPROVED CITIZENS =================
router.get("/approved-citizens", async (req, res) => {
  try {
    const citizens = await User.find({ status: "approved" });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET REJECTED CITIZENS =================
router.get("/rejected-citizens", async (req, res) => {
  try {
    const citizens = await User.find({ status: "rejected" });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= APPROVE CITIZEN =================
router.put("/approve-citizen/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({ message: "Citizen approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= REJECT CITIZEN =================
router.put("/reject-citizen/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

    res.json({ message: "Citizen rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// =================================================
//                STAFF MANAGEMENT
// =================================================

// ================= GET SINGLE STAFF =================
router.get("/authority/:id", async (req, res) => {
  try {
    const authority = await Authority.findById(req.params.id).select("-password");

    if (!authority) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(authority);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET PENDING STAFF =================
router.get("/pending-authorities", async (req, res) => {
  try {
    const authorities = await Authority.find({ status: "pending" });
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET APPROVED STAFF =================
router.get("/approved-authorities", async (req, res) => {
  try {
    const authorities = await Authority.find({ status: "approved" });
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET REJECTED STAFF =================
router.get("/rejected-authorities", async (req, res) => {
  try {
    const authorities = await Authority.find({ status: "rejected" });
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= APPROVE STAFF =================
router.put("/approve-authority/:id", async (req, res) => {
  try {
    await Authority.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({ message: "Staff approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= REJECT STAFF =================
router.put("/reject-authority/:id", async (req, res) => {
  try {
    await Authority.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

    res.json({ message: "Staff rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// =================================================
//           FAKE COMPLAINTS (ADMIN)
// =================================================

// ================= GET FAKE COMPLAINTS =================
router.get("/fake-complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: "Reported as Fake" })
      .populate("citizenId", "name email")
      .populate("reportedAsFakeBy", "name email department")
      .sort({ updatedAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DEACTIVATE CITIZEN =================
router.put("/deactivate-citizen/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.json({ message: "Citizen deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
