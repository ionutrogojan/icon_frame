export default class fs {
    
    parent: HTMLButtonElement;
    links: string[];
    
    constructor(parent: string) {
        this.parent = document.querySelector(`${parent}`) as HTMLButtonElement;
        this.links = [];
    }

    append_input(file_size: number) {
        this.parent.innerHTML += `
        <button id="input_${file_size}">
            <span id="file_path"></span>
            <img src="./assets/file.svg" alt="file">
            <span id="file_size">${file_size}px</span>
        </button>
        `
    }

    update_input(file_size: any, path_link: string) {
        const element = document.querySelector(`#input_${file_size}`) as HTMLButtonElement;
        const file_path = element.querySelector("#file_path") as HTMLSpanElement;
        file_path.innerText = path_link;
    }

    focus_input(index: number) { (Array.from(this.parent.children)[index] as HTMLButtonElement).focus(); }

    on_input_click(callback: any) {
        Array.from(this.parent.children).forEach((input, index: number) => input.addEventListener("click", () => callback(index), false));
    }

    reset() {
        this.parent.innerHTML = "";
        this.links.length = 0;
    }
}