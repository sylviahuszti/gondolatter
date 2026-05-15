const entryForm = document.getElementById("entryForm");
const pageTitle = document.getElementById("pageTitle");
const titleInput = document.getElementById("title");
const contentEditor = document.getElementById("contentEditor");
const message = document.getElementById("message");
const textColor = document.getElementById("textColor");
const bgColor = document.getElementById("bgColor");
const linkBtn = document.getElementById("linkBtn");
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");

const entryId = new URLSearchParams(window.location.search).get("id");

function showMessage(text, success = false) {
    message.textContent = text;
    message.className = success ? "message success" : "message";
}

async function checkLogin() {
    const response = await fetch("/api/me");

    if (!response.ok) {
        window.location.href = "login.html";
    }
}

function focusEditor() {
    contentEditor.focus();
}

document.querySelectorAll(".toolbar button[data-command]").forEach((button) => {
    button.addEventListener("click", () => {
        focusEditor();
        document.execCommand(button.dataset.command, false, button.dataset.value || null);
    });
});

textColor.addEventListener("input", () => {
    focusEditor();
    document.execCommand("foreColor", false, textColor.value);
});

linkBtn.addEventListener("click", () => {
    const url = prompt("Add meg a linket:");

    if (!url) {
        return;
    }

    focusEditor();
    document.execCommand("createLink", false, url);
});

imageBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file || !file.type.startsWith("image/")) {
        return showMessage("Csak képfájlt lehet beszúrni.");
    }

    const reader = new FileReader();

    reader.onload = () => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxWidth = 900;
            const scale = Math.min(1, maxWidth / img.width);

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressedImage = canvas.toDataURL("image/jpeg", 0.78);

            focusEditor();
            document.execCommand("insertHTML", false, `<img src="${compressedImage}" alt="Beszúrt kép">`);
            imageInput.value = "";
            showMessage("A kép beszúrva.", true);
        };

        img.src = reader.result;
    };

    reader.readAsDataURL(file);
});

function getPlainText() {
    const div = document.createElement("div");
    div.innerHTML = contentEditor.innerHTML;
    return div.textContent.trim();
}

async function loadEntry() {
    if (!entryId) {
        return;
    }

    pageTitle.textContent = "Bejegyzés szerkesztése";

    const response = await fetch(`/api/entries/${entryId}`);

    if (response.status === 401) {
        window.location.href = "login.html";
        return;
    }

    const entry = await response.json();

    if (!response.ok) {
        return showMessage(entry.message);
    }

    titleInput.value = entry.title;
    contentEditor.innerHTML = entry.content;
}

entryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentEditor.innerHTML.trim();

    if (!title || !getPlainText()) {
        return showMessage("A cím és a tartalom kitöltése kötelező.");
    }

    const url = entryId ? `/api/entries/${entryId}` : "/api/entries";
    const method = entryId ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    const data = await response.json();

    if (!response.ok) {
        return showMessage(data.message);
    }

    showMessage("Mentés sikeres.", true); showToast("Bejegyzés mentve");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 600);
});

checkLogin().then(loadEntry);


const wordCount = document.getElementById("wordCount");

function updateWordCount() {
    if (!wordCount) {
        return;
    }

    const text = getPlainText();
    wordCount.textContent = text ? text.split(/\s+/).length : 0;
}

contentEditor.addEventListener("input", updateWordCount);
setTimeout(updateWordCount, 400);


if (bgColor) {
    bgColor.addEventListener("change", () => {
        document.execCommand("backColor", false, bgColor.value);
        contentEditor.focus();
    });
}
