const forgotForm = document.getElementById("forgotForm");
const resetForm = document.getElementById("resetForm");
const message = document.getElementById("message");
const resetLinkBox = document.getElementById("resetLinkBox");

function showMessage(text, success = false) {
    message.textContent = text;
    message.className = success ? "message success" : "message";
}

if (forgotForm) {
    forgotForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        resetLinkBox.innerHTML = "";

        try {
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                return showMessage(data.message);
            }

            showMessage(data.message, true);

            if (data.resetLink) {
                resetLinkBox.innerHTML = `
                    <p>Demo visszaállító link:</p>
                    <a href="${data.resetLink}">${window.location.origin}${data.resetLink}</a>
                `;
            }
        } catch (error) {
            showMessage("Nem sikerült kapcsolódni a szerverhez.");
        }
    });
}

if (resetForm) {
    resetForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const token = new URLSearchParams(window.location.search).get("token");
        const password = document.getElementById("password").value;
        const passwordAgain = document.getElementById("passwordAgain").value;

        if (!token) {
            return showMessage("Hiányzó vagy érvénytelen visszaállító link.");
        }

        if (password !== passwordAgain) {
            return showMessage("A két jelszó nem egyezik.");
        }

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (!response.ok) {
                return showMessage(data.message);
            }

            showMessage("Jelszó módosítva.", true);

            setTimeout(() => {
                window.location.href = "login.html";
            }, 900);
        } catch (error) {
            showMessage("Nem sikerült kapcsolódni a szerverhez.");
        }
    });
}
