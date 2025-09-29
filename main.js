const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

function Modal(options = {}) {
    const {
        templateId,
        destroyOnClose = true,
        cssClass = [],
        footer = false,
        closeMethods = ["button", "overlay", "escape"],
        onOpen,
        onClose,
    } = options;

    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`Template with id ${templateId} not found`);
        return;
    };

    this._allowButtonClose = closeMethods.includes("button");
    this._allowOverlayClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    function getScrollbarWidth() {
        if (getScrollbarWidth.value)
            return getScrollbarWidth.value;

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);
        const scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        getScrollbarWidth.value = scrollbarWidth;
        return scrollbarWidth;
    }

    this._build = function () {
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
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        cssClass.forEach(className => {
            if (typeof className === "string") {
                container.classList.add(className);
            }
        });

        if (this._allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;";

            container.append(closeBtn);
            closeBtn.onclick = () => this.close();
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append elements to the modal
        modalContent.append(content);
        container.append(modalContent);

        if (footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";

            if (this._footerContent) {
                this._modalFooter.innerHTML = this._footerContent;
            }

            this._footerButtons.forEach((button) => {
                this._modalFooter.append(button);
            });

            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
    }

    this.setFooterContent = (content) => {
        this._footerContent = content;
        if (this._modalFooter) {
            this._modalFooter.innerHTML = this._footerContent;
        }
    }

    this._footerButtons = [];
    this.addFooterButton = (title, cssClass, callback) => {
        const button = document.createElement("button");
        button.className = cssClass;
        button.innerHTML = title;
        button.onclick = callback;

        this._footerButtons.push(button);
    };

    this.open = function () {
        Modal.elements.push(this);

        if (!this._backdrop) {
            this._build();
        }

        setTimeout(() => {
            this._backdrop.classList.add("show");
        }, 0);

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = `${getScrollbarWidth()}px`;

        // Attach event listeners
        if (this._allowOverlayClose) {
            this._backdrop.onclick = (e) => {
                if (e.target === this._backdrop) {
                    this.close();
                }
            }
        }

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", this._handleEscapeKey);
        }

        this._onTransitionEnd(() => {
            if (typeof onOpen === "function") onOpen();
        });

        return this._backdrop;
    }

    this._handleEscapeKey = (e) => {
        const lastModal = Modal.elements[Modal.elements.length - 1];
        if (e.key === "Escape" && this === lastModal) {
            this.close();
        }
    };

    this._onTransitionEnd = (callback) => {
        this._backdrop.ontransitionend = (e) => {
            if (e.propertyName !== "transform") return;
            if (typeof callback === "function") callback();
        }
    }

    this.close = (destroy = destroyOnClose) => {
        Modal.elements.pop();

        this._backdrop.classList.remove("show");

        if (this._allowEscapeClose) {
            document.removeEventListener("keydown", this._handleEscapeKey);
        }

        // Using transitionend event to wait for the animation in css to finish
        // https://www.w3schools.com/jsref/event_transitionend.asp
        this._onTransitionEnd(() => {
            if (this._backdrop && destroy) {
                this._backdrop.remove();
                this._backdrop = null;
                this._modalFooter = null;
            };

            // Enable scrolling
            if (Modal.elements.length === 0) {
                document.body.classList.remove("no-scroll");
                document.body.style.paddingRight = "";
            }

            if (typeof onClose === "function") onClose();
        });
    }

    this.destroy = () => {
        this.close(true);
    }
}

const modal1 = new Modal({
    templateId: "modal-1",
    destroyOnClose: false,
    onOpen: () => {
        console.log("Modal 1 opened");
    },
    onClose: () => {
        console.log("Modal 1 closed");
    },
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();
    const img = modalElement.querySelector("img");
    console.dir(img);
}


const modal2 = new Modal({
    templateId: "modal-2",
    // closeMethods: ['button', 'overlay', 'escape'],
    footer: true,
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal 2 opened");
    },
    onClose: () => {
        console.log("Modal 2 closed");
    },
});

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

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

const modal3 = new Modal({
    templateId: "modal-3",
    closeMethods: ["escape"],
    footer: true,
    onOpen: () => {
        console.log("Modal 3 opened");
    },
    onClose: () => {
        console.log("Modal 3 closed");
    },
});

// modal3.setFooterContent("<h2>Footer content</h2>");
modal3.addFooterButton("Danger", "modal-btn danger pull-left", (e) => {
    alert("Danger clicked!");
});

modal3.addFooterButton("Cancel", "modal-btn", (e) => {
    modal3.close();
});

modal3.addFooterButton("<span>Agree</span>", "modal-btn primary", (e) => {
    // Something...
    modal3.close();
});

$("#open-modal-3").onclick = () => {
    modal3.open();
};