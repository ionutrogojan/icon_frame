// tauri api
// @ts-ignore
const { invoke, convertFileSrc } = window.__TAURI__.tauri;
// @ts-ignore
const { open, save } = window.__TAURI__.dialog;
// @ts-ignore
const { sendNotification } = window.__TAURI__.notification;
// @ts-ignore
const { listen } = window.__TAURI__.event;
// @ts-ignore
const { window_element } = window.__TAURI__.window;

// imports
import FS from "./components/input.js";
import Preview from "./components/preview.js";
import Message from "./components/message.js";

// components
const file_system = new FS("#file_system");
const preview = new Preview("#preview_image", "#preview_slider", "#preview_indicators");
const error_dialog = new Message("#error_dialog");

// elements
const type_buttons = Array.from((document.querySelector("#button_type") as HTMLButtonElement).children);
const export_button = document.querySelector("#button_export") as HTMLButtonElement;

// variables
const sizes = {
	icns: [ 16, 32, 128, 256, 512, 1024 ],
	ico: [ 16, 32, 48, 64, 128, 256 ],
}
let format = "icns";
const active_accent = [ "#7FCC33", "#765EED", "#5C84D6", "#FF884C" ];

// default setup
// @ts-ignore
document.body.style = `--active-accent: ${active_accent[Math.floor(Math.random() * active_accent.length)]}`;
setFormat(type_buttons, 0);
// document.oncontextmenu = () => false; // prevent right click

// set icon type [ .icns | .ico ]
type_buttons.forEach((type, index) => type.addEventListener("click", () => setFormat(type_buttons, index), false));
// export the icon file 
export_button.addEventListener("click", saveFile, false);

function setFormat(parent: Element[], index: number) {
	if (index === 1) { format = "ico" } // update if necessary
	else { format = "icns" } // switch back

	file_system.reset();
	preview.reset(sizes[format][0], sizes[format][5]);

	preview.type = format;

	parent.forEach((element: Element) => (element as HTMLSpanElement).dataset.active = "false"); // reset all type style
	(parent[index]as HTMLSpanElement).dataset.active = "true"; // set active style

	sizes[format].forEach((value: number) => file_system.append_input(value)); // append the inputs
	file_system.on_input_click(selectFile); // select the icon file at specific size
}

async function selectFile(index: number) {
	const file_path = await open({ title: "Open File", multiple: false, filters: [{ name: ".png", extensions: ["png"] }] }); // get the path to the file
	// cancel process check
	if (file_path != null) {
		// valid file check
		invoke("validate_file", { format, file: file_path, inputSize: sizes[format][index] }).then(async res => {
			if (res === "passed") {
				file_system.links[index] = file_path; // set the link index to the path value
				file_system.update_input(sizes[format][index], `...${await file_path.slice(file_path.length - 25, file_path.length)}`); // update the input path
				// @ts-ignore
				preview.links[index] = convertFileSrc(file_path) as string; // update the preview link
				preview.slide(index); // update slider value based on file input
			} else { notify_error(res, index); }
		});
	}
}

async function saveFile() {
	// at least one file
	if (file_system.links.length > 0) {
		const file_path = await save({ title: "Save File", filters: [{ name: format, extensions: [ format ] }] }); // save path destination
		// cancel process check
		if (file_path != null) {
			const image_path = () => { 
				if(!file_path.endsWith(`.${format}`)) return file_path.concat(`.${format}`) // append extension if not specified
				else { return file_path } // don't append if existing
			}
			const links_list = file_system.links.filter(value => value != undefined); // prevent undefined values to be passed to backend
			invoke("save_file", { format, files: links_list, path: image_path(), window_element}).then((res: string) => notify_save(res)); // backend call to process and save the file
		}
	} else { file_system.focus_input(0); }
}

async function notify_save(body: string) {
	sendNotification({ title: "Icon Frame", icon: "../backend/icons/icon.png", body}); // notify on success
	// reset to default values
	file_system.reset();
	preview.reset(sizes[format][0], sizes[format][5]);
	// @ts-ignore
	function active(): number {
		switch (format) {
			case "ico": return 1;
			case "icns": return 0;
		}
	} // get the active format and reset to it
	setFormat(type_buttons, active());
}

async function notify_error(body: string, index: number) {
	sendNotification({ title: "Icon Frame", icon: "../backend/icons/icon.png", body}); // notify on error
	error_dialog.open(body); // show error message
	error_dialog.close(file_system.focus_input(index)); // callback focus bad input on dialog closed
}

await listen("backend_error", (event: { payload: any; }) => {
	notify_error(event.payload, 0) // TODO: get input index if necessary to focus
});