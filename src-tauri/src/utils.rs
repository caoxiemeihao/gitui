use std::fs;

pub fn read_dir(dir: &str) -> Vec<String> {
    let mut result = Vec::new();
    let paths = fs::read_dir(dir).unwrap();

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

#[derive(serde::Serialize)]
pub struct Stat {
    pub is_dir: bool,
    pub is_file: bool,
    pub path: String,
    pub file_name: String,
}

pub fn read_dir_stats(path: &str) -> Vec<Stat> {
    let paths = fs::read_dir(path).unwrap();
    let mut dirs = Vec::new();

    for path in paths {
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
            path: path_buf.to_str().unwrap().into(),
            file_name: path_buf.file_name().unwrap().to_str().unwrap().into(),
        };
        dirs.push(stat);
    }

    dirs
}
