# GondolatTér

A GondolatTér egy online napló webalkalmazás, amelyben a felhasználók saját bejegyzéseket hozhatnak létre, szerkeszthetnek és kereshetnek a korábbi gondolataik között.

## Használt technológiák

- Node.js
- Express.js
- SQLite
- HTML
- CSS
- JavaScript
- bcrypt
- express-session
- Jest

---

# Funkciók

- regisztráció
- bejelentkezés
- kijelentkezés
- elfelejtett jelszó funkció
- jelszó-visszaállítás
- új bejegyzés létrehozása
- bejegyzések listázása
- szerkesztés
- törlés
- keresés címben és tartalomban
- rich text editor
- kép beszúrása
- profil oldal
- responsive design

---

# Teszt felhasználó

| Adat | Érték |
|---|---|
| Email | test@gmail.com |
| Jelszó | Test123 |

---

# Projekt futtatása

## Szükséges programok

- Node.js
- npm
- Visual Studio Code

---

# Indítás

## 1. Projekt megnyitása

Nyisd meg a projekt mappáját Visual Studio Code-ban.

## 2. Terminal megnyitása

VS Code felső menü:

Terminal → New Terminal

## 3. Függőségek telepítése

```bash
npm install
```

## 4. Projekt indítása

```bash
npm start
```

## 5. Böngésző megnyitása

```text
http://localhost:3000
```

---

# Tesztek futtatása

```bash
npm test
```

---

# Adatbázis

A projekt SQLite adatbázist használ.

Az adatbázis automatikusan létrejön első indításkor.

A táblák létrehozásához külön `database.sql` fájl tartozik a projekthez.