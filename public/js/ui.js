function showToast(text, type = "success") {
    let container = document.querySelector(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = text;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 250);
    }, 2600);
}

function setButtonLoading(button, isLoading, text = "Folyamatban...") {
    if (!button) return;

    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = text;
        button.disabled = true;
        button.classList.add("loading");
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
        button.classList.remove("loading");
    }
}
