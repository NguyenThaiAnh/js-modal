const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal() {
    this.open = function (options = {}) {
        const { templateId } = options;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`Template with id ${templateId} not found`);
            return;
        };

        /**
         * Tại sao cần cloneNode(true)?
         * 
         * KHÔNG có cloneNode(true):
         * - template.content được MOVE (không phải copy) vào modal
         * - Lần 1: template.content → modal (hiển thị OK)
         * - Đóng modal: template.content bị XÓA cùng modal
         * - Lần 2: template.content đã RỖNG → modal trống
         * 
         * CÓ cloneNode(true):
         * - Tạo bản COPY của template.content
         * - Lần 1: copy → modal (template gốc vẫn còn)
         * - Đóng modal: chỉ xóa bản copy
         * - Lần 2: tạo copy mới → modal hiển thị bình thường
         * 
         * cloneNode(true) = deep clone (copy cả children elements)
         */
        const content = template.content.cloneNode(true);

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

        // Append elements to the modal
        modalContent.append(content);
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
    modal.open({
        templateId: "modal-1",
    });
}

$("#open-modal-2").onclick = () => {
    modal.open({
        templateId: "modal-2",
    });
}