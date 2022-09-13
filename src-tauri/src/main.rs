#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
mod utils;

// static mut GLOBAL_APP: Option<&mut tauri::App> = None;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_dir(directory: &str) -> Vec<String> {
    utils::read_dir(directory)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            app.get_window("main").unwrap().open_devtools();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, read_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
