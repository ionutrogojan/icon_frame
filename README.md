# Icon Frame

<p align="center"><img src="https://raw.githubusercontent.com/ionutrogojan/icon_frame/main/icon-frame.png" width="900px"/></p>

A small and easy to use icon builder. Build icons for your applications with `.icns` for MacOS and `.ico` for Windows.

#

## Usage

- Select the preferred icon type using the top-right buttons
- Input the required files in the appropriate fields
- Preview the icon at different sizes using the bottom-left slider
- Export your newly created icon to the selected format

## Compile Guide
- Requirements:
    1. rustc and cargo -> [link](https://www.rust-lang.org/tools/install)
    2. tauri cli -> `cargo install tauri-cli`
    3. swc standalone -> [link](https://github.com/swc-project/swc/releases)
1. Clone the repo to your system and `cd ./icon-frame` inside the folder
2. Use `swc` to compile all the `*.ts` files to `*.js`. Use the `config.swcrc` as a compile argument
3. Run the project with `cargo tauri dev` for testing and `cargo tauri build` for release
4. Find your binary executable inside the `/backend/target/release/bundle`

#

TODO:
- [ ] self updater
- [ ] automatically resize large images to required size if no input file is provided

#

NEXT:
- [ ] settings popup and app info
    - [ ] theme support: dark, light, high-contrast
    - [ ] website