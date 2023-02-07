// tauri api
const { invoke, convertFileSrc } = window.__TAURI__.tauri;
const { open, save } = window.__TAURI__.dialog;
const { sendNotification } = window.__TAURI__.notification;
const { appDataDir, join } = window.__TAURI__.path;

// elements
const type_button = document.querySelector("#type_button");
const export_button = document.querySelector("#export_button");
const file_system = document.querySelector("#file_system");
const file_buttons = Array.from(file_system.children);
const preview_image = document.querySelector("#preview_image");
const preview_size = document.querySelector("#preview_size");

const placeholder = document.querySelector("#placeholder");

// variables
const links = [];

// set icon type [ .icns | .ico ]
type_button.addEventListener("click", () => notify(), false);
// select the icon file at specific size
file_buttons.forEach((file, index) => { file.addEventListener("click", () => selectFile(file, index), false) });
// export the icon file
export_button.addEventListener("click", () => saveFile(), false);
// show icon preview at specific size
preview_size.addEventListener("input", () => previewIcon(preview_size.value), false);

async function selectFile(element, index) {
  // get the path to the file
  const file_path = await open({ title: "Open File", multiple: false, filters: [{ name: ".png", extensions: ["png"] }] })
  // cancel process check
  if (file_path != null) {
    // set the link index to the path value
    links[index] = file_path;
    // get the end of the path
    const display = await file_path.slice(file_path.length - 20, file_path.length);
    // update button name with custom file path name
    element.innerText = "..." + display + " - " + element.innerText;
    let image_path = convertFileSrc(file_path);
    preview_image.setAttribute("src", image_path);
  }
}

async function saveFile() {
  // all files selected
  if (links.length >= 6) {
    // save path destination
    const file_path = await save({ title: "Save File", filters: [{ name: ".icns", extensions: ["icns"] }] });
    // cancel process check
    if (file_path != null) {
      // backend call to process and save the file
      invoke("save_file", { files: links, path: file_path })
        .then(res => notify(res));
    }
  } else {
    // loop through the links
    for (let i = 0; i < 6; i++) {
      // if the link is missing, focus the element and break the loop
      if (links[i] === undefined) { file_buttons[i].focus(); break }
    }
  }
}

async function notify(body) {
  // notify on success
  sendNotification({ title: "Icon Frame", icon: "../backend/icons/icon.png", body});
}

function previewIcon(size) {
  console.log(size);
  const preview = (step) => { return size > step * 204 }
  switch (true) {
    case preview(5):
      placeholder.innerText = "6";
      break;
    case preview(4):
      placeholder.innerText = "5";
      break;
    case preview(3):
      placeholder.innerText = "4";
      break;
    case preview(2):
      placeholder.innerText = "3";
      break;
    case preview(1):
      placeholder.innerText = "2";
      break;
    case preview(0):
      placeholder.innerText = "1";
      break;
  }
}