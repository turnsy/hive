use std::{fs, path::Path};
use actix_web::Error;
use serde_derive::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
enum Operation {
    Insert(String),
    Delete(usize),
    Retain(usize),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OperationData {
    ops: Vec<Operation>,
}

pub fn handle_op_message(data: &[u8]) -> Result<String, Error> {

    // convert byte string to utf8
    let data_as_str = std::str::from_utf8(data).unwrap();

    // convert to OperationalData (just a vector wrapper)
    let op_data: OperationData = serde_json::from_str(data_as_str).unwrap();

    // get our current state of the file being edited, read it into a string
    let f_path = Path::new("./files/test.txt");
    let mut f_string = fs::read_to_string(f_path).unwrap();

    // apply operations to the current file
    apply_operations(op_data, &mut f_string);

    // write to the file
    fs::write(f_path, f_string).unwrap();

    Ok(String::from(data_as_str))
}

fn apply_operations(op_data: OperationData, f_string: &mut String) {
    let mut cursor: usize = 0;

    // applies the operations to the string itself.
    // insert just inserts the characters at index cursor,
    //
    // retain moves to cursor (index) to position offset,
    //
    // delete removes 'amount' characters from the current position
    // denoted by cursor.
    for op in op_data.ops {
        match op {
            Operation::Insert(c) => f_string.insert_str(cursor, &c),
            Operation::Retain(offset) => {
                cursor = offset;
            }
            Operation::Delete(amount) => {
                f_string.drain(cursor..(cursor + amount));
            }
        }
    }
}
