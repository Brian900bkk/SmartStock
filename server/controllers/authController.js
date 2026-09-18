const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const db = require("../config/db");

// =====================================================
// EMAIL CONFIGURATION
// =====================================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
});

// =====================================================
// GENERATE VERIFICATION CODE
// =====================================================

const generateVerificationCode = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {

    const {
        full_name,
        email,
        phone,
        password,
        role
    } = req.body;

    // ---------------------------------------------
    // Validate fields
    // ---------------------------------------------

    if (
        !full_name ||
        !email ||
        !phone ||
        !password ||
        !role
    ) {
        return res.status(400).json({
            message: "Please fill in all required fields."
        });
    }

    // ---------------------------------------------
    // Validate password
    // ---------------------------------------------

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters."
        });
    }

    // ---------------------------------------------
    // Validate role
    // ---------------------------------------------

    const allowedRoles = [
        "admin",
        "manager",
        "cashier"
    ];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role selected."
        });
    }

    try {

        // -----------------------------------------
        // Check if email already exists
        // -----------------------------------------

        const checkSql = `
            SELECT
                id,
                is_verified
            FROM users
            WHERE email = ?
        `;

        db.query(
            checkSql,
            [email],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Database error."
                    });
                }

                // ---------------------------------
                // Existing account
                // ---------------------------------

                if (results.length > 0) {

                    if (
                        results[0].is_verified === 1
                    ) {

                        return res.status(409).json({
                            message:
                                "This email is already registered."
                        });

                    } else {

                        return res.status(409).json({
                            message:
                                "This email is already registered but not verified. Please verify your email."
                        });
                    }
                }

                // ---------------------------------
                // Generate verification details
                // ---------------------------------

                const verificationCode =
                    generateVerificationCode();

                const verificationExpires =
                    new Date(
                        Date.now() +
                        10 * 60 * 1000
                    );

                // ---------------------------------
                // Hash password
                // ---------------------------------

                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );

                // ---------------------------------
                // Insert user
                // ---------------------------------

                const insertSql = `
                    INSERT INTO users
                    (
                        full_name,
                        email,
                        phone,
                        password,
                        role,
                        is_verified,
                        verification_code,
                        verification_expires,
                        verification_method
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        full_name,
                        email,
                        phone,
                        hashedPassword,
                        role,
                        0,
                        verificationCode,
                        verificationExpires,
                        "email"
                    ],

                    async (
                        err,
                        result
                    ) => {

                        if (err) {

                            console.error(
                                "Registration error:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Failed to create account."
                            });
                        }

                        // ---------------------------------
                        // Send verification email
                        // ---------------------------------

                        try {

                            await transporter.sendMail({

                                from:
                                    `"SmartStock" <${process.env.EMAIL_USER}>`,

                                to: email,

                                subject:
                                    "SmartStock Email Verification",

                                html: `
                                    <div style="
                                        font-family: Arial, sans-serif;
                                        max-width: 600px;
                                        margin: auto;
                                        padding: 30px;
                                        background: #f5f7fb;
                                    ">

                                        <div style="
                                            background: white;
                                            padding: 35px;
                                            border-radius: 12px;
                                            text-align: center;
                                            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
                                        ">

                                            <h1 style="
                                                color: #2563eb;
                                                margin-bottom: 10px;
                                            ">
                                                SmartStock
                                            </h1>

                                            <h2>
                                                Verify Your Email
                                            </h2>

                                            <p style="
                                                color: #555;
                                                font-size: 16px;
                                            ">
                                                Hello ${full_name},
                                            </p>

                                            <p style="
                                                color: #555;
                                                font-size: 15px;
                                            ">
                                                Thank you for creating your
                                                SmartStock account.
                                            </p>

                                            <p style="
                                                color: #555;
                                                font-size: 15px;
                                            ">
                                                Your selected account role is:
                                            </p>

                                            <p style="
                                                color: #2563eb;
                                                font-size: 18px;
                                                font-weight: bold;
                                                text-transform: capitalize;
                                            ">
                                                ${role}
                                            </p>

                                            <p style="
                                                color: #555;
                                                font-size: 15px;
                                            ">
                                                Use the verification code below
                                                to verify your email.
                                            </p>

                                            <div style="
                                                margin: 30px 0;
                                                padding: 20px;
                                                background: #eff6ff;
                                                border-radius: 10px;
                                            ">

                                                <div style="
                                                    font-size: 36px;
                                                    font-weight: bold;
                                                    letter-spacing: 8px;
                                                    color: #2563eb;
                                                ">
                                                    ${verificationCode}
                                                </div>

                                            </div>

                                            <p style="
                                                color: #777;
                                                font-size: 14px;
                                            ">
                                                This code expires in
                                                <strong>
                                                    10 minutes
                                                </strong>.
                                            </p>

                                            <p style="
                                                color: #999;
                                                font-size: 12px;
                                                margin-top: 30px;
                                            ">
                                                If you did not create a
                                                SmartStock account, you can
                                                safely ignore this email.
                                            </p>

                                        </div>

                                    </div>
                                `
                            });

                            return res.status(201).json({

                                success: true,

                                message:
                                    "Account created successfully. A verification code has been sent to your email."

                            });

                        } catch (emailError) {

                            console.error(
                                "Email sending error:",
                                emailError
                            );

                            // ---------------------------------
                            // Remove account if email fails
                            // ---------------------------------

                            db.query(
                                "DELETE FROM users WHERE id = ?",
                                [result.insertId],

                                (deleteErr) => {

                                    if (deleteErr) {

                                        console.error(
                                            "Failed to remove user after email error:",
                                            deleteErr
                                        );

                                    }
                                }
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Account could not be created because the verification email could not be sent."

                            });
                        }
                    }
                );
            }
        );

    } catch (error) {

        console.error(
            "Server error:",
            error
        );

        return res.status(500).json({
            message: "Server error."
        });
    }
};

// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = (req, res) => {

    const {
        email,
        verificationCode
    } = req.body;

    if (
        !email ||
        !verificationCode
    ) {

        return res.status(400).json({
            message:
                "Email and verification code are required."
        });
    }

    const sql = `
        SELECT
            id,
            is_verified,
            verification_code,
            verification_expires
        FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        (err, results) => {

            if (err) {

                console.error(
                    "Verification database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    message:
                        "Account not found."
                });
            }

            const user = results[0];

            if (
                user.is_verified === 1
            ) {

                return res.status(400).json({
                    message:
                        "This email is already verified."
                });
            }

            if (
                user.verification_code !==
                verificationCode
            ) {

                return res.status(400).json({
                    message:
                        "Invalid verification code."
                });
            }

            if (
                !user.verification_expires ||
                new Date(
                    user.verification_expires
                ) < new Date()
            ) {

                return res.status(400).json({

                    message:
                        "Verification code has expired. Please request a new code."

                });
            }

            const updateSql = `
                UPDATE users
                SET
                    is_verified = 1,
                    verification_code = NULL,
                    verification_expires = NULL
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [user.id],
                (err) => {

                    if (err) {

                        console.error(
                            "Verification update error:",
                            err
                        );

                        return res.status(500).json({

                            message:
                                "Failed to verify account."

                        });
                    }

                    return res.status(200).json({

                        success: true,

                        message:
                            "Email verified successfully. You can now login."

                    });
                }
            );
        }
    );
};

// =====================================================
// LOGIN
// =====================================================

const login = (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (
        !email ||
        !password
    ) {

        return res.status(400).json({

            message:
                "Email and password are required."

        });
    }

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        async (err, results) => {

            if (err) {

                console.error(
                    "Login database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length === 0) {

                return res.status(401).json({

                    message:
                        "Invalid email or password."

                });
            }

            const user = results[0];

            // ---------------------------------
            // Check verification
            // ---------------------------------

            if (
                user.is_verified !== 1
            ) {

                return res.status(403).json({

                    message:
                        "Please verify your email before logging in."

                });
            }

            // ---------------------------------
            // Check password
            // ---------------------------------

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {

                return res.status(401).json({

                    message:
                        "Invalid email or password."

                });
            }

            // ---------------------------------
            // Generate JWT
            // ---------------------------------

            const token =
                jwt.sign(

                    {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn: "1d"
                    }
                );

            // ---------------------------------
            // Login response
            // ---------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Login successful.",

                token,

                user: {

                    id: user.id,

                    full_name:
                        user.full_name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    role:
                        user.role

                }
            });
        }
    );
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    register,
    verifyEmail,
    login
};