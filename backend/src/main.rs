#![cfg_attr( all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows" )]

use icns::{ IconFamily, Image };
use std::fs::File;
use std::io::{ BufReader, BufWriter };

#[tauri::command]
fn save_file(files: Vec<String>, path: String) -> String {
    // create new icon family
    let mut icon_family = IconFamily::new();
    // loop through each path
    for file_path in files.iter() {
        // read the file
        let file = BufReader::new(File::open(&file_path).unwrap());
        // read the image data
        let image = Image::read_png(file).unwrap();
        // add the data to the family
        icon_family.add_icon(&image).unwrap();
    }
    // create the icon file
    let icon = BufWriter::new(File::create(&path).unwrap());
    // add the icon family to the icon file
    icon_family.write(icon).unwrap();
    // return notification of completion
    return String::from(path)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
