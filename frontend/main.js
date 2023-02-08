// tauri api
const { invoke, convertFileSrc } = window.__TAURI__.tauri;
const { open, save } = window.__TAURI__.dialog;
const { sendNotification } = window.__TAURI__.notification;

// elements
const type_button = document.querySelector("#type_button");
const export_button = document.querySelector("#export_button");
const file_system = document.querySelector("#file_system");
const file_buttons = Array.from(file_system.children);
const preview_image = document.querySelector("#preview_image");
const preview_size = document.querySelector("#preview_size");
const slider_indicator = document.querySelector("#preview_indicator");
const indicator_sizes = Array.from(slider_indicator.children);

const placeholder = document.querySelector("#placeholder");

// variables
const sizes = [ "16px", "32px", "128px", "256px", "512px", "1024px" ];
const links = [];
const previews = [];
const active_accent = [ "#7FCC33", "#765EED", "#5C84D6", "#FF884C" ];

document.body.style = `--active-accent: ${active_accent[Math.floor(Math.random() * active_accent.length)]}`

// set icon type [ .icns | .ico ]
type_button.addEventListener("click", () => notify(), false);
// select the icon file at specific size
file_buttons.forEach((file, index) => { file.addEventListener("click", () => selectFile(file, index), false) });
// export the icon file
export_button.addEventListener("click", () => saveFile(), false);
// show icon preview at specific size
preview_size.addEventListener("input", () => previewIcon(preview_size.value), false);

indicator_sizes.forEach((size, index) => { size.addEventListener("click", () => previewSlide(index), false) });

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
    element.innerText = "..." + display + " - " + sizes[index];
    
    let image_path = convertFileSrc(file_path);
    
    previews[index] = image_path;

    preview_image.setAttribute("src", previews[index]);

    previewSlide(index);
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
  // reset to default values
  reset();
}

function previewIcon(size) {
  // console.log(size);
  const preview = (step) => { return size > step * 204 }
  switch (true) {
    case preview(5):
      if ( !IS_EMPTY(5) && !IS_EQUAL() ) { preview_image.setAttribute("src", previews[5]) }
      preview_image.width = "512"
      break;
    case preview(4):
      if ( !IS_EMPTY(4) && !IS_EQUAL() ) { preview_image.setAttribute("src", previews[4]) }
      preview_image.width = "256"
      break;
    case preview(3):
      if ( !IS_EMPTY(3) && !IS_EQUAL() ) { preview_image.setAttribute("src", previews[3]) }
      preview_image.width = "128"
      break;
    case preview(2):
      if ( !IS_EMPTY(2) && !IS_EQUAL() ) { preview_image.setAttribute("src", previews[2]) }
      preview_image.width = "64"
      break;
    case preview(1):
      if ( !IS_EMPTY(1) && !IS_EQUAL() ) { preview_image.setAttribute("src", previews[1]) }
      preview_image.width = "32";
      break;
    case preview(0):
      if ( !IS_EMPTY(0) && !IS_EQUAL() ) { preview_image.setAttribute("src", previews[0]) }
      preview_image.width = "16";
      break;
  }
}

function reset() {
  // empty previews
  previews.length = 0;
  // empty file paths
  links.length = 0;
  // reset icon preview
  preview_image.setAttribute("src", "./assets/icon_frame.svg");
  // reset button text
  file_buttons.forEach((button, index) => { button.innerText = sizes[index] })
}

function previewSlide(step) {
  // update value
  preview_size.value = (step * 204) + 1;
  // send event to the event listener
  preview_size.dispatchEvent(new InputEvent("input"))
}

function IS_EMPTY(index) { return previews[index] === undefined }

function IS_EQUAL(index) { return preview_image.getAttribute("src") === previews[index] }