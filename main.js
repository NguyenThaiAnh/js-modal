const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const buttonsOpen = $$("button[data-modal]");
const buttonsClose = $$(".modal-close");
const backdrops = $$(".modal-backdrop");
let currentModal = null;

buttonsOpen.forEach(button => {
    button.addEventListener("click", function () {
        const modal = $(this.dataset.modal);
        if (modal) {
            currentModal = modal;
            modal.classList.add("show");
        }
        else console.error(`${this.dataset.modal} not found`);
    });
});

buttonsClose.forEach(button => {
    button.addEventListener("click", function () {
        const modal = this.closest(".modal-backdrop");
        if (modal) {
            currentModal = null;
            modal.classList.remove("show");
        }
    });
});

backdrops.forEach(backdrop => {
    backdrop.addEventListener("click", function (e) {
        if (e.target === this) {
            currentModal = null;
            this.classList.remove("show");
        }
    });
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        if (currentModal) {
            currentModal.classList.remove("show");
            currentModal = null;
        }
    }
});