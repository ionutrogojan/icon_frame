export default class fs {
    
    parent;
    links;
    
    constructor(parent) {
        this.parent = document.querySelector(`${parent}`);
        this.links = [];
    }

    append_input(file_size) {
        this.parent.innerHTML += `
        <button id="input_${file_size}">
            <span id="file_path"></span>
            <img src="./assets/file.svg" alt="file">
            <span id="file_size">${file_size}px</span>
        </button>
        `
    }

    update_input(file_size, path_link) {
        const element = document.querySelector(`#input_${file_size}`);
        const file_path = element.querySelector("#file_path");
        file_path.innerText = path_link;
    }

    focus_input(index) { Array.from(this.parent.children)[index].focus(); }

    on_input_click(callback) {
        Array.from(this.parent.children).forEach((input, index) => input.addEventListener("click", () => callback(index), false));
    }

    reset() {
        this.parent.innerHTML = "";
        this.links.length = 0;
    }
}