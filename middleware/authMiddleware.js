function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: "A művelethez bejelentkezés szükséges." });
    }

    next();
}

module.exports = requireLogin;
