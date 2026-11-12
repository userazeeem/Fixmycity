
const express = require("express");
const router = express.Router();

const {
    createComplaint,
    getAllComplaints
} = require("../controllers/complaintController");

const upload = require("../config/upload");

// POST - Create complaint with optional image
router.post("/", upload.single("image"), createComplaint);

// GET - Fetch all complaints
router.get("/", getAllComplaints);

module.exports = router;
