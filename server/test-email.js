require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("Starting Gmail SMTP test...");
console.log("Email:", process.env.EMAIL_USER);
console.log(
    "Password loaded:",
    process.env.EMAIL_PASS ? "YES" : "NO"
);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    requireTLS: true,

    tls: {
        rejectUnauthorized: false
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000
});

console.log("Testing Gmail SMTP connection...");

transporter.verify()
    .then(() => {

        console.log("");
        console.log("=================================");
        console.log("GMAIL CONNECTION SUCCESSFUL");
        console.log("=================================");

        process.exit(0);

    })
    .catch((error) => {

        console.log("");
        console.log("=================================");
        console.log("GMAIL CONNECTION FAILED");
        console.log("=================================");

        console.log("Code:", error.code);
        console.log("Command:", error.command);
        console.log("Message:", error.message);

        process.exit(1);
    });