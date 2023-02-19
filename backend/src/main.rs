#![cfg_attr( all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows" )]

use icns::{ IconFamily, Image };
use ico::{ IconDir, ResourceType, IconImage, IconDirEntry };
use std::fs::File;
use std::io::{ BufReader, BufWriter, Error };

mod libpng;

fn get_image(path: &str) -> Result<BufReader<File>, Error>{
    let file = File::open(path)?;
    Ok(BufReader::new(file))
}

fn make_image(path: &str) -> Result<BufWriter<File>, Error> {
    let file = File::create(&path)?;
    Ok(BufWriter::new(file))
}

fn backend_error(window: &tauri::Window, body: String) {
    match tauri::Window::emit(window, "backend_error", Some(body)) {
        Ok(_) => {}
        Err(e) => println!("{}", e.to_string())
    };
}

fn write_icns(files: Vec<String>, path: &String, window: tauri::Window) {
    let mut icon_family = IconFamily::new(); // create new icon family
    // loop through each path
    for file_path in files.iter() {
        match get_image(file_path) {
            Ok(res) => match Image::read_png(res) { // read png if get_image returns <File>
                Ok(img) =>  match icon_family.add_icon(&img) { // add icon to bundle if read_png returns <image>
                    Ok(_) => {}, // do nothing if Ok
                    Err(e) => return backend_error(&window, e.to_string()) // print add_icon error and return
                },
                Err(e) => return backend_error(&window, e.to_string()) // print read_png error and return
            },
            Err(e) => return backend_error(&window, e.to_string()) // print get_image error and return
        };
    }
    match make_image(path) {
        Ok(res) => match icon_family.write(res) { // write icon if make_file is successful
            Ok(_) => {}, // do nothing if OK()
            Err(e) => return backend_error(&window, e.to_string()) // print write error and return
        },
        Err(e) => return backend_error(&window, e.to_string()) // print make_image error and return
    }
}

fn write_ico(files: Vec<String>, path: &String, window: tauri::Window) {
    // create new icon directory
    let mut icon_directory = IconDir::new(ResourceType::Icon);
    // loop through each path
    for file_path in files.iter() {
        match get_image(file_path) {
            Ok(res) => match IconImage::read_png(res) { // read png if get_image returns <File>
                Ok(img) => match IconDirEntry::encode(&img) { // encode the png data if read_png returns <IconImage>
                    Ok(data) => icon_directory.add_entry(data), // add icon to bundle if read_png returns <IconDirEntry>
                    Err(e) => return backend_error(&window, e.to_string()) // print encode error and return
                }
                Err(e) => return backend_error(&window, e.to_string()) // print read_png error and return
            },
            Err(e) => return backend_error(&window, e.to_string()) // print get_image error and return
        };
    }
    match make_image(path) {
        Ok(res) => match icon_directory.write(res) { // write icon if make_file is successful
            Ok(_) => {}, // do nothing if OK()
            Err(e) => return backend_error(&window, e.to_string()) // print write error and return
        },
        Err(e) => return backend_error(&window, e.to_string()) // print make_image error and return
    }
}

#[tauri::command]
fn validate_file(format: String, file: String, input_size: u32) -> String {
    let file_data = match get_image(&file) {
        Ok(res) => res,
        Err(e) => return e.to_string()
    };

    match libpng::size(&file.as_str()) { // check file aspect-ratio
        Ok((width, height)) => {
            if width != height { return format!("Unsupported icons size {}x{}.\nAll icons must use a valid 1:1 aspect-ratio.", width, height) }
            else if width != input_size { return format!("Selected input size {}px does not match the PNG size {}px.", input_size, width) }
        },
        Err(e) => return e.to_string(),
    };
    
    match format.as_str() { // check file read success
        "icns" => {
            match Image::read_png(file_data) {
                Ok(_) => return "passed".to_string(),
                Err(e) => return e.to_string(),
            }
        },
        "ico" => {
            match IconImage::read_png(file_data) {
                Ok(_) => return "passed".to_string(),
                Err(e) => return e.to_string(),
            }
        },
        _ => return "Unable to perform file check due to unknown reasons".to_string()
    };
}

#[tauri::command]
fn save_file(format: String, files: Vec<String>, path: String, window: tauri::Window) -> String {
    match format.as_str() {
        "icns" => write_icns(files, &path, window),
        "ico" => write_ico(files, &path, window),
        _ => println!("Unknown icon type"),
    };
    return path;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_file, validate_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
