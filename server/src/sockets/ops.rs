use std::fs;

use actix_web::Error;
use serde_derive::{Deserialize, Serialize};
use operational_transform::OperationSeq;
use relative_path::RelativePath;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
enum Operation {
    Insert(String),
    Delete(usize),
    Retain(usize),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OperationData {
    ops: Vec<Operation>
}


pub fn handle_op_message(data: &[u8]) -> Result<String, Error> {
    // FOR NOW
    let mut f_string = fs::read_to_string("/Users/jturnsek/repos/real_projects/hive/server/files/test.txt").unwrap();
    
    // convert byte string to utf8
    let data_as_str = std::str::from_utf8(data).unwrap();

    // convert to OperationalData (just a vector wrapper)
    let op_data : OperationData = serde_json::from_str(data_as_str).unwrap();

    // apply operations as they come
    apply_operations(op_data, &mut f_string);

    // write to the file
    fs::write("/Users/jturnsek/repos/real_projects/hive/server/files/test.txt", f_string).unwrap();

    Ok("Edit successful".to_string())    
}

fn apply_operations(op_data: OperationData, f_string: &mut String) {

    let mut cursor: usize = 0;

    for op in op_data.ops {
        match op {
            Operation::Insert(c) => {
                f_string.insert_str(cursor, &c)
            },
            Operation::Retain(offset) => {
                cursor = offset;
            },
            Operation::Delete(amount) => {
                f_string.drain(cursor..(cursor + amount));
            }
        }
    }
}