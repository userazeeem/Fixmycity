
const db = require("../config/db");

// CREATE COMPLAINT
const createComplaint = (req, res) => {
    const { title, category, description, address } = req.body;

    if (!title || !category || !description || !address) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields"
        });
    }

    // Get uploaded image path
    const imageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : null;

    const sql = `
        INSERT INTO complaints
        (title, category, description, image_url, address)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, category, description, imageUrl, address],
        (err, result) => {
            if (err) {
                console.error("Complaint creation failed:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to submit complaint"
                });
            }

            res.status(201).json({
                success: true,
                message: "Complaint submitted successfully!",
                complaintId: result.insertId,
                imageUrl: imageUrl
            });
        }
    );
};

// GET ALL COMPLAINTS
const getAllComplaints = (req, res) => {
    const sql = `
        SELECT *
        FROM complaints
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Fetching complaints failed:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch complaints"
            });
        }

        res.status(200).json({
            success: true,
            complaints: results
        });
    });
};

module.exports = {
    createComplaint,
    getAllComplaints
};
