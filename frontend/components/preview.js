export default class Preview {
    
    image;
    slider;
    indicators;
    links;
    min;
    max;
    type;
    steps;
    
    constructor(image, slider, indicators) {
        for (let i = 0; i < 6; i++) { document.querySelector(`${indicators}`).appendChild(document.createElement("span")) } // create the indicators
        this.image = document.querySelector(`${image}`);
        this.slider = document.querySelector(`${slider}`);
        this.indicators = Array.from(document.querySelector(`${indicators}`).children);
        this.links = [];
        this.min = 16;
        this.max = 512;
        this.type = "icns";
        this.slider.addEventListener("input", () => this.update(this.slider.value), false);
        this.steps = {
            icns: [ 16, 112, 214, 312, 414, 512 ],
            ico: [16 , 62, 112, 160, 210, 256],
        }
        this.indicators.forEach((indicator, index) => indicator.addEventListener("click", () => this.slide(index), false));
    }

    reset(min, max) {
        this.image.setAttribute("src", "./assets/icon_frame.svg"); // default image
        // default or format min
        if (min < 16) { this.slider.min = 16; this.min = 16;}
        else { this.slider.min = min; this.min = min; }
        // default or format max
        if (max > 512) { this.slider.max = 512; this.max = 512; }
        else { this.slider.max = max; this.max = max; }
        this.links.length = 0; // empty preview links
    }

    update(value) {
        const index = this.#closest(value, this.steps[this.type]);
        if (this.links[index] != undefined) {
            this.image.setAttribute("src", this.links[index]);
        }
        this.image.width = value;
    }

    slide(index) {
        this.slider.value = this.steps[this.type][index];
        this.slider.dispatchEvent(new Event("input"));
    }

    #closest(value, array) {
        const temp = array.reduce((a, b) => {
            let aDiff = Math.abs(a - value);
            let bDiff = Math.abs(b - value)
            if (aDiff == bDiff) { return a > b ? a : b }
            else { return bDiff < aDiff ? b : a }
        });
        return array.indexOf(temp);
    }
}