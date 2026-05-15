const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../database");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Minden mező kitöltése kötelező." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "A jelszónak legalább 6 karakter hosszúnak kell lennie." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name.trim(), email.trim().toLowerCase(), hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes("UNIQUE")) {
                        return res.status(400).json({ message: "Ez az email cím már regisztrálva van." });
                    }

                    return res.status(500).json({ message: "Hiba történt a regisztráció során." });
                }

                res.status(201).json({ message: "Sikeres regisztráció." });
            }
        );
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba történt." });
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email és jelszó megadása kötelező." });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email.trim().toLowerCase()],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Adatbázis hiba történt." });
            }

            if (!user) {
                return res.status(401).json({ message: "Hibás email vagy jelszó." });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: "Hibás email vagy jelszó." });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            res.json({ message: "Sikeres bejelentkezés.", user: req.session.user });
        }
    );
});

router.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email cím megadása kötelező." });
    }

    db.get(
        "SELECT id FROM users WHERE email = ?",
        [email.trim().toLowerCase()],
        (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Adatbázis hiba történt." });
            }

            if (!user) {
                return res.json({
                    message: "Ha a megadott emailhez fiók tartozik, elkészült a jelszó-visszaállító link."
                });
            }

            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();

            db.run(
                "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
                [user.id, token, expiresAt],
                function (insertErr) {
                    if (insertErr) {
                        return res.status(500).json({ message: "Nem sikerült létrehozni a visszaállító linket." });
                    }

                    res.json({
                        message: "Ha a megadott emailhez fiók tartozik, elkészült a jelszó-visszaállító link.",
                        resetLink: `/reset-password.html?token=${token}`
                    });
                }
            );
        }
    );
});

router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: "Token és új jelszó megadása kötelező." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Az új jelszónak legalább 6 karakter hosszúnak kell lennie." });
    }

    db.get(
        "SELECT * FROM password_resets WHERE token = ? AND used = 0",
        [token],
        async (err, reset) => {
            if (err) {
                return res.status(500).json({ message: "Adatbázis hiba történt." });
            }

            if (!reset) {
                return res.status(400).json({ message: "Érvénytelen vagy már felhasznált visszaállító link." });
            }

            if (new Date(reset.expires_at) < new Date()) {
                return res.status(400).json({ message: "A visszaállító link lejárt. Kérj újat." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashedPassword, reset.user_id],
                function (updateErr) {
                    if (updateErr) {
                        return res.status(500).json({ message: "Nem sikerült frissíteni a jelszót." });
                    }

                    db.run(
                        "UPDATE password_resets SET used = 1 WHERE id = ?",
                        [reset.id],
                        () => res.json({ message: "A jelszó sikeresen módosítva." })
                    );
                }
            );
        }
    );
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Nem sikerült kijelentkezni." });
        }

        res.clearCookie("connect.sid");
        res.json({ message: "Sikeres kijelentkezés." });
    });
});

router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Nincs bejelentkezett felhasználó." });
    }

    db.get(
        "SELECT id, name, email, avatar, bio, quote, created_at FROM users WHERE id = ?",
        [req.session.user.id],
        (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Nem sikerült lekérni a felhasználói adatokat." });
            }

            if (!user) {
                return res.status(404).json({ message: "A felhasználó nem található." });
            }

            req.session.user.name = user.name;
            req.session.user.email = user.email;

            res.json({ user });
        }
    );
});

router.put("/profile", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "A művelethez bejelentkezés szükséges." });
    }

    const { name, avatar, bio, quote } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "A név megadása kötelező." });
    }

    db.run(
        "UPDATE users SET name = ?, avatar = ?, bio = ?, quote = ? WHERE id = ?",
        [name.trim(), avatar || null, bio || "", quote || "", req.session.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Nem sikerült frissíteni a profilt." });
            }

            req.session.user.name = name.trim();
            res.json({ message: "Profil frissítve." });
        }
    );
});

module.exports = router;
