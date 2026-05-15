# GondolatTér

A GondolatTér egy egyszerű online napló webalkalmazás, amelyet egyetemi projektként készítettem.  
A felhasználó regisztrálhat, bejelentkezhet, saját bejegyzéseket hozhat létre, kereshet, szerkeszthet és törölhet.

## Használt technológiák

- Node.js
- Express.js
- SQLite
- HTML
- CSS
- JavaScript
- bcrypt
- express-session

## Funkciók

- regisztráció
- bejelentkezés
- kijelentkezés
- elfelejtett jelszó
- jelszó-visszaállítás
- új bejegyzés létrehozása
- szerkesztés és törlés
- keresés címben és tartalomban
- rich text szerkesztő
- kép beszúrása
- profil oldal és profilkép
- reszponzív mobilos design

## Projekt struktúra

- middleware/ – köztes rétegek
- routes/ – API útvonalak
- tests/ – tesztfájlok
- public/ – frontend fájlok
- database.js – SQLite kapcsolat
- database.sql – adatbázis séma
- database.db – SQLite adatbázis
- server.js – szerver indítása
- package.json – projekt beállítások és csomagok

## Futtatás

A projekt mappájában:

npm install  
npm start

Böngészőben:

http://localhost:3000

## Render link

https://gondolatter.onrender.com/

## Megjegyzés

A projekt demo módban működik, ezért valódi email küldés nincs bekötve.  
A jelszó-visszaállító link az oldalon jelenik meg.

## Teszt felhasználó

- Email: test@gmail.com
- Jelszó: Test123

## Reszponzív design

Az alkalmazás desktop és mobil nézetre is optimalizálva lett modern responsive megoldásokkal.

