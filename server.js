const express = require("express");
const session = require("express-session");
const path = require("path");

require("./database");

const authRoutes = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "12mb" }));

app.use(session({
    secret: "gondolatter-session-kulcs",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", authRoutes);
app.use("/api/entries", entryRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`GondolatTér fut: http://localhost:${PORT}`);
    });
}

module.exports = app;
