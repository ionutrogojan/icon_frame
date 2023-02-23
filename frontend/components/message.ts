export default class Message {
    parent: HTMLDialogElement;

    constructor(element: string) {
        this.parent = document.querySelector(`${element}`) as HTMLDialogElement;
    }

    open(message: string) {
        this.parent.showModal(); // show modal element
        (this.parent.querySelector("p") as HTMLParagraphElement).innerText = message; // update modal message
    }

    close(callback: any ) {
        (this.parent.querySelector("button") as HTMLButtonElement).addEventListener("click", () => {
            this.parent.close(); // close the modal element
            callback; // callback function to perform after closing
        }, false)
    }
}