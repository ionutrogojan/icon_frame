#![cfg_attr( all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows" )]

use icns::{ IconFamily, Image };
use ico::{ IconDir, ResourceType, IconImage, IconDirEntry };
use std::fs::File;
use std::io::{ BufReader, BufWriter };

fn write_icns(files: Vec<String>, path: &String) {
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
}

fn write_ico(files: Vec<String>, path: &String) {
    // create new icon directory
    let mut icon_directory = IconDir::new(ResourceType::Icon);
    // loop through each path
    for file_path in files.iter() {
        // read the file
        let file = BufReader::new(File::open(&file_path).unwrap());
        // read the image data
        let image = IconImage::read_png(file).unwrap();
        // add the data to the directory
        icon_directory.add_entry(IconDirEntry::encode(&image).unwrap());
    }
    // create the icon file
    let icon = BufWriter::new(File::create(&path).unwrap());
    // add the icon directory to the icon file
    icon_directory.write(icon).unwrap();
}

#[tauri::command]
fn save_file(format: String, files: Vec<String>, path: String) -> String {
    match format.as_str() {
        "icns" => write_icns(files, &path),
        "ico" => write_ico(files, &path),
        _ => eprintln!("no matching icon type"),
    }
    // return notification of completion
    return String::from(path)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
