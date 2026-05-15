const loginNav = document.getElementById("loginNav");
const registerNav = document.getElementById("registerNav");
const dashboardNav = document.getElementById("dashboardNav");
const profileNav = document.getElementById("profileNav");
const homeUserName = document.getElementById("homeUserName");
const homeAvatar = document.getElementById("homeAvatar");

async function checkHomeLogin() {
    try {
        const response = await fetch("/api/me");

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        const user = data.user;

        document.body.classList.add("logged-in");

        if (loginNav) loginNav.classList.add("hidden");
        if (registerNav) registerNav.classList.add("hidden");
        if (dashboardNav) dashboardNav.classList.remove("hidden");
        if (profileNav) profileNav.classList.remove("hidden");

        if (homeUserName) {
            homeUserName.textContent = user.name;
        }

        if (homeAvatar && user.avatar) {
            homeAvatar.innerHTML = `<img src="${user.avatar}" alt="Profilkép">`;
        }

    } catch (error) {
        console.log("Bejelentkezési állapot nem ellenőrizhető.");
    }
}

checkHomeLogin();