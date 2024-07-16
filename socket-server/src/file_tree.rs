use actix_web::{Error, web};
use serde_derive::{Deserialize, Serialize};
use serde_json;
use std::path::{Path, PathBuf};
use std::{env, fs, io};


#[derive(Serialize, Deserialize)]
pub struct TreeNode {
    name: String,
    children: Option<Vec<TreeNode>>
}

pub fn get_filetree(dir: PathBuf) -> TreeNode {

    if dir.is_dir() {
        let children: Vec<TreeNode> = fs::read_dir(&dir).unwrap()
        .map(|res| get_filetree(res.unwrap().path()))
        .collect();
        TreeNode {
            name: dir.file_name().unwrap().to_str().unwrap().to_string(),
            children: Some(children)
        }
    }
    else {
        TreeNode {
            name: dir.file_name().unwrap().to_str().unwrap().to_string(),
            children: None
        }
    }
}