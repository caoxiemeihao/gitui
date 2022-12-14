#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use tauri::Manager;
mod utils;

// static mut GLOBAL_APP: Option<&mut tauri::App> = None;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_dir(path: &str) -> Vec<String> {
    utils::read_dir(path)
}

#[tauri::command]
fn read_dir_stat(path: &str) -> Vec<utils::Stat> {
    utils::read_dir_stat(path)
}

#[tauri::command]
fn read_stat(path: &str) -> Option<utils::Stat> {
    // None(rs) -> null(js)
    utils::read_stat(path)
}

#[tauri::command]
fn exec(
    path: &str,
    // `cmd` is `invoke()` builtin args
    // https://tauri.app/v1/api/js/tauri/#invoke
    command: &str,
    args: Vec<&str>,
) -> utils::ExecResult {
    utils::exec(path, command, args)
}

fn main() {
    tauri::Builder::default()
        // .setup(|app| {
        // error[E0599]: no method named `open_devtools` found for struct `Window` in the current scope
        // app.get_window("main").unwrap().open_devtools();
        //     Ok(())
        // })
        .invoke_handler(tauri::generate_handler![
            greet,
            read_dir,
            read_dir_stat,
            read_stat,
            exec,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
