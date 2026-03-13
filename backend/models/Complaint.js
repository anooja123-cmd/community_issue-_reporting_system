const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    wardNumber: { type: String, required: true },
    streetArea: { type: String, required: true },
    landmark: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // stored file path
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Reported as Fake"],
      default: "Pending",
    },
    reportedAsFakeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
    },
    fakeReason: {
      type: String,
      default: "",
    },
    fakeReportedAt: {
      type: Date,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
