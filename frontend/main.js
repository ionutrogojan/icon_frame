// tauri api
const { invoke, convertFileSrc } = window.__TAURI__.tauri;
const { open, save } = window.__TAURI__.dialog;
const { sendNotification } = window.__TAURI__.notification;

// imports
import fs from "./components/input.js";
import Preview from "./components/preview.js";

// components
const file_system = new fs("#file_system");
const preview = new Preview("#preview_image", "#preview_slider", "#preview_indicators");

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
    file_system.links[index] = file_path; // set the link index to the path value
    file_system.update_input(sizes[format][index], `...${await file_path.slice(file_path.length - 25, file_path.length)}`); // update the input path
    preview.links[index] = convertFileSrc(file_path); // update the preview link
  }
}

async function saveFile() {
  // all files selected
  if (file_system.links.length >= 6) {
    const file_path = await save({ title: "Save File", filters: [{ name: format, extensions: [ format ] }] }); // save path destination
    // cancel process check
    if (file_path != null) {
      // backend call to process and save the file
      invoke("save_file", { format, files: file_system.links, path: file_path }).then(res => notify(res));
    }
  } else {
    // loop through the links
    for (let i = 0; i < 6; i++) {
      // if the link is missing, focus the element and break the loop
      if (file_system.links[i] === undefined) { file_system.focus_input(i); break }
    }
  }
}

async function notify(body) {
  // notify on success
  sendNotification({ title: "Icon Frame", icon: "../backend/icons/icon.png", body});
  // reset to default values
  file_system.reset();
  preview.reset(sizes[format][0], sizes[format][5]);
}