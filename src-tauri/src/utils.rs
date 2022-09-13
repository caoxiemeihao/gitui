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
