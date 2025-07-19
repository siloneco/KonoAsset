/*
 * Portions of this file are derived from the vrc-get project, available at
 * vrc-get/vrc-get vrc-get-gui - https://github.com/vrc-get/vrc-get/blob/master/vrc-get-gui/src/logging.rs
 * Copyright (c) 2023 anatawa12 and other contributors
 */

use std::io::Write;
use std::path::Path;
use std::sync::Mutex;
use std::sync::mpsc;

use ringbuffer::{ConstGenericRingBuffer, RingBuffer};

use super::definitions::{LogChannelMessage, LogEntry, Logger};

const LOG_RETENTION_DAYS: i64 = 14;

static LOG_BUFFER: Mutex<ConstGenericRingBuffer<LogEntry, 256>> =
    Mutex::new(ConstGenericRingBuffer::new());

pub fn initialize_logger<P: AsRef<Path>>(log_dir: P) {
    let logs_dir = log_dir.as_ref();

    let (sender, receiver) = mpsc::channel::<LogChannelMessage>();
    let logger = Logger { sender };

    log::set_max_level(log::LevelFilter::Debug);
    log::set_boxed_logger(Box::new(logger)).expect("error while setting logger");

    start_logging_thread(receiver, &logs_dir);
    purge_outdated_logs(&logs_dir).ok();
}

pub fn get_logs() -> Vec<LogEntry> {
    let buffer = LOG_BUFFER.lock().unwrap();
    buffer.iter().cloned().collect()
}

fn start_logging_thread(receiver: mpsc::Receiver<LogChannelMessage>, logs_dir: &Path) {
    if !logs_dir.exists() {
        std::fs::create_dir_all(&logs_dir).ok();
    }

    // chrono::Local より chrono::Utc の方が安定するため Utc を使用
    let timestamp = chrono::Utc::now()
        .format("%Y-%m-%d_%H-%M-%S.%6f")
        .to_string();
    let log_file = logs_dir.join(format!("konoasset-{}.log", timestamp));

    let log_file = match std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file)
    {
        Ok(file) => {
            log::info!("logging to file {}", log_file.display());
            Some(file)
        }
        Err(e) => {
            log::error!("error while opening log file: {}", e);
            None
        }
    };

    std::thread::Builder::new()
        .name("logging".to_string())
        .spawn(move || {
            logging_thread_main(receiver, log_file);
        })
        .expect("error while starting logging thread");
}

fn logging_thread_main(
    receiver: mpsc::Receiver<LogChannelMessage>,
    mut log_file: Option<std::fs::File>,
) {
    for message in receiver {
        match message {
            LogChannelMessage::Log(entry) => {
                let message = format!("{}", entry);
                // log to console
                eprintln!("{}", message);

                // log to file
                if let Some(log_file) = log_file.as_mut() {
                    let result = writeln!(log_file, "{}", message).err();
                    if let Some(e) = result {
                        eprintln!("error while writing to log file: {}", e);
                    }
                }

                // add to buffer
                {
                    let mut buffer = LOG_BUFFER.lock().unwrap();
                    buffer.enqueue(entry.clone());
                }

                // send to tauri
                // if let Some(app_handle) = APP_HANDLE.load().as_ref() {
                //     app_handle
                //         .emit("log", Some(entry))
                //         .expect("error while emitting log event");
                // }
            }
            LogChannelMessage::Flush(sync) => {
                if let Some(log_file) = log_file.as_mut() {
                    let result = log_file.flush().err();
                    if let Some(e) = result {
                        eprintln!("error while writing to log file: {}", e);
                    }

                    sync.send(()).ok();
                }
            }
        }
    }
}

fn purge_outdated_logs(logs_dir: &Path) -> Result<(), std::io::Error> {
    let readdir = logs_dir.read_dir()?;

    for entry in readdir {
        match entry {
            Ok(path) => {
                let path = path.path();

                let file_stem = path.file_stem().unwrap().to_str().unwrap();

                // 先頭の "konoasset-" が10文字なため
                let timestamp = &file_stem[10..];

                if is_outdated_timestamp(timestamp) {
                    log::debug!("purging outdated log file: {}", path.display());
                    std::fs::remove_file(&path).ok();
                }
            }
            Err(e) => {
                log::error!("error while purging outdated logs: {}", e);
            }
        }
    }

    Ok(())
}

fn is_outdated_timestamp(timestamp: &str) -> bool {
    let timestamp = match chrono::NaiveDateTime::parse_from_str(&timestamp, "%Y-%m-%d_%H-%M-%S.%6f")
    {
        Ok(timestamp) => timestamp,
        Err(e) => {
            log::error!("error while parsing timestamp: {}", e);
            return false;
        }
    };

    let timestamp = chrono::DateTime::<chrono::Utc>::from_naive_utc_and_offset(
        timestamp,
        chrono::Utc::now().offset().clone(),
    );

    let threshold = chrono::Utc::now() - chrono::Duration::days(LOG_RETENTION_DAYS);

    timestamp < threshold
}

#[cfg(test)]
mod tests {
    use chrono::Duration;

    use super::*;

    #[test]
    fn test_is_outdated_timestamp() {
        let threshold = chrono::Utc::now() - Duration::days(LOG_RETENTION_DAYS);

        let outdated_time = threshold - Duration::minutes(1);
        let outdated_str = outdated_time.format("%Y-%m-%d_%H-%M-%S.%6f").to_string();
        assert!(is_outdated_timestamp(&outdated_str));

        let fresh_time = threshold + Duration::minutes(1);
        let fresh_str = fresh_time.format("%Y-%m-%d_%H-%M-%S.%6f").to_string();
        assert!(!is_outdated_timestamp(&fresh_str));
    }

    #[test]
    fn test_invalid_timestamp() {
        assert!(!is_outdated_timestamp("invalid"));
    }
}
