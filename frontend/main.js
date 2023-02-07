// tauri api
const { invoke } = window.__TAURI__.tauri;
const { open, save } = window.__TAURI__.dialog;
const { sendNotification } = window.__TAURI__.notification;

// elements
const type_button = document.querySelector("#type_button");
const export_button = document.querySelector("#export_button");
const file_system = document.querySelector("#file_system");
const preview_image = document.querySelector("#preview_image");
const file_buttons = Array.from(file_system.children);

// variables
const links = [];

// set icon type [ .icns | .ico ]
type_button.addEventListener("click", () => notify(), false);
// select the icon file at specific size
file_buttons.forEach((file, index) => { file.addEventListener("click", () => selectFile(file, index), false) });
// export the icon file
export_button.addEventListener("click", () => saveFile(), false);

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
  }
}

async function saveFile() {
  // save path destination
  const file_path = await save({ title: "Save File", filters: [{ name: ".icns", extensions: ["icns"] }] });
  // cancel process check
  if (file_path != null) {
    // backend call to process and save the file
    // TODO: check link size to make sure all links are filled
    invoke("save_file", { files: links, path: file_path })
      .then(res => notify(res));
  }
}

async function notify(body) {
  // notify on success
  sendNotification({ title: "Icon Frame", icon: "", body});
}