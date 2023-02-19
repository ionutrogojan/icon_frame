# Icon Frame

<p align="center"><img src="https://raw.githubusercontent.com/ionutrogojan/icon_frame/main/frontend/assets/icon_frame.svg" width="480px"/></p>

A small and easy to use icon builder. Build icons for your applications with `.icns` for MacOS and `.ico` for Windows.

#

## Usage

- Select the preferred icon type using the top-right buttons
- Input the required files in the appropriate fields
- Preview the icon at different sizes using the bottom-left slider
- Export your newly created icon to the selected format

#

TODO:
- [ ] Overwriting icons seems to make the unable to decode. Looking into it

#

NEXT:
- [ ] settings popup and app info
    - [ ] app version / check update
    - [ ] licence and creator
    - [ ] report an issue
    - [ ] website
    - [ ] theme support: dark, light, high-contrast
    - [ ] dependencies and assets

DONE:
- Added error handling for all possible cases. It should be impossible to crash the program and every error triggers a popup with its respective message.
- Enforced correct input file selection. Selecting a 300px width file instead of 256px will now result in an error.
- Enforced `1:1` aspect-ratio. The icon specification only supports `1:1` images to convert to icons.
- Automatically adding extension if not specified. Saving names such as `test_icon` will not be saved as `test_icon.icns` or `test_icon.ico` is the extension is not provided
- Remember active icon type on export to reset back to it.
- Reduced binary file size with rust optimisation
- `Red-Hat Text` font added as a local dependency to maintain cross-os design