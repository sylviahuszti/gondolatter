const userName = document.getElementById("userName");
const dashboardAvatar = document.getElementById("dashboardAvatar");
const logoutBtn = document.getElementById("logoutBtn");

async function loadUser() {
    try {
        const response = await fetch("/api/me");

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        const user = data.user;

        if (userName) userName.textContent = user.name;

        if (dashboardAvatar) {
            if (user.avatar) {
                dashboardAvatar.innerHTML = `<img src="${user.avatar}" alt="Profilkép">`;
            } else {
                dashboardAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : "G";
            }
        }
    } catch (error) {
        console.log("Felhasználói adatok nem tölthetők be.");
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "index.html";
    });
}

loadUser();
