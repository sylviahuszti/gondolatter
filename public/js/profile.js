const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const createdAt = document.getElementById("createdAt");
const profileBio = document.getElementById("profileBio");
const profileQuote = document.getElementById("profileQuote");
const entryCount = document.getElementById("entryCount");
const lastActivity = document.getElementById("lastActivity");
const profileAvatar = document.getElementById("profileAvatar");
const avatarInput = document.getElementById("avatarInput");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let avatarValue = "";

function showMessage(text, success = false) {
    message.textContent = text;
    message.className = success ? "message success" : "message";
}

async function loadStats() {
    try {
        const response = await fetch("/api/entries/stats/summary");
        if (!response.ok) return;

        const data = await response.json();

        if (entryCount) entryCount.textContent = data.count;
        if (lastActivity) {
            lastActivity.textContent = data.lastActivity
                ? new Date(data.lastActivity).toLocaleDateString("hu-HU")
                : "-";
        }
    } catch (error) {
        console.log("Statisztika nem tölthető be.");
    }
}

function setAvatar(user) {
    if (user.avatar) {
        profileAvatar.innerHTML = `<img src="${user.avatar}" alt="Profilkép">`;
        avatarValue = user.avatar;
    } else {
        profileAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : "G";
    }
}

async function loadProfile() {
    const response = await fetch("/api/me");

    if (!response.ok) {
        window.location.href = "login.html";
        return;
    }

    const data = await response.json();
    const user = data.user;

    profileName.value = user.name || "";
    profileEmail.value = user.email || "";
    createdAt.value = user.created_at ? new Date(user.created_at).toLocaleString("hu-HU") : "";
    if (profileBio) profileBio.value = user.bio || "";
    if (profileQuote) profileQuote.value = user.quote || "";
    setAvatar(user);
    loadStats();
}

avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];

    if (!file || !file.type.startsWith("image/")) {
        return showMessage("Csak képfájlt lehet feltölteni.");
    }

    const reader = new FileReader();

    reader.onload = () => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxSize = 360;
            const scale = Math.min(1, maxSize / img.width, maxSize / img.height);

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            avatarValue = canvas.toDataURL("image/jpeg", 0.82);
            profileAvatar.innerHTML = `<img src="${avatarValue}" alt="Profilkép">`;
            showMessage("Profilkép kiválasztva. A mentéshez kattints a mentés gombra.", true);
        };

        img.src = reader.result;
    };

    reader.readAsDataURL(file);
});

profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = profileName.value.trim();

    if (!name) {
        return showMessage("A név megadása kötelező.");
    }

    const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            avatar: avatarValue,
            bio: "",
            quote: ""
        })
    });

    const data = await response.json();

    if (!response.ok) {
        return showMessage(data.message);
    }

    showMessage("Profil sikeresen mentve.", true); showToast("Profil mentve");
});

logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "index.html";
});

loadProfile();
