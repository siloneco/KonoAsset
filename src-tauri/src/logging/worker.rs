/*
 * Portions of this file are derived from the vrc-get project, available at
 * vrc-get/vrc-get vrc-get-gui - https://github.com/vrc-get/vrc-get/blob/master/vrc-get-gui/src/logging.rs
 * Copyright (c) 2023 anatawa12 and other contributors
 */

use std::io::Write;
use std::sync::Mutex;
use std::{path::PathBuf, sync::mpsc};

use ringbuffer::{ConstGenericRingBuffer, RingBuffer};
use tauri::{AppHandle, Manager};

use super::definitions::{LogChannelMessage, LogEntry, Logger};

static LOG_BUFFER: Mutex<ConstGenericRingBuffer<LogEntry, 256>> =
    Mutex::new(ConstGenericRingBuffer::new());

pub fn initialize_logger(app_handle: &AppHandle) {
    let (sender, receiver) = mpsc::channel::<LogChannelMessage>();
    let logger = Logger { sender };

    log::set_max_level(log::LevelFilter::Debug);
    log::set_boxed_logger(Box::new(logger)).expect("error while setting logger");

    start_logging_thread(receiver, &app_handle.path().app_log_dir().unwrap());
}

fn start_logging_thread(receiver: mpsc::Receiver<LogChannelMessage>, logs_dir: &PathBuf) {
    if !logs_dir.exists() {
        std::fs::create_dir_all(&logs_dir).ok();
    }

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
                    buffer.push(entry.clone());
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
