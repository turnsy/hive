use serde_derive::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
enum Operation {
    Insert(String),
    Delete(u32),
    Retain(u32),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OperationData {
    ops: Vec<Operation>
}



pub fn ws_message_to_vec(data: &[u8]) {
    // convert byte string to utf8
    let data_as_str = std::str::from_utf8(data).unwrap();

    let data : OperationData = serde_json::from_str(data_as_str).unwrap();
    println!("{:?}", data);
}