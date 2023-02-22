export default class Preview {
    
    image: HTMLImageElement;
    slider: HTMLInputElement;
    indicators: Element[];
    links: [];
    min: number;
    max: number;
    type: string;
    steps: {};
    
    constructor(image: any, slider: any, indicators: any) {
        for (let i = 0; i < 6; i++) { (document.querySelector(`${indicators}`) as HTMLElement).appendChild(document.createElement("span")) } // create the indicators
        this.image = document.querySelector(`${image}`) as HTMLImageElement;
        this.slider = document.querySelector(`${slider}`) as HTMLInputElement;
        this.indicators = Array.from((document.querySelector(`${indicators}`) as HTMLSpanElement).children);
        this.links = [];
        this.min = 16;
        this.max = 512;
        this.type = "icns";
        this.slider.addEventListener("input", () => this.update(parseInt(this.slider.value)), false);
        this.steps = {
            icns: [ 16, 112, 214, 312, 414, 512 ],
            ico: [16 , 62, 112, 160, 210, 256],
        }
        this.indicators.forEach((indicator, index) => indicator.addEventListener("click", () => this.slide(index), false));
    }

    reset(min: number, max: number) {
        this.image.setAttribute("src", "./assets/icon_frame.svg"); // default image
        // default or format min
        if (min < 16) { this.slider.min = "16"; this.min = 16;}
        else { this.slider.min = `${min}`; this.min = min; }
        // default or format max
        if (max > 512) { this.slider.max = "512"; this.max = 512; }
        else { this.slider.max = `${max}`; this.max = max; }
        this.links.length = 0; // empty preview links
    }

    update(value: number) {
        const index = this.#closest(value, this.steps[this.type]);
        if (this.links[index] != undefined) {
            this.image.setAttribute("src", this.links[index]);
        }
        this.image.width = value;
    }

    slide(index: number) {
        this.slider.value = this.steps[this.type][index];
        this.slider.dispatchEvent(new Event("input"));
    }

    #closest(value: number, array: []) {
        const temp = array.reduce((a, b) => {
            let aDiff: number = Math.abs(a - value);
            let bDiff: number = Math.abs(b - value)
            if (aDiff == bDiff) { return a > b ? a : b }
            else { return bDiff < aDiff ? b : a }
        });
        return array.indexOf(temp);
    }
}