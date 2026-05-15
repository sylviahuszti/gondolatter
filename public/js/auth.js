const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

function showMessage(text, success = false) {
    message.textContent = text;
    message.className = success ? "message success" : "message";
}

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true, "Regisztráció...");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setButtonLoading(submitBtn, false); return showMessage(data.message);
            }

            showMessage("Sikeres regisztráció.", true); showToast("Sikeres regisztráció");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 700);
        } catch (error) {
            setButtonLoading(submitBtn, false); showMessage("Nem sikerült kapcsolódni a szerverhez.");
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true, "Bejelentkezés...");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setButtonLoading(submitBtn, false); return showMessage(data.message);
            }

            showMessage("Sikeres bejelentkezés.", true); showToast("Sikeres bejelentkezés");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);
        } catch (error) {
            setButtonLoading(submitBtn, false); showMessage("Nem sikerült kapcsolódni a szerverhez.");
        }
    });
}
