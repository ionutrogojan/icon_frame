export default class Message {
    parent;

    constructor(element) {
        this.parent = document.querySelector(`${element}`);
    }

    open(message) {
        this.parent.showModal(); // show modal element
        this.parent.querySelector("p").innerText = message; // update modal message
    }

    close(callback) {
        this.parent.querySelector("button").addEventListener("click", () => {
            this.parent.close(); // close the modal element
            callback; // callback function to perform after closing
        }, false)
    }
}