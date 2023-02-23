export default class About {
    parent: HTMLDialogElement;

    constructor(parent: string) {
        this.parent = document.querySelector(`${parent}`) as HTMLDialogElement;
        (this.parent.querySelector("#about_close") as HTMLImageElement).addEventListener("click", () => this.#close(), false);
    }

    open() { this.parent.showModal() }

    #close() { this.parent.close() }
}