const entriesContainer = document.getElementById("entriesContainer");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const dashboardAvatar = document.getElementById("dashboardAvatar");

function showMessage(text, success = false) {
    message.textContent = text;
    message.className = success ? "message success" : "message";
}

async function checkLogin() {
    const response = await fetch("/api/me");

    if (!response.ok) {
        window.location.href = "login.html";
        return;
    }

    const data = await response.json();
    userName.textContent = data.user.name;

    if (dashboardAvatar) {
        if (data.user.avatar) {
            dashboardAvatar.innerHTML = `<img src="${data.user.avatar}" alt="Profilkép">`;
        } else {
            dashboardAvatar.textContent = data.user.name ? data.user.name.charAt(0).toUpperCase() : "G";
        }
    }
}

function formatDate(dateText) {
    return new Date(dateText).toLocaleString("hu-HU");
}


function getCategory(title, content) {
    const text = `${title} ${content}`.toLowerCase();

    if (text.includes("utaz") || text.includes("kirándul") || text.includes("tenger")) return "Utazás";
    if (text.includes("könyv") || text.includes("sapiens")) return "Könyv";
    if (text.includes("ötlet") || text.includes("webprojekt")) return "Ötlet";
    if (text.includes("nap") || text.includes("gondolat")) return "Gondolat";

    return "Napló";
}

function highlightText(html, search) {
    if (!search) return html;

    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${safeSearch})`, "gi");

    return html.replace(regex, "<mark>$1</mark>");
}


function cleanPreview(html) {
    const div = document.createElement("div");
    div.innerHTML = html;

    div.querySelectorAll("script, iframe, object, embed").forEach((tag) => tag.remove());

    div.querySelectorAll("*").forEach((element) => {
        [...element.attributes].forEach((attr) => {
            if (attr.name.startsWith("on")) {
                element.removeAttribute(attr.name);
            }
        });
    });

    return div.innerHTML;
}

async function loadEntries() {
    const search = searchInput.value.trim();
    const sort = sortSelect.value;

    try {
        const response = await fetch(`/api/entries?search=${encodeURIComponent(search)}&sort=${encodeURIComponent(sort)}`);

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const entries = await response.json();
        entriesContainer.innerHTML = "";

        if (entries.length === 0) {
            entriesContainer.innerHTML = `
                <div class="empty-state polished-empty">
                    <div class="empty-icon">✦</div>
                    <h2>${search ? "Nincs találat" : "Még nincs bejegyzésed"}</h2>
                    <p>${search ? "Próbálj más keresési szót." : "Kezdd el az első naplóbejegyzésedet, és gyűjtsd egy helyre a gondolataidat."}</p>
                    <a href="entry.html" class="btn btn-primary">Első bejegyzés létrehozása</a>
                </div>
            `;
            return;
        }

        entries.forEach((entry) => {
            const card = document.createElement("article");
            card.className = "entry-card";

            const category = getCategory(entry.title, entry.content);
            const safeContent = highlightText(cleanPreview(entry.content), search);
            const safeTitle = highlightText(entry.title, search);

            card.innerHTML = `
                <div class="entry-topline">
                    <span class="entry-badge">${category}</span>
                </div>
                <h2>${safeTitle}</h2>
                <div class="entry-date">Létrehozva: ${formatDate(entry.created_at)}</div>
                <div class="entry-content formatted-preview">${safeContent}</div>
                <div class="card-actions">
                    <a class="icon-btn edit-btn" title="Szerkesztés" href="entry.html?id=${entry.id}">Szerkesztés</a>
                    <button class="icon-btn delete-btn" title="Törlés" onclick="deleteEntry(${entry.id})">Törlés</button>
                </div>
            `;

            entriesContainer.appendChild(card);
        });
    } catch (error) {
        showMessage("Nem sikerült betölteni a bejegyzéseket.");
    }
}

async function deleteEntry(id) {
    if (!confirm("Biztosan törölni szeretnéd ezt a bejegyzést?")) {
        return;
    }

    const response = await fetch(`/api/entries/${id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
        return showMessage(data.message);
    }

    showMessage("Bejegyzés törölve.", true); showToast("Bejegyzés törölve");
    loadEntries();
}

let searchTimer;

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadEntries, 300);
});

sortSelect.addEventListener("change", loadEntries);

logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "index.html";
});

checkLogin().then(loadEntries);
