const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const modal = $("#modal");
const openModal = $("#open-modal");
const modalClose = $("#close-modal");

openModal.addEventListener("click", () => {
    modal.classList.add("show");
});

modalClose.addEventListener("click", () =>
    modal.classList.remove("show")
);

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.classList.remove("show");
    }
});
