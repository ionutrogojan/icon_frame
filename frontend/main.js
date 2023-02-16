// tauri api
const { invoke, convertFileSrc } = window.__TAURI__.tauri;
const { open, save } = window.__TAURI__.dialog;
const { sendNotification } = window.__TAURI__.notification;

// imports
import FS from "./components/input.js";
import Preview from "./components/preview.js";
import Message from "./components/message.js";

// components
const file_system = new FS("#file_system");
const preview = new Preview("#preview_image", "#preview_slider", "#preview_indicators");
const error_dialog = new Message("#error_dialog");

// elements
const type_buttons = Array.from(document.querySelector("#button_type").children);
const export_button = document.querySelector("#button_export");

// variables
const sizes = {
	icns: [ 16, 32, 128, 256, 512, 1024 ],
	ico: [ 16, 32, 48, 64, 128, 256 ],
}
let format = "icns";
const active_accent = [ "#7FCC33", "#765EED", "#5C84D6", "#FF884C" ];

// default setup
document.body.style = `--active-accent: ${active_accent[Math.floor(Math.random() * active_accent.length)]}`;
setFormat(type_buttons, 0);
// document.oncontextmenu = () => false; // prevent right click

// set icon type [ .icns | .ico ]
type_buttons.forEach((type, index) => type.addEventListener("click", () => setFormat(type_buttons, index), false));
// export the icon file 
export_button.addEventListener("click", () => saveFile(), false);

function setFormat(parent, index) {
	if (index === 1) { format = "ico" } // update if necessary
	else { format = "icns" } // switch back

	file_system.reset();
	preview.reset(sizes[format][0], sizes[format][5]);

	preview.type = format;

	parent.forEach(element => element.dataset.active = "false"); // reset all type style
	parent[index].dataset.active = "true"; // set active style

	sizes[format].forEach(value => file_system.append_input(value)); // append the inputs
	file_system.on_input_click(selectFile); // select the icon file at specific size
}

async function selectFile(index) {
	const file_path = await open({ title: "Open File", multiple: false, filters: [{ name: ".png", extensions: ["png"] }] }); // get the path to the file
	// cancel process check
	if (file_path != null) {
		// valid file check
		invoke("check_file", { format, file: file_path }).then(async res => {
			if (res === "passed") {
				file_system.links[index] = file_path; // set the link index to the path value
				file_system.update_input(sizes[format][index], `...${await file_path.slice(file_path.length - 25, file_path.length)}`); // update the input path
				preview.links[index] = convertFileSrc(file_path); // update the preview link
				preview.slide(index); // update slider value based on file input
			} else { notify_error(res, index); }
		});
	}
}

async function saveFile() {
	console.log(file_system.links.length);
	// at least one file
	if (file_system.links.length > 0) {
		const file_path = await save({ title: "Save File", filters: [{ name: format, extensions: [ format ] }] }); // save path destination
		// cancel process check
		if (file_path != null) {
			// backend call to process and save the file
			invoke("save_file", { format, files: file_system.links, path: file_path }).then(res => notify_save(res));
		}
	} else { file_system.focus_input(0); }
}

async function notify_save(body) {
	sendNotification({ title: "Icon Frame", icon: "../backend/icons/icon.png", body}); // notify on success
	// reset to default values
	file_system.reset();
	preview.reset(sizes[format][0], sizes[format][5]);
	setFormat(type_buttons, 0); // TODO: remember type to restart using the active choice
}

async function notify_error(body, index) {
	sendNotification({ title: "Icon Frame", icon: "../backend/icons/icon.png", body}); // notify on error
	error_dialog.open(body); // show error message
	error_dialog.close(file_system.focus_input(index)); // callback focus bad input on dialog closed
}