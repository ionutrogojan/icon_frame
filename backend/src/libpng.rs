use std::io::{ BufReader, Read, Error, ErrorKind };
use std::fs::File;

const PNG_HEADER: [u8; 8] = *b"\x89PNG\r\n\x1a\n";
const IHDR_CHUNK: [u8; 4] = *b"IHDR";

pub fn size(path: &str) -> Result<(u32, u32), Error> {

    let mut image_file = BufReader::new(File::open(path)?); // read the file

    let mut header = [0u8; 8]; // create an exact 8 bytes buffer
    if image_file.read_exact(&mut header).ok() != Some(()) || header != PNG_HEADER { // check if read_exact returns Some() or if the buffer and header bytes are not equal
        return Err(Error::new(ErrorKind::InvalidData, "Invalid file header. Does not contain PNG")); // early return error
    }
    
    let mut width = [0u8; 4]; // create an exact 4 bytes buffer
    let mut height = [0u8; 4];
    loop {
        let mut chunk_length = [0u8; 4]; // read the chunk length field of each chunk, to skip over the unnecessary chunks and read the correct number of bytes for the IHDR chunk to obtain the image width and height
        if image_file.read_exact(&mut chunk_length).ok() != Some(()) { // check if the read_exact returns Some()
            return Err(Error::new(ErrorKind::UnexpectedEof, "Failed to read chunk length")); // early return error
        }

        let mut chunk_type = [0u8; 4]; // read the chunk type to make sure we're reading the correct data
        if image_file.read_exact(&mut chunk_type).ok() != Some(()) {
            return Err(Error::new(ErrorKind::UnexpectedEof, "Failed to read chunk type"));
        }

        if chunk_type == IHDR_CHUNK { // verify the chunk type to make sure we're reading the correct data
            if image_file.read_exact(&mut width).ok() != Some(()) { 
                return Err(Error::new(ErrorKind::UnexpectedEof, "Failed to read width"));
            }
            if image_file.read_exact(&mut height).ok() != Some(()) {
                return Err(Error::new(ErrorKind::UnexpectedEof, "Failed to read height"));
            }
            break; // early break if we get the data
        }

        let chunk_length = u32::from_be_bytes(chunk_length) as usize; // convert the chunk length to a usize to use it as the length of a vector
        let mut chunk_data = vec![0u8; chunk_length]; // create a vector filled with 0 and the length of chunk_length
        if image_file.read_exact(&mut chunk_data).ok() != Some(()) {
            return Err(Error::new(ErrorKind::UnexpectedEof, "Failed to read chunk data"));
        }

        let mut chunk_crc = [0u8; 4]; // read the CRC(Cyclic Redundancy Check) of the file to ensure that the data was not corrupted in transit
        if image_file.read_exact(&mut chunk_crc).ok() != Some(()) {
            return Err(Error::new(ErrorKind::UnexpectedEof, "Failed to read chunk CRC"));
        }
    }

    Ok(( u32::from_be_bytes(width), u32::from_be_bytes(height) )) // return the width and height if OK()
}
