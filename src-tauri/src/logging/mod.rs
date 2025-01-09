mod definitions;
mod worker;

pub use definitions::LogEntry;
pub use worker::get_logs;
pub use worker::initialize_logger;
