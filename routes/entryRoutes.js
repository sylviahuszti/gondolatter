const express = require("express");
const db = require("../database");
const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireLogin);

function cleanHtml(html) {
    if (!html) {
        return "";
    }

    let cleaned = html;

    cleaned = cleaned.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    cleaned = cleaned.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
    cleaned = cleaned.replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "");
    cleaned = cleaned.replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "");
    cleaned = cleaned.replace(/\son\w+="[^"]*"/gi, "");
    cleaned = cleaned.replace(/\son\w+='[^']*'/gi, "");
    cleaned = cleaned.replace(/javascript:/gi, "");

    return cleaned;
}

router.get("/", (req, res) => {
    const userId = req.session.user.id;
    const search = req.query.search;
    const sort = req.query.sort === "oldest" ? "ASC" : "DESC";

    let sql = "SELECT * FROM entries WHERE user_id = ?";
    let params = [userId];

    if (search && search.trim() !== "") {
        sql += " AND (title LIKE ? OR content LIKE ?)";
        params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    sql += ` ORDER BY created_at ${sort}, id ${sort}`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Nem sikerült lekérni a bejegyzéseket." });
        }

        res.json(rows);
    });
});


router.get("/stats/summary", (req, res) => {
    const userId = req.session.user.id;

    db.get(
        "SELECT COUNT(*) AS count, MAX(updated_at) AS lastActivity FROM entries WHERE user_id = ?",
        [userId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Nem sikerült lekérni a statisztikát." });
            }

            res.json({
                count: row.count || 0,
                lastActivity: row.lastActivity || null
            });
        }
    );
});


router.get("/:id", (req, res) => {
    const userId = req.session.user.id;
    const entryId = req.params.id;

    db.get(
        "SELECT * FROM entries WHERE id = ? AND user_id = ?",
        [entryId, userId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Adatbázis hiba történt." });
            }

            if (!row) {
                return res.status(404).json({ message: "A bejegyzés nem található." });
            }

            res.json(row);
        }
    );
});

router.post("/", (req, res) => {
    const userId = req.session.user.id;
    const { title, content } = req.body;
    const safeContent = cleanHtml(content);

    if (!title || !safeContent || title.trim() === "" || safeContent.trim() === "") {
        return res.status(400).json({ message: "A cím és a tartalom kitöltése kötelező." });
    }

    db.run(
        "INSERT INTO entries (user_id, title, content) VALUES (?, ?, ?)",
        [userId, title.trim(), safeContent],
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Nem sikerült menteni a bejegyzést." });
            }

            res.status(201).json({ message: "Bejegyzés létrehozva.", id: this.lastID });
        }
    );
});

router.put("/:id", (req, res) => {
    const userId = req.session.user.id;
    const entryId = req.params.id;
    const { title, content } = req.body;
    const safeContent = cleanHtml(content);

    if (!title || !safeContent || title.trim() === "" || safeContent.trim() === "") {
        return res.status(400).json({ message: "A cím és a tartalom kitöltése kötelező." });
    }

    db.run(
        `
        UPDATE entries
        SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
        `,
        [title.trim(), safeContent, entryId, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Nem sikerült frissíteni a bejegyzést." });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: "A bejegyzés nem található vagy nem módosítható." });
            }

            res.json({ message: "Bejegyzés frissítve." });
        }
    );
});

router.delete("/:id", (req, res) => {
    const userId = req.session.user.id;
    const entryId = req.params.id;

    db.run(
        "DELETE FROM entries WHERE id = ? AND user_id = ?",
        [entryId, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Nem sikerült törölni a bejegyzést." });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: "A bejegyzés nem található vagy nem törölhető." });
            }

            res.json({ message: "Bejegyzés törölve." });
        }
    );
});

module.exports = router;
