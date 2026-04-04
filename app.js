const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('./')); // Serves your HTML files

// ─── IN-MEMORY DATABASE ──────────────────────────────────────────────────
// This object acts as your database. It will reset when the server stops.
const db = {
    users: [] 
};

// ─── SIGNUP ROUTE ────────────────────────────────────────────────────────
app.post('/register', (req, res) => {
    const { username, password, role, email, name } = req.body;

    // Check if user already exists
    const userExists = db.users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ error: "Signup failed. User already exists." });
    }

    // Save to memory
    const newUser = { username, password, role, email, name };
    db.users.push(newUser);

    console.log(`👤 New User Registered: ${username}`);
    res.json({ message: "Account created successfully (In-Memory)!" });
});

// ─── LOGIN ROUTE ─────────────────────────────────────────────────────────
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    const user = db.users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role
    );

    if (user) {
        res.json({ 
            message: "Login successful!", 
            token: "mock-jwt-token",
            role: user.role // Send the role back to the frontend
        });
    } else {
        res.status(401).json({ error: "Invalid credentials or role selected." });
    }
});;

app.listen(PORT, () => {
    console.log(`🚀 In-Memory Server running at http://localhost:${PORT}`);
    console.log(`⚠️  Warning: Data will be cleared every time you restart this terminal.`);
});