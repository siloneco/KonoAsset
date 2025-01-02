/*
 * Portions of this file are derived from the vrc-get project, available at
 * vrc-get/vrc-get vrc-get-gui - https://github.com/vrc-get/vrc-get/blob/master/vrc-get-gui/src/logging.rs
 * Copyright (c) 2023 anatawa12 and other contributors
 */

use std::{
    fmt::{Display, Formatter},
    sync::mpsc,
};

use log::{Log, Metadata, Record};
use serde::{Deserialize, Serialize};

pub struct Logger {
    pub sender: mpsc::Sender<LogChannelMessage>,
}

impl Log for Logger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= log::Level::Info
            || metadata.target().starts_with("konoasset") && metadata.level() <= log::Level::Debug
    }

    fn log(&self, record: &Record) {
        if !self.enabled(record.metadata()) {
            return;
        }

        let entry = LogEntry::new(record);
        self.sender.send(LogChannelMessage::Log(entry)).ok();
    }

    fn flush(&self) {
        let (sync, receiver) = mpsc::channel();
        self.sender.send(LogChannelMessage::Flush(sync)).ok();
        receiver.recv().ok();
    }
}

#[derive(
    Serialize, Deserialize, specta::Type, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub enum LogLevel {
    Error = 1,
    Warn,
    Info,
    Debug,
    Trace,
}

impl Display for LogLevel {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            LogLevel::Error => "ERROR".fmt(f),
            LogLevel::Warn => "WARN".fmt(f),
            LogLevel::Info => "INFO".fmt(f),
            LogLevel::Debug => "DEBUG".fmt(f),
            LogLevel::Trace => "TRACE".fmt(f),
        }
    }
}

impl From<log::Level> for LogLevel {
    fn from(value: log::Level) -> Self {
        match value {
            log::Level::Error => LogLevel::Error,
            log::Level::Warn => LogLevel::Warn,
            log::Level::Info => LogLevel::Info,
            log::Level::Debug => LogLevel::Debug,
            log::Level::Trace => LogLevel::Trace,
        }
    }
}

#[derive(Serialize, specta::Type, Clone)]
pub(crate) struct LogEntry {
    #[serde(serialize_with = "to_rfc3339_micros")]
    time: chrono::DateTime<chrono::Local>,
    level: LogLevel,
    target: String,
    message: String,
}

impl LogEntry {
    pub fn new(record: &Record) -> Self {
        LogEntry {
            time: chrono::Local::now(),
            level: record.level().into(),
            target: record.target().to_string(),
            message: format!("{}", record.args()),
        }
    }
}

impl Display for LogEntry {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{} [{: >5}] {}: {}",
            self.time
                .to_rfc3339_opts(chrono::SecondsFormat::Micros, false),
            self.level,
            self.target,
            self.message
        )
    }
}

fn to_rfc3339_micros<S>(
    time: &chrono::DateTime<chrono::Local>,
    serializer: S,
) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    time.to_rfc3339_opts(chrono::SecondsFormat::Micros, false)
        .serialize(serializer)
}

pub enum LogChannelMessage {
    Log(LogEntry),
    Flush(mpsc::Sender<()>),
}
