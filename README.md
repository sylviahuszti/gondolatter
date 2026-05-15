# GondolatTér

A GondolatTér egy egyszerű online napló webalkalmazás. A felhasználó regisztrálhat, bejelentkezhet, saját bejegyzéseket készíthet, kereshet, szerkeszthet és törölhet.

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
- bejegyzések listázása
- keresés címben és tartalomban
- szerkesztés
- törlés
- rich text szerkesztő
- kép beszúrása

## Futtatás

A projekt mappájában:

```bash
npm install
npm start
```

Böngészőben:

```text
http://localhost:3000
```

## Megjegyzés az elfelejtett jelszóhoz

A projekt demo módban működik, ezért valódi email küldés nincs bekötve. A visszaállító link az oldalon jelenik meg.

## Stock fotók

A felület néhány előnézeti és minta képet Unsplash és Pexels online képlinkekkel jelenít meg.

## Képek

A képek a `public/images` mappában vannak, így a weboldal nem külső képlinkekre támaszkodik.

## Dashboard

A dashboard menü csak működő, tényleges oldalakra mutató elemeket tartalmaz. A keresés a keresőmezőben működik, a rendezés pedig a Legújabb/Legrégebbi választóval állítható.

## Profil oldal

A felhasználó a nevére kattintva megnyithatja a profil oldalát, ahol megtekintheti az adatait, módosíthatja a nevét és feltölthet profilképet.


## Teszt felhasználó

A projekt első indításkor automatikusan létrehoz egy teszt felhasználót:

- Email: test@gmail.com
- Jelszó: Test123
- Név: Huszti Szilvia

Ehhez a teszt profilhoz tartoznak a minta bejegyzések.  
Új regisztrált felhasználó esetén a napló üresen indul.

## Főoldal bejelentkezett állapot

Ha a felhasználó be van jelentkezve és visszalép a főoldalra, a rendszer nem jelentkezteti ki. A navigációban megjelenik a Naplóm gomb és a profil link.

## Inspiráció oldal

Az Inspiráció oldal külön, kártyás bejegyzéseket tartalmaz a feltöltött stock fotókkal.


## Finomított funkciók

- Szebb üres dashboard állapot új felhasználóknál
- Toast értesítések mentés, törlés és profilfrissítés után
- Loading állapot a belépési és regisztrációs gombokon
- Bejegyzés kategória badge-ek
- Keresési találatok kiemelése
- Profil extra adatok: bemutatkozás és kedvenc idézet
- Profil statisztika: bejegyzések száma és utolsó aktivitás
- Finom hover animációk az inspirációs kártyákon
- Reszponzívabb mobilos dashboard elrendezés
- Sticky rich text editor toolbar

## Editor frissítés

A rich text editorban a szöveg színe mellett a kijelölt szöveg háttérszíne is módosítható.
