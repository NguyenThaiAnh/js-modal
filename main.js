const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal() {
    function getScrollbarWidth() {
        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);
        const scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        return scrollbarWidth;
    }

    this.open = function (options = {}) {
        const { templateId, allowBackdropClose = true } = options;
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

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = `${getScrollbarWidth()}px`;

        btnClose.onclick = () => this.closeModal(modalBackdrop);
        if (allowBackdropClose) {
            modalBackdrop.onclick = (e) => {
                if (e.target === modalBackdrop) {
                    this.closeModal(modalBackdrop);
                }
            }
        }

        document.onkeydown = (e) => {
            if (e.key === "Escape") {
                this.closeModal(modalBackdrop);
            }
        }
        return modalBackdrop;
    }

    this.closeModal = (modalElement) => {
        modalElement.classList.remove("show");
        // Enable scrolling
        document.body.classList.remove("no-scroll");
        document.body.style.paddingRight = "";

        // Using transitionend event to wait for the animation in css to finish
        // https://www.w3schools.com/jsref/event_transitionend.asp
        modalElement.ontransitionend = () => {
            modalElement.remove();
        };
    }
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
    const modalElement = modal.open({
        templateId: "modal-1",
        allowBackdropClose: true,
    });
    const img = modalElement.querySelector("img");
    console.dir(img);
}

$("#open-modal-2").onclick = () => {
    const modalElement = modal.open({
        templateId: "modal-2",
        allowBackdropClose: false,
    });

    const form = modalElement.querySelector("#login-form");

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = {
            email: $("#email").value,
            password: $("#password").value,
        }
        console.log(formData);
    }
}