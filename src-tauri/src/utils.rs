use std::{fs, path};

pub fn read_dir(_path: &str) -> Vec<String> {
    let mut result = Vec::new();
    let paths = fs::read_dir(_path).unwrap();

    for path in paths {
        // println!("{}", path.unwrap().path().display());

        // let path_option = match path {
        //     Ok(dir_entry) => dir_entry.path().to_str(), - temporary value is freed at the end of this statement
        //     Err(_e) => None,
        // };
        // if path_option != None {
        //     result.push(path_option.unwrap());
        // }

        // String 不会有生命周期问题
        let path_string = path.unwrap().path().to_str().unwrap().to_string();
        result.push(path_string);
    }

    result
}

// https://tauri.app/v1/guides/features/command/#complete-example
#[derive(serde::Serialize)]
pub struct Stat {
    pub is_dir: bool,
    pub is_file: bool,
    pub is_symlink: bool,
    pub path: String,
    pub name: String,
}

pub fn read_dir_stat(_path: &str) -> Vec<Stat> {
    let mut dirs: Vec<Stat> = Vec::new();
    let stat = read_stat(_path);

    if stat.is_some() && stat.unwrap().is_dir {
        let paths = fs::read_dir(_path);
        if paths.is_ok() {
            for path in paths.unwrap() {
                if path.is_ok() {
                    let path_buf = path.unwrap().path();
                    // let mut dir = HashMap::new();
                    // let _path = path_buf.to_str().unwrap().to_string();
                    // let is_dir = path_buf.is_dir();
                    // let is_file = path_buf.is_file();
                    // dir.insert("path", _path);
                    // dir.insert("is_dir", is_dir.to_string());
                    // dir.insert("is_file", is_file.to_string());
                    let stat = Stat {
                        is_dir: path_buf.is_dir(),
                        is_file: path_buf.is_file(),
                        is_symlink: path_buf.is_symlink(),
                        path: path_buf.to_str().unwrap().into(),
                        name: path_buf.file_name().unwrap().to_str().unwrap().into(),
                    };
                    dirs.push(stat);
                }
            }
        }
    }

    dirs
}

pub fn read_stat(_path: &str) -> Option<Stat> {
    let path2 = path::Path::new(_path);
    if path2.exists() {
        let metadata = fs::metadata(_path);
        match metadata {
            Ok(meta) => Some(Stat {
                is_dir: meta.is_dir(),
                is_file: meta.is_file(),
                is_symlink: meta.is_symlink(),
                path: _path.into(),
                // If `path2` is a directory, `name` will be the last level directory.
                name: path2.file_name().unwrap().to_str().unwrap().into(),
            }),
            Err(err) => {
                println!("{}", err);
                None
            }
        }
    } else {
        None
    }
}
