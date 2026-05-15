const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const dbPath = path.join(__dirname, "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Adatbázis hiba:", err.message);
    } else {
        console.log("SQLite adatbázis csatlakoztatva.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            avatar TEXT,
            bio TEXT,
            quote TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);


    db.run("ALTER TABLE users ADD COLUMN bio TEXT", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.log("Bio mező ellenőrzése:", err.message);
        }
    });

    db.run("ALTER TABLE users ADD COLUMN quote TEXT", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.log("Idézet mező ellenőrzése:", err.message);
        }
    });

    db.run("ALTER TABLE users ADD COLUMN avatar TEXT", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.log("Avatar mező ellenőrzése:", err.message);
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            used INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
});

// Előre létrehozott teszt felhasználó a beadandó gyors kipróbálásához.
// Belépés: test@gmail.com / Test123
async function createTestUser() {
    const testEmail = "test@gmail.com";
    const testAvatar = "/images/test-profile.jpg";
    const hashedPassword = await bcrypt.hash("Test123", 10);

    db.get("SELECT id FROM users WHERE email = ?", [testEmail], (err, user) => {
        if (err) {
            return console.log("Teszt felhasználó ellenőrzési hiba:", err.message);
        }

        if (user) {
            db.run(
                "UPDATE users SET name = ?, avatar = ?, bio = ?, quote = ? WHERE id = ?",
                ["Huszti Szilvia", testAvatar, "", "", user.id]
            );

            db.get("SELECT COUNT(*) AS count FROM entries WHERE user_id = ?", [user.id], (countErr, row) => {
                if (!countErr && row.count === 0) {
                    createTestEntries(user.id);
                }
            });

            return;
        }

        db.run(
            "INSERT INTO users (name, email, password, avatar, bio, quote) VALUES (?, ?, ?, ?, ?, ?)",
            ["Huszti Szilvia", testEmail, hashedPassword, testAvatar, "", ""],
            function (insertErr) {
                if (insertErr) {
                    return console.log("Teszt felhasználó létrehozási hiba:", insertErr.message);
                }

                createTestEntries(this.lastID);
            }
        );
    });
}

function createTestEntries(userId) {
    const entries = [
        {
            title: "Mai gondolatok",
            content: "<h2>Ma egy szép nap volt</h2><p>Néha jó megállni egy pillanatra, és leírni, ami bennünk van. Ez segít rendszerezni a káoszt.</p><img src='/images/sunflower.jpg' alt='Napraforgó'><blockquote>A leírt gondolat sokkal könnyebben visszakereshető.</blockquote>"
        },
        {
            title: "Hétvégi kirándulás",
            content: "<p>Friss levegő, utazás és egy kis nyugalom. Jó néha kiszakadni a hétköznapokból.</p><img src='/images/car-travel.jpg' alt='Utazás autóval'>"
        },
        {
            title: "Könyvajánló",
            content: "<p><b>Sapiens – Yuval Noah Harari</b></p><p>Nagyon inspiráló könyv az emberiség történetéről.</p><img src='/images/sapiens.png' alt='Sapiens könyvborító'>"
        },
        {
            title: "Ötletek",
            content: "<ul><li>Egy saját webprojekt</li><li>Letisztult online napló</li><li>Jobb keresés a jegyzetek között</li></ul><img src='/images/plants.jpg' alt='Zöld növények'>"
        }
    ];

    entries.forEach((entry) => {
        db.run(
            "INSERT INTO entries (user_id, title, content) VALUES (?, ?, ?)",
            [userId, entry.title, entry.content]
        );
    });
}

setTimeout(() => {
    createTestUser().catch((err) => console.log("Teszt felhasználó hiba:", err.message));
}, 300);

module.exports = db;
