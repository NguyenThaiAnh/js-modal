const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal() {
    this.open = function (children) {
        // Create modal elements
        const modalBackdrop = document.createElement("div");
        modalBackdrop.className = "modal-backdrop";

        const modalContainer = document.createElement("div");
        modalContainer.className = "modal-container";

        const btnClose = document.createElement("button");
        btnClose.className = "modal-close";
        btnClose.innerHTML = "&times;";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.innerHTML = children;

        // Append elements to the modal
        modalContent.innerHTML = children;
        modalContainer.append(btnClose, modalContent);
        modalBackdrop.append(modalContainer);
        document.body.append(modalBackdrop);

        setTimeout(() => {
            modalBackdrop.classList.add("show");
        }, 0);

        btnClose.onclick = () => this.closeModal(modalBackdrop);
        modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) {
                this.closeModal(modalBackdrop);
            }
        }

        document.onkeydown = (e) => {
            if (e.key === "Escape") {
                this.closeModal(modalBackdrop);
            }
        }
    }

    this.closeModal = (modalElement) => {
        modalElement.classList.remove("show");

        // Using transitionend event to wait for the animation in css to finish
        // https://www.w3schools.com/jsref/event_transitionend.asp
        modalElement.ontransitionend = () => {
            modalElement.remove();
        };
    }
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
    modal.open('<h1>Modal 1</h1>');
}

$("#open-modal-2").onclick = () => {
    modal.open('<h1>Modal 2</h1>');
}

$("#open-modal-3").onclick = () => {
    modal.open('<h1>Modal 3</h1>');
}