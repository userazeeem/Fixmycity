
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Validate required fields
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        const cleanName = full_name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 100 characters."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        // Check whether email already exists
        db.query(
            "SELECT id FROM users WHERE email = ?",
            [cleanEmail],
            async (err, results) => {
                if (err) {
                    console.error("Email check failed:", err.message);

                    return res.status(500).json({
                        success: false,
                        message: "Registration failed. Please try again."
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "This email is already registered."
                    });
                }

                try {
                    // Hash password before saving
                    const passwordHash = await bcrypt.hash(password, 12);

                    const sql = `
                        INSERT INTO users
                        (full_name, email, password_hash)
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        sql,
                        [cleanName, cleanEmail, passwordHash],
                        (insertErr, result) => {
                            if (insertErr) {
                                console.error(
                                    "User registration failed:",
                                    insertErr.message
                                );

                                return res.status(500).json({
                                    success: false,
                                    message: "Unable to create your account."
                                });
                            }

                            return res.status(201).json({
                                success: true,
                                message: "Account created successfully!",
                                user: {
                                    id: result.insertId,
                                    full_name: cleanName,
                                    email: cleanEmail
                                }
                            });
                        }
                    );
                } catch (hashError) {
                    console.error("Password hashing failed:", hashError);

                    return res.status(500).json({
                        success: false,
                        message: "Unable to process your registration."
                    });
                }
            }
        );
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};
// LOGIN USER
const loginUser = (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter your email and password."
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    db.query(
        `SELECT id, full_name, email, password_hash
         FROM users WHERE email = ?`,
        [cleanEmail],
        async (err, results) => {
            if (err) {
                console.error("Login database error:", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Login failed. Please try again."
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            const jwt = require("jsonwebtoken");

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful!",
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email
                }
            });
        }
    );
};
module.exports = {
    registerUser,
    loginUser
};
