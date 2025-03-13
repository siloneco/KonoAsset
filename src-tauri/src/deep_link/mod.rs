use definitions::DeepLinkAction;
use tauri::AppHandle;

pub mod definitions;

mod executer;
mod parser;

pub fn parse_args_to_deep_links(args: &Vec<String>) -> Vec<DeepLinkAction> {
    parser::parse(args)
}

pub fn execute_deep_links(app: &AppHandle, deep_links: &Vec<DeepLinkAction>) {
    executer::execute_deep_links(app, deep_links);
}
